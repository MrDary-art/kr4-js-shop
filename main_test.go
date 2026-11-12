package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestHealth(t *testing.T) {
	request := httptest.NewRequest(http.MethodGet, "/api/health", nil)
	response := httptest.NewRecorder()
	newApplication(t.TempDir()).routes().ServeHTTP(response, request)
	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusOK)
	}
}

func TestCreateOrder(t *testing.T) {
	payload := orderRequest{
		Name: "Анна", Email: "anna@example.ru", Phone: "+7 999 000-00-00",
		Recipient: "Мария", Date: time.Now().Add(24 * time.Hour).Format("2006-01-02"),
		Address: "Москва, Цветной бульвар, 15", Consent: true,
		Items: []orderItem{{ID: 3, Quantity: 2}},
	}
	body, _ := json.Marshal(payload)
	request := httptest.NewRequest(http.MethodPost, "/api/orders", bytes.NewReader(body))
	request.Header.Set("Content-Type", "application/json")
	response := httptest.NewRecorder()
	newApplication(t.TempDir()).routes().ServeHTTP(response, request)
	if response.Code != http.StatusCreated {
		t.Fatalf("status = %d, want %d; body=%s", response.Code, http.StatusCreated, response.Body.String())
	}
}

func TestCreateOrderRejectsEmptyCart(t *testing.T) {
	payload := orderRequest{
		Name: "Анна", Email: "anna@example.ru", Phone: "+7 999 000-00-00",
		Recipient: "Мария", Date: time.Now().Add(24 * time.Hour).Format("2006-01-02"),
		Address: "Москва, Цветной бульвар, 15", Consent: true,
	}
	body, _ := json.Marshal(payload)
	request := httptest.NewRequest(http.MethodPost, "/api/orders", bytes.NewReader(body))
	response := httptest.NewRecorder()
	newApplication(t.TempDir()).routes().ServeHTTP(response, request)
	if response.Code != http.StatusUnprocessableEntity {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusUnprocessableEntity)
	}
}

func TestStaticIndex(t *testing.T) {
	root := t.TempDir()
	indexPath := filepath.Join(root, "index.html")
	if err := os.WriteFile(indexPath, []byte("<!doctype html><title>Flora</title>"), 0o600); err != nil {
		t.Fatal(err)
	}
	request := httptest.NewRequest(http.MethodGet, "/", nil)
	response := httptest.NewRecorder()
	newApplication(root).routes().ServeHTTP(response, request)
	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusOK)
	}
}
