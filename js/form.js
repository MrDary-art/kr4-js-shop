const rules = {
  name: (value) => value.trim().length >= 2 ? "" : "Введите имя — не меньше двух символов.",
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Введите корректный email, например name@example.ru.",
  phone: (value) => value.replace(/\D/g, "").length >= 10 ? "" : "Введите номер минимум из 10 цифр.",
  recipient: (value) => value.trim().length >= 2 ? "" : "Введите имя получателя.",
  address: (value) => value.trim().length >= 8 ? "" : "Укажите улицу, дом и при необходимости квартиру.",
  date: (value) => {
    if (!value) return "Выберите дату доставки.";
    const chosen = new Date(`${value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return chosen >= today ? "" : "Дата доставки не может быть в прошлом.";
  },
  consent: (_, field) => field.checked ? "" : "Подтвердите согласие на обработку данных для связи по заказу."
};

function errorElement(form, name) {
  return form.querySelector(`[data-error-for="${name}"]`);
}

function validateField(form, field) {
  const rule = rules[field.name];
  if (!rule) return "";
  const message = rule(field.value, field);
  const error = errorElement(form, field.name);
  if (error) error.textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
  if (error?.id) field.setAttribute("aria-describedby", error.id);
  return message;
}

function createErrorSummary(form) {
  const summary = document.createElement("div");
  summary.className = "form-error-summary";
  summary.tabIndex = -1;
  summary.setAttribute("role", "alert");
  summary.hidden = true;
  const title = document.createElement("h2");
  title.id = "order-errors-title";
  title.textContent = "Проверьте данные заказа";
  const list = document.createElement("ul");
  summary.setAttribute("aria-labelledby", title.id);
  summary.append(title, list);
  form.prepend(summary);
  return { summary, list };
}

function updateSummary(summary, list, errors) {
  list.replaceChildren();
  errors.forEach(({ field, message }) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${field.id}`;
    link.textContent = message;
    item.append(link);
    list.append(item);
  });
  summary.hidden = errors.length === 0;
}

export function initOrderValidation(form, onSuccess) {
  const { summary, list } = createErrorSummary(form);
  const date = form.elements.date;
  if (date) {
    const today = new Date();
    const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    date.min = local;
  }

  form.querySelectorAll("input, textarea, select").forEach((field) => {
    if (!rules[field.name]) return;
    const eventName = field.type === "checkbox" ? "change" : "blur";
    field.addEventListener(eventName, () => validateField(form, field));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const errors = [];
    Object.keys(rules).forEach((name) => {
      const field = form.elements[name];
      if (!field) return;
      const message = validateField(form, field);
      if (message) errors.push({ field, message });
    });
    updateSummary(summary, list, errors);
    if (errors.length) {
      summary.focus();
      return;
    }
    const formData = Object.fromEntries(new FormData(form));
    onSuccess(formData);
  });
}
