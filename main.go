package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/mail"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"strings"
	"sync/atomic"
	"time"
)

type product struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Price     int    `json:"price"`
	Available bool   `json:"available"`
}

type orderItem struct {
	ID       int `json:"id"`
	Quantity int `json:"quantity"`
}

type orderRequest struct {
	Name           string      `json:"name"`
	Email          string      `json:"email"`
	Phone          string      `json:"phone"`
	ContactMethod  string      `json:"contactMethod"`
	Recipient      string      `json:"recipient"`
	Date           string      `json:"date"`
	Address        string      `json:"address"`
	Time           string      `json:"time"`
	DeliveryOption string      `json:"deliveryOption"`
	Card           string      `json:"card"`
	Comment        string      `json:"comment"`
	Consent        bool        `json:"consent"`
	Items          []orderItem `json:"items"`
}

type application struct {
	root     string
	products []product
	sequence atomic.Uint64
}

var catalog = []product{
	{1, "Розовый сад", 4690, true},
	{2, "Нежное утро", 3490, true},
	{3, "Пионовый сад", 5990, true},
	{4, "Облако", 6490, true},
	{5, "Коралловый свет", 4190, true},
	{6, "Лиловый вечер", 5290, true},
	{7, "Сакура", 3890, true},
	{8, "Белые лилии", 4590, true},
	{9, "Розовая акварель", 4390, true},
	{10, "Солнечный полдень", 3990, true},
	{11, "Гранатовый шёлк", 6790, true},
	{12, "Полевой воздух", 3690, true},
}

func newApplication(root string) *application {
	return &application{root: root, products: catalog}
}

func (app *application) routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/health", app.health)
	mux.HandleFunc("GET /api/products", app.listProducts)
	mux.HandleFunc("POST /api/orders", app.createOrder)
	mux.HandleFunc("/", app.serveStatic)
	return securityHeaders(mux)
}

func securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
		next.ServeHTTP(w, r)
	})
}

func (app *application) health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{"status": "ok", "service": "flora-shop"})
}

func (app *application) listProducts(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, app.products)
}

func (app *application) createOrder(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	var request orderRequest
	if err := decoder.Decode(&request); err != nil {
		var maxBytesError *http.MaxBytesError
		if errors.As(err, &maxBytesError) {
			writeError(w, http.StatusRequestEntityTooLarge, "Слишком большой запрос.")
			return
		}
		writeError(w, http.StatusBadRequest, "Проверьте формат данных заказа.")
		return
	}
	if err := decoder.Decode(&struct{}{}); !errors.Is(err, io.EOF) {
		writeError(w, http.StatusBadRequest, "В запросе должен быть один JSON-объект.")
		return
	}

	if message := app.validateOrder(request); message != "" {
		writeError(w, http.StatusUnprocessableEntity, message)
		return
	}

	var total int
	for _, item := range request.Items {
		for _, product := range app.products {
			if product.ID == item.ID {
				total += product.Price * item.Quantity
				break
			}
		}
	}

	sequence := app.sequence.Add(1)
	orderID := fmt.Sprintf("FLR-%s-%04d", time.Now().Format("20060102"), sequence)
	writeJSON(w, http.StatusCreated, map[string]any{
		"orderId": orderID,
		"status":  "accepted",
		"total":   total,
	})
}

func (app *application) validateOrder(request orderRequest) string {
	if len(strings.TrimSpace(request.Name)) < 2 {
		return "Укажите имя заказчика."
	}
	if _, err := mail.ParseAddress(strings.TrimSpace(request.Email)); err != nil {
		return "Укажите корректный email."
	}
	digits := strings.Map(func(r rune) rune {
		if r >= '0' && r <= '9' {
			return r
		}
		return -1
	}, request.Phone)
	if len(digits) < 10 {
		return "Укажите телефон минимум из 10 цифр."
	}
	if len(strings.TrimSpace(request.Recipient)) < 2 {
		return "Укажите имя получателя."
	}
	if len(strings.TrimSpace(request.Address)) < 8 {
		return "Укажите полный адрес доставки."
	}
	date, err := time.Parse("2006-01-02", request.Date)
	if err != nil || date.Before(time.Now().Truncate(24*time.Hour)) {
		return "Выберите актуальную дату доставки."
	}
	if !request.Consent {
		return "Подтвердите согласие на обработку данных."
	}
	if len(request.Items) == 0 {
		return "Корзина пуста."
	}
	for _, item := range request.Items {
		if item.Quantity < 1 || item.Quantity > 20 {
			return "Некорректное количество товара."
		}
		found := false
		for _, product := range app.products {
			if product.ID == item.ID && product.Available {
				found = true
				break
			}
		}
		if !found {
			return "Один из товаров недоступен."
		}
	}
	return ""
}

func (app *application) serveStatic(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		w.Header().Set("Allow", "GET, HEAD")
		writeError(w, http.StatusMethodNotAllowed, "Метод не поддерживается.")
		return
	}

	cleanPath := path.Clean("/" + r.URL.Path)
	if cleanPath == "/" {
		cleanPath = "/index.html"
	}
	if !allowedStaticPath(cleanPath) {
		http.NotFound(w, r)
		return
	}

	filePath := filepath.Join(app.root, filepath.FromSlash(strings.TrimPrefix(cleanPath, "/")))
	info, err := os.Stat(filePath)
	if err != nil || info.IsDir() {
		http.NotFound(w, r)
		return
	}
	if strings.HasPrefix(cleanPath, "/images/") {
		w.Header().Set("Cache-Control", "public, max-age=604800")
	}
	http.ServeFile(w, r, filePath)
}

func allowedStaticPath(filePath string) bool {
	if strings.Count(strings.TrimPrefix(filePath, "/"), "/") == 0 && strings.HasSuffix(filePath, ".html") {
		return true
	}
	for _, prefix := range []string{"/css/", "/js/", "/images/", "/reports/"} {
		if strings.HasPrefix(filePath, prefix) {
			return true
		}
	}
	return false
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(value); err != nil {
		log.Printf("encode response: %v", err)
	}
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

func main() {
	root, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}
	port := 8080
	if value := os.Getenv("PORT"); value != "" {
		parsed, err := strconv.Atoi(value)
		if err != nil || parsed < 1 || parsed > 65535 {
			log.Fatalf("invalid PORT %q", value)
		}
		port = parsed
	}

	server := &http.Server{
		Addr:              fmt.Sprintf(":%d", port),
		Handler:           newApplication(root).routes(),
		ReadHeaderTimeout: 5 * time.Second,
		IdleTimeout:       60 * time.Second,
	}
	log.Printf("Flora is available at http://localhost:%d", port)
	log.Fatal(server.ListenAndServe())
}
