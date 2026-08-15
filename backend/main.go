package main

import (
	"encoding/json"
	"log"
	"net/http"
)

/* ================= USER ================= */

type User struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Role      string `json:"role"`
	CreatedAt string `json:"createdAt"`
}

/* ================= DASHBOARD ================= */

type Dashboard struct {
	TotalUsers     int        `json:"totalUsers"`
	TotalOrders    int        `json:"totalOrders"`
	TotalRevenue   float64    `json:"totalRevenue"`
	Growth         float64    `json:"growth"`
	RecentActivity []Activity `json:"recentActivity"`
	RecentOrders   []Order    `json:"recentOrders"`
}

type Activity struct {
	ID      int    `json:"id"`
	Type    string `json:"type"`
	Message string `json:"message"`
	Time    string `json:"time"`
}

/* ================= ORDERS ================= */

type Order struct {
	ID       int     `json:"id"`
	Customer string  `json:"customer"`
	Product  string  `json:"product"`
	Amount   float64 `json:"amount"`
	Status   string  `json:"status"`
}

/* ================= PRODUCTS ================= */

type Product struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Category string  `json:"category"`
	Price    float64 `json:"price"`
	Stock    int     `json:"stock"`
	Status   string  `json:"status"`
}

/* ================= CONTACT ================= */

type ContactMessage struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

/* ================= USER DATA ================= */

var user = User{
	ID:        1,
	Name:      "balaboza",
	Username:  "ahmed",
	Email:     "ahmed@example.com",
	Phone:     "01000000000",
	Role:      "User",
	CreatedAt: "August 12, 2026",
}

/* ================= DASHBOARD DATA ================= */

var dashboard = Dashboard{

	TotalUsers:   1248,
	TotalOrders:  356,
	TotalRevenue: 45280.50,
	Growth:       12.5,

	RecentActivity: []Activity{

		{
			ID:      1,
			Type:    "user",
			Message: "New user registered",
			Time:    "5 minutes ago",
		},

		{
			ID:      2,
			Type:    "order",
			Message: "New order #1024 received",
			Time:    "20 minutes ago",
		},

		{
			ID:      3,
			Type:    "payment",
			Message: "Payment received successfully",
			Time:    "1 hour ago",
		},

		{
			ID:      4,
			Type:    "profile",
			Message: "Profile information updated",
			Time:    "2 hours ago",
		},
	},

	RecentOrders: []Order{

		{
			ID:       1024,
			Customer: "Ahmed Samir",
			Product:  "Premium Plan",
			Amount:   1200,
			Status:   "Completed",
		},

		{
			ID:       1023,
			Customer: "Mohamed Ali",
			Product:  "Basic Plan",
			Amount:   500,
			Status:   "Pending",
		},

		{
			ID:       1022,
			Customer: "Omar Hassan",
			Product:  "Premium Plan",
			Amount:   1200,
			Status:   "Completed",
		},

		{
			ID:       1021,
			Customer: "Youssef Adel",
			Product:  "Basic Plan",
			Amount:   500,
			Status:   "Cancelled",
		},
	},
}

/* ================= ORDERS DATA ================= */

var orders = []Order{

	{
		ID:       1024,
		Customer: "Ahmed Samir",
		Product:  "Premium Plan",
		Amount:   1200,
		Status:   "Completed",
	},

	{
		ID:       1023,
		Customer: "Mohamed Ali",
		Product:  "Basic Plan",
		Amount:   500,
		Status:   "Pending",
	},

	{
		ID:       1022,
		Customer: "Omar Hassan",
		Product:  "Premium Plan",
		Amount:   1200,
		Status:   "Completed",
	},

	{
		ID:       1021,
		Customer: "Youssef Adel",
		Product:  "Basic Plan",
		Amount:   500,
		Status:   "Cancelled",
	},
}

/* ================= PRODUCTS DATA ================= */

var products = []Product{

	{
		ID:       1,
		Name:     "Premium Plan",
		Category: "Plans",
		Price:    1200,
		Stock:    25,
		Status:   "Active",
	},

	{
		ID:       2,
		Name:     "Basic Plan",
		Category: "Plans",
		Price:    500,
		Stock:    50,
		Status:   "Active",
	},

	{
		ID:       3,
		Name:     "GreenTree T-Shirt",
		Category: "Clothing",
		Price:    350,
		Stock:    18,
		Status:   "Active",
	},

	{
		ID:       4,
		Name:     "GreenTree Hoodie",
		Category: "Clothing",
		Price:    750,
		Stock:    8,
		Status:   "Low Stock",
	},
}

/* ================= CONTACT DATA ================= */

var contactMessages []ContactMessage

/* ================= CORS ================= */

func enableCORS(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set(
			"Access-Control-Allow-Origin",
			"*",
		)

		w.Header().Set(
			"Access-Control-Allow-Methods",
			"GET, PUT, POST, OPTIONS",
		)

		w.Header().Set(
			"Access-Control-Allow-Headers",
			"Content-Type",
		)

		if r.Method == http.MethodOptions {

			w.WriteHeader(http.StatusOK)

			return
		}

		next.ServeHTTP(w, r)
	})
}

/* ================= USER API ================= */

func userHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	switch r.Method {

	case http.MethodGet:

		json.NewEncoder(w).Encode(user)

	case http.MethodPut:

		var updatedUser User

		err := json.NewDecoder(
			r.Body,
		).Decode(&updatedUser)

		if err != nil {

			http.Error(
				w,
				"Invalid JSON",
				http.StatusBadRequest,
			)

			return
		}

		updatedUser.ID = user.ID
		updatedUser.Username = user.Username
		updatedUser.Role = user.Role
		updatedUser.CreatedAt = user.CreatedAt

		user = updatedUser

		json.NewEncoder(w).Encode(user)

	default:

		http.Error(
			w,
			"Method not allowed",
			http.StatusMethodNotAllowed,
		)
	}
}

/* ================= DASHBOARD API ================= */

func dashboardHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	if r.Method != http.MethodGet {

		http.Error(
			w,
			"Method not allowed",
			http.StatusMethodNotAllowed,
		)

		return
	}

	json.NewEncoder(w).Encode(dashboard)
}

/* ================= ORDERS API ================= */

func ordersHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	if r.Method != http.MethodGet {

		http.Error(
			w,
			"Method not allowed",
			http.StatusMethodNotAllowed,
		)

		return
	}

	json.NewEncoder(w).Encode(orders)
}

/* ================= PRODUCTS API ================= */

func productsHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	if r.Method != http.MethodGet {

		http.Error(
			w,
			"Method not allowed",
			http.StatusMethodNotAllowed,
		)

		return
	}

	json.NewEncoder(w).Encode(products)
}

/* ================= CONTACT API ================= */

func contactHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	if r.Method != http.MethodPost {

		http.Error(
			w,
			"Method not allowed",
			http.StatusMethodNotAllowed,
		)

		return
	}

	var contact ContactMessage

	err := json.NewDecoder(
		r.Body,
	).Decode(&contact)

	if err != nil {

		http.Error(
			w,
			"Invalid JSON",
			http.StatusBadRequest,
		)

		return
	}

	if contact.Name == "" ||
		contact.Email == "" ||
		contact.Message == "" {

		http.Error(
			w,
			"Name, email and message are required",
			http.StatusBadRequest,
		)

		return
	}

	contactMessages =
		append(
			contactMessages,
			contact,
		)

	log.Println(
		"New contact message",
	)

	log.Println(
		"Name:",
		contact.Name,
	)

	log.Println(
		"Email:",
		contact.Email,
	)

	log.Println(
		"Message:",
		contact.Message,
	)

	json.NewEncoder(w).Encode(
		map[string]string{
			"message": "Message received successfully",
		},
	)
}

/* ================= MAIN ================= */

func main() {

	/* USER */

	http.Handle(
		"/api/user",
		enableCORS(
			http.HandlerFunc(
				userHandler,
			),
		),
	)

	/* DASHBOARD */

	http.Handle(
		"/api/dashboard",
		enableCORS(
			http.HandlerFunc(
				dashboardHandler,
			),
		),
	)

	/* ORDERS */

	http.Handle(
		"/api/orders",
		enableCORS(
			http.HandlerFunc(
				ordersHandler,
			),
		),
	)

	/* PRODUCTS */

	http.Handle(
		"/api/products",
		enableCORS(
			http.HandlerFunc(
				productsHandler,
			),
		),
	)

	/* CONTACT */

	http.Handle(
		"/api/contact",
		enableCORS(
			http.HandlerFunc(
				contactHandler,
			),
		),
	)

	/* SERVER */

	log.Println(
		"Go server running on http://localhost:8080",
	)

	err := http.ListenAndServe(
		":8080",
		nil,
	)

	if err != nil {

		log.Fatal(err)
	}
}
