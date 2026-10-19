# 🏛 VERO - Curated Tech & Modern Living

> A production-grade, editorial full-stack E-Commerce Web Application built for the **GUVI Full Stack Development Project Submission and Viva Examination**, featuring **MongoDB**, **Express.js**, **React 18**, **Node.js**, **Redux State Management**, **JWT Authentication**, and **Role-Based Access Control (RBAC)**.
>
> Designed with an elegant, contemporary retail brand aesthetic featuring warm ivory canvases, deep charcoal typography, refined muted olive accents, and a dual typography system (**Playfair Display** display serif + **Manrope** high-legibility geometric sans-serif).

---

## 📑 Table of Contents
1. [Project Overview & Brand Identity](#-project-overview--brand-identity)
2. [Typography & Design System](#-typography--design-system)
3. [Technology Stack & Architectural Rationale](#-technology-stack--architectural-rationale)
4. [Folder Structure](#-folder-structure)
5. [Pre-configured Demo Credentials](#-pre-configured-demo-credentials)
6. [Quick Start Installation Guide (Windows)](#-quick-start-installation-guide-windows)
7. [Redux State Management Architecture](#-redux-state-management-architecture)
8. [Complete Shopping Cart to Order Workflow](#-complete-shopping-cart-to-order-workflow)
9. [Database Schema & Models](#-database-schema--models)
10. [REST API Endpoints Specification](#-rest-api-endpoints-specification)
11. [Step-by-Step Viva Presentation Script](#-step-by-step-viva-presentation-script)
12. [Common Viva Questions & Model Answers](#-common-viva-questions--model-answers)
13. [Security & Data Integrity Measures](#-security--data-integrity-measures)

---

## 🌟 Project Overview & Brand Identity

**VERO** transforms standard online commerce into a tactile, editorial retail experience for acoustics, optical precision, computing workstations, and interactive technology:

- **Brand Essence**: *VERO* (meaning "true" and "authentic") represents quiet craftsmanship, honest specifications, and durable hardware.
- **Editorial Storefront**:
  - Warm ivory and sand background canvas (`#FAF8F5`, `#F5F1EA`).
  - Deep charcoal typography (`#181816`) paired with Playfair Display editorial headings and Manrope body/UI text.
  - Refined muted olive accents (`#2D4436`) with subtle, authentic status indicators.
  - Asymmetric editorial hero showcasing curated studio photography.
  - Explore by Department cards, authentic brand ethos manifesto ("Our Story"), and functional newsletter dispatch ("The Gazette").
- **Redux Shopping Cart**: Global cart state persisted across page reloads via `localStorage`, quantity increment/decrement controls, live subtotal calculations, dynamic navbar badge, and empty cart handling.
- **Multi-Step Checkout**: 4-step linear flow (`01 Identification` ➔ `02 Shipping Address` ➔ `03 Payment Method` ➔ `04 Final Review`).
- **Server-Side Price Security**: Order pricing, tax, and shipping calculations are strictly enforced on the server using trusted database prices to prevent frontend price-tampering attacks.
- **Simulated Instant Payment**: Zero-configuration demo payment gateway allowing 1-click verified transactions during viva demonstrations, updating database status without storing sensitive cardholder details.
- **Customer Account & Order History**: User profile updating and a personal "My Orders" dashboard with historical item price snapshots and real-time delivery status.
- **Admin Management Hub**:
  - **Product CRUD**: Create new items, edit specifications/pricing/stock, and soft/hard delete inventory.
  - **Order Management**: Inspect all customer orders and mark orders as delivered.
  - **User Management**: Inspect registered accounts, toggle administrator privileges, and safety guards preventing accidental deletion or demotion of the last active administrator.
- **Database Resilience**: Native MongoDB connectivity with automatic zero-configuration fallback to an **In-Memory MongoDB Server** (`mongodb-memory-server`), ensuring the project runs seamlessly on any evaluation machine without pre-installed database daemons.

---

## ✒️ Typography & Design System

The application enforces a disciplined two-family typography system:

| Role | Font Family | Weights | Applied To |
| :--- | :--- | :--- | :--- |
| **Display / Editorial** | **Playfair Display** (Serif) | 400 (Regular), 500 (Medium), 600 (Semibold) | Hero headlines, main page titles, section headings, quote statements, editorial manifestos. |
| **Body & UI** | **Manrope** (Sans-Serif) | 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold) | Body copy, navigation links, buttons, product titles, descriptions, prices, forms, tables, admin dashboard, and receipts. |

### CSS Variables:
```css
:root {
  --font-display: "Playfair Display", Georgia, serif;
  --font-body: "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

---

## 🛠 Technology Stack & Architectural Rationale

| Tier | Technology | Why This Technology Was Chosen |
| :--- | :--- | :--- |
| **Frontend UI** | **React 18 + Vite** | High-performance virtual DOM diffing, component-driven UI, instant Hot Module Replacement (HMR). |
| **State Management** | **Redux + Redux Toolkit** | Centralized, predictable unidirectional state container; persistent cart and auth tokens across browser sessions. |
| **Styling & Fonts** | **Tailwind CSS + Playfair Display & Manrope** | Modern, utility-first design system with warm ivory canvas, charcoal typography, and olive accents. |
| **Routing** | **React Router DOM v7** | Client-side routing with protected routes, search params handling, and redirect awareness. |
| **Backend API** | **Node.js + Express.js** | Non-blocking event-driven I/O model, modular router architecture, and cross-platform JavaScript uniformity. |
| **Database** | **MongoDB + Mongoose ODM** | Flexible document-oriented JSON schema ideal for e-commerce catalogs and order item snapshots. |
| **Database Fallback** | **MongoDB Memory Server** | Spins up an in-memory replica if local MongoDB daemon is unreachable, enabling 100% zero-configuration evaluations. |
| **Authentication** | **JWT (JSON Web Tokens)** | Stateless Bearer token authorization with 30-day expiration and tamper-resistant cryptographic signatures. |
| **Password Security**| **Bcrypt.js (10 salt rounds)** | Industry-standard password hashing protecting against rainbow table and brute-force attacks. |

---

## 📁 Folder Structure

```
FullStackProject/
│
├── backend/                            # Node.js & Express REST API Backend
│   ├── config/
│   │   └── db.js                       # MongoDB connection & auto-seeding engine
│   ├── controllers/
│   │   ├── productController.js        # Catalog & admin product CRUD controllers
│   │   ├── userController.js           # Auth, profile, and admin user controllers
│   │   └── orderController.js          # Order placement, price validation & status
│   ├── data/
│   │   ├── products.js                 # Sample product inventory dataset
│   │   └── users.js                    # Demo user & admin seed records
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT verification (protect) & admin guards
│   │   └── errorMiddleware.js          # 404 handler and unified JSON error handler
│   ├── models/
│   │   ├── userModel.js                # User schema with bcrypt pre-save hook
│   │   ├── productModel.js             # Product catalog schema
│   │   └── orderModel.js               # Order schema with shipping & payment snapshot
│   ├── routes/
│   │   ├── productRoutes.js            # /api/products
│   │   └── userRoutes.js               # /api/users
│   │   └── orderRoutes.js              # /api/orders
│   ├── utils/
│   │   └── generateToken.js            # JWT signing helper
│   ├── seeder.js                       # CLI database import/destroy script
│   ├── server.js                       # Express app entry point
│   ├── test_full_workflow.js           # 15-point End-to-End integration test suite
│   ├── package.json                    # Backend dependencies & test scripts
│   ├── .env                            # Local environment variables
│   └── .env.example                    # Environment variable template
│
├── frontend/                           # React 18 + Vite Storefront & Admin
│   ├── src/
│   │   ├── actions/                    # Redux action creators (Async Thunks)
│   │   │   ├── cartActions.js          # addToCart, updateCartQty, removeFromCart, checkout
│   │   │   ├── userActions.js          # login, logout, register, profile, admin users
│   │   │   ├── productActions.js       # listProducts, details, admin product CRUD
│   │   │   └── orderActions.js         # createOrder, getOrderDetails, pay, deliver
│   │   ├── constants/                  # Redux action type constants
│   │   │   ├── cartConstants.js
│   │   │   ├── userConstants.js
│   │   │   ├── productConstants.js
│   │   │   └── orderConstants.js
│   │   ├── reducers/                   # Pure reducer functions
│   │   │   ├── cartReducers.js
│   │   │   ├── userReducers.js
│   │   │   ├── productReducers.js
│   │   │   └── orderReducers.js
│   │   ├── components/                 # Reusable UI components
│   │   │   ├── Header.jsx              # VERO navbar with search, live cart badge, account menus
│   │   │   ├── Footer.jsx              # Editorial ethos, manifestos, and curated links
│   │   │   ├── Product.jsx             # Product card with framed imagery & Quick Add
│   │   │   ├── CheckoutSteps.jsx       # 4-stage numbered progress indicator
│   │   │   ├── Loader.jsx              # Minimalist olive/sand loading spinner
│   │   │   └── Message.jsx             # Subtle editorial alert banners
│   │   ├── pages/                      # Page components & views
│   │   │   ├── HomePage.jsx            # Asymmetric hero, department cards, catalog grid, ethos
│   │   │   ├── ProductPage.jsx         # Architectural 2-column gallery, specs, tactile stepper
│   │   │   ├── CartPage.jsx            # Clean shopping bag layout, steppers, order summary
│   │   │   ├── LoginPage.jsx           # Sign in with 1-click evaluation credential fills
│   │   │   ├── RegisterPage.jsx        # Customer registration with validation
│   │   │   ├── ProfilePage.jsx         # Profile edit & integrated order history
│   │   │   ├── ShippingPage.jsx        # Step 2: Shipping address form
│   │   │   ├── PaymentPage.jsx         # Step 3: Payment method selection
│   │   │   ├── PlaceOrderPage.jsx      # Step 4: Final order review & placement
│   │   │   ├── OrderPage.jsx           # Order details receipt & demo payment
│   │   │   ├── ProductListPage.jsx     # Admin product inventory table
│   │   │   ├── ProductEditPage.jsx     # Admin product creator & editor
│   │   │   ├── OrderListPage.jsx       # Admin all customer orders dashboard
│   │   │   ├── UserListPage.jsx        # Admin user accounts management
│   │   │   └── UserEditPage.jsx        # Admin user role assignment
│   │   ├── store.js                    # Redux store with localStorage preloading
│   │   ├── App.jsx                     # Routing table
│   │   ├── main.jsx                    # React root with Redux Provider
│   │   └── index.css                   # Tailwind styling & custom scrollbar
│   ├── package.json                    # Frontend dependencies
│   ├── vite.config.js                  # Vite configuration
│   └── index.html                      # HTML5 entry with editorial Google Fonts
│
├── run_backend.bat                     # 1-Click launcher for Express Backend
├── run_frontend.bat                    # 1-Click launcher for React Frontend
├── run_all.bat                         # 1-Click launcher for Full Application
├── .gitignore                          # Excludes node_modules, .env, build output
└── README.md                           # Comprehensive documentation & viva guide
```

---

## 🔑 Pre-configured Demo Credentials

For swift, error-free project demonstration during evaluation sessions, the database is pre-seeded with tested accounts. The Sign-In screen features **1-Click Demo Fill buttons**:

| Account Type | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Store Customer** | `john@example.com` | `password123` | Browse, Cart, Checkout, Profile, My Orders |
| **Store Administrator** | `admin@example.com` | `password123` | Full access + Product CRUD, Order & User Management |

---

## 🚀 Quick Start Installation Guide (Windows)

### Option A: The One-Click Way (Recommended)
Double-click **`run_all.bat`** in the project root directory. This automatically launches both services in separate terminal windows:
1. **Backend Server**: Live at `http://localhost:5000`
2. **Frontend Storefront**: Live at `http://localhost:5173`

---

### Option B: Step-by-Step Manual Setup

#### Step 1: Backend Setup
Open a PowerShell / Windows Terminal window:
```powershell
cd FullStackProject\backend

# 1. Install dependencies
npm install

# 2. Run automated verification tests
npm test

# 3. Start development server
npm run dev
```

#### Step 2: Frontend Setup
Open a second PowerShell / Windows Terminal window:
```powershell
cd FullStackProject\frontend

# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

Open your browser and navigate to:
👉 **`http://localhost:5173`**

---

## 🔄 Redux State Management Architecture

VERO implements a clean, scalable Redux pattern combining traditional action constants and reducers with Redux Toolkit's `configureStore`:

```mermaid
graph TD
    UI[React Components / Pages] -->|dispatch action| AC[Action Creators (Async Thunks)]
    AC -->|HTTP Request / API| Backend[Express REST API]
    Backend -->|JSON Response| AC
    AC -->|dispatch type & payload| Reducers[Pure Reducers]
    Reducers -->|update state & sync localStorage| Store[Central Redux Store]
    Store -->|useSelector re-render| UI
```

### Registered Redux Slices:
1. **`cart`**: `cartItems`, `shippingAddress`, `paymentMethod`. Preloaded from `localStorage` so items survive page refresh.
2. **`userLogin` & `userRegister`**: `userInfo` (containing user profile and JWT token), persisted in `localStorage`.
3. **`userDetails` & `userUpdateProfile`**: Profile viewing and editing state.
4. **`productList` & `productDetails`**: Catalog search, category filtering, and product view state.
5. **`productCreate`, `productUpdate`, `productDelete`**: Admin product inventory state.
6. **`orderCreate`**: Order placement state and response.
7. **`orderDetails`, `orderPay`, `orderDeliver`**: Order receipts, simulated payment confirmation, and delivery fulfillment.
8. **`orderListMy` & `orderList`**: Personal customer order history and admin all-orders table.
9. **`userList`, `userUpdate`, `userDelete`**: Admin user management state.

---

## 📦 Complete Shopping Cart to Order Workflow

The application implements a validated 13-stage shopping cycle:

1. **Catalog Browsing**: Customer browses products on `HomePage` or uses real-time search and category filtering.
2. **Product Details & Add to Cart**: Customer inspects specs on `ProductPage`, selects quantity (restricted by `countInStock`), and clicks **Add to Shopping Bag**.
3. **Cart Management**: On `CartPage`, items are displayed with unit price, tactile quantity stepper, line totals, and remove buttons. Subtotal and item count update dynamically.
4. **State Persistence**: On browser refresh, `store.js` re-hydrates `cartItems` from `localStorage`.
5. **Checkout Navigation**: Clicking **Proceed to Checkout** checks authentication. If not signed in, the user is redirected to `/login?redirect=shipping`.
6. **Shipping Information**: Authenticated user fills out street address, city, postal code, and country on `ShippingPage`. Dispatches `saveShippingAddress`.
7. **Payment Selection**: On `PaymentPage`, user selects **VERO Instant Settlement** (or PayPal / Cash on Delivery). Dispatches `savePaymentMethod`.
8. **Place Order Review**: `PlaceOrderPage` displays shipping address, payment method, items list, subtotal, shipping charge (Complimentary if &gt; $100, else $15), tax (15%), and grand total.
9. **Server-Side Price Security**: On clicking **Confirm & Authorize**, the backend fetches each item by ID from MongoDB, verifies available stock, decrements inventory, and recalculates the grand total using trusted database prices.
10. **Cart Clearing**: Upon order creation (HTTP 201), the frontend clears `cartItems` in both Redux and `localStorage`.
11. **Order Details Screen**: User is redirected to `/order/:id`, which displays the persisted order snapshot, payment status, and delivery status.
12. **Simulated Payment**: Clicking **Authorize Payment** dispatches `payOrder`, which calls `PUT /api/orders/:id/pay`. Backend updates `isPaid: true` and records the transaction timestamp.
13. **Order History**: User navigates to `ProfilePage` to see the newly placed order in their **My Orders** table.
14. **Admin Fulfillment**: Administrator logs in, navigates to `/admin/orderlist`, opens the order, and clicks **Confirm Delivery (Admin)**, triggering `PUT /api/orders/:id/deliver`.

---

## 🗄 Database Schema & Models

### 1. `User` Schema
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Bcrypt hash
  isAdmin: { type: Boolean, required: true, default: false },
  createdAt: Date,
  updatedAt: Date
}
```

### 2. `Product` Schema
```javascript
{
  user: { type: ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
  createdAt: Date,
  updatedAt: Date
}
```

### 3. `Order` Schema
```javascript
{
  user: { type: ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: { type: ObjectId, ref: 'Product', required: true }
    }
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true, default: 'Demo Payment' },
  paymentResult: { id: String, status: String, update_time: String, email_address: String },
  itemsPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  taxPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌐 REST API Endpoints Specification

All endpoints are mounted under `/api`:

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Fetch all products with search & category filters |
| `GET` | `/api/products/:id` | Public | Fetch single product details by ID |
| `POST` | `/api/products` | Admin | Create a new product in store catalog |
| `PUT` | `/api/products/:id` | Admin | Update product details, stock, or price |
| `DELETE` | `/api/products/:id` | Admin | Remove product from store catalog |

### Users & Authentication (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/login` | Public | Authenticate user & return JWT token |
| `POST` | `/api/users` | Public | Register a new customer account |
| `GET` | `/api/users/profile` | Private | Fetch logged-in user profile |
| `PUT` | `/api/users/profile` | Private | Update logged-in user profile & password |
| `GET` | `/api/users` | Admin | List all registered user accounts |
| `GET` | `/api/users/:id` | Admin | Get user account details by ID |
| `PUT` | `/api/users/:id` | Admin | Update user details & admin privileges |
| `DELETE` | `/api/users/:id` | Admin | Delete user account (guarded against self/last-admin) |

### Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Private | Place new order with server-side price validation |
| `GET` | `/api/orders/myorders`| Private | Retrieve personal order history for logged-in user |
| `GET` | `/api/orders/:id` | Private/Owner/Admin | Retrieve single order details receipt |
| `PUT` | `/api/orders/:id/pay` | Private/Owner | Record verified payment for an order |
| `PUT` | `/api/orders/:id/deliver` | Admin | Mark order fulfillment status as delivered |
| `GET` | `/api/orders` | Admin | Retrieve all store orders across all users |

---

## 🎤 Step-by-Step Viva Presentation Script

Follow this 5-minute presentation script during your project evaluation:

1. **Introduction (1 min)**:
   - *&quot;Good morning, respected evaluators. Today I present VERO, a full-stack MERN e-commerce web application featuring MongoDB, Express.js, React 18, Node.js, and Redux state management.&quot;*
   - Show the **Home Page**: Point out the editorial hero banner, department cards, responsive product cards with instant stock badges, live search, and warm ivory/charcoal styling.
2. **Shopping Cart & Redux State (1 min)**:
   - Click **Add to Bag** on a product card or open a product details page.
   - Show the **Shopping Bag**: Change quantities with tactile stepper buttons, show that the line totals, item count, and subtotal update instantly.
   - **Demonstrate Persistence**: Refresh the browser page (`F5`) and show that the cart items remain intact because Redux is synchronized with `localStorage`.
3. **Multi-Step Checkout Flow (1.5 min)**:
   - Click **Proceed to Checkout**.
   - Show the **Sign In** screen: Click the **&quot;Client Access&quot;** 1-click demo button (`john@example.com` / `password123`) to log in immediately.
   - Proceed through **Shipping Address** and **Payment Method** (`VERO Instant Settlement`).
   - Land on **Place Order**: Explain that pricing is calculated on both ends, but *never trusted from the client*. Click **Confirm & Authorize**.
4. **Order Confirmation & Demo Payment (1 min)**:
   - Show the generated **Order Receipt** page with Order ID and item snapshot.
   - Point out the **&quot;Pending Authorization&quot;** status badge.
   - Click **&quot;Authorize Payment&quot;**: Show the status immediately transition to **&quot;Settled & Verified&quot;** with green badge and timestamp.
   - Navigate to **Profile Page**: Show the newly placed order listed in the **Acquisition History** table.
5. **Admin Hub & Security Verification (0.5 min)**:
   - Sign out and click **&quot;Admin Access&quot;** demo fill (`admin@example.com` / `password123`).
   - Show the **Admin** dropdown menu in the navbar:
     - Open **Manage Products**: Show the product inventory table, click edit on a product, or show the create button.
     - Open **Manage Orders**: Show that the admin can view all customer orders and click **Confirm Delivery**.
     - Open **Manage Users**: Show user list and safety controls.

---

## ❓ Common Viva Questions & Model Answers

### Q1: What is the MERN stack and why is it suitable for an e-commerce platform?
> **Answer**: MERN stands for **MongoDB, Express.js, React.js, and Node.js**. It enables a unified JavaScript/TypeScript development model across both client and server tiers. MongoDB's document model naturally represents nested e-commerce data like shopping cart item snapshots and addresses. Express and Node.js provide asynchronous, high-throughput REST APIs, while React provides a reactive, component-driven user interface.

### Q2: Why did you use Redux for the shopping cart instead of local React component state?
> **Answer**: Shopping cart data is required across disparate components that do not share a direct parent-child relationship (e.g., the Cart badge in the top Navigation bar, product cards on the Home page, the dedicated Cart page, and the Checkout review screens). Redux centralizes this state in a single immutable store, ensuring immediate, predictable updates everywhere without prop drilling, while allowing persistence via `localStorage`.

### Q3: Why is server-side price validation critical during order creation?
> **Answer**: A major vulnerability in poorly architected web applications is client-side price tampering, where an attacker intercepts HTTP requests to submit an item price of `$0.01`. In ProShop, the backend **never trusts totals or prices submitted in the request body**. Instead, `orderController.js` queries MongoDB using each item's `product` ID, pulls the trusted price from the database, checks stock availability, and calculates the subtotal, tax, shipping, and grand total entirely on the server.

### Q4: How does JWT authentication protect private and admin routes?
> **Answer**: When a user logs in, the backend signs a JSON Web Token containing the user's `id` using a cryptographic secret (`JWT_SECRET`). The client includes this token as an `Authorization: Bearer <token>` header on subsequent requests. Our `protect` middleware decodes and verifies the token, attaching the user record to `req.user`. Admin routes append the `admin` middleware, which checks `req.user.isAdmin === true` before granting access.

### Q5: How does the application handle database connectivity if MongoDB is not installed locally?
> **Answer**: Our database configuration (`backend/config/db.js`) includes an automatic fallback mechanism. It attempts to connect to `mongodb://localhost:27017/ecommerce` with a 2.5-second timeout. If unreachable, it automatically spins up an in-memory replica using `mongodb-memory-server` and seeds demo products and accounts. This guarantees that evaluators can run the project on any computer with zero manual database setup.

### Q6: How do you prevent accidental removal or lockout of administrators?
> **Answer**: In `userController.js`, both the `deleteUser` and `updateUser` endpoints contain defensive guards:
> 1. An administrator cannot delete their own active account (`user._id === req.user._id`).
> 2. The server queries `User.countDocuments({ isAdmin: true })`. If only one administrator remains, the server rejects deletion or demotion with an HTTP 400 error, guaranteeing that the platform cannot be locked out.

---

## 🔒 Security & Data Integrity Measures

1. **Password Hashing**: Passwords are never stored in plain text. Mongoose `pre('save')` hooks hash passwords using **Bcrypt.js** with 10 salt rounds.
2. **Multi-Tenant Data Isolation**: Non-admin users can query and inspect only orders associated with their own `req.user._id`. Querying another user's order ID returns an HTTP 403 Forbidden response.
3. **Atomic Stock Decrement**: Placing an order validates that `product.countInStock >= item.qty` and decrements available stock immediately to prevent overselling.
4. **Historical Price Snapshot**: The `orderItems` sub-documents store a snapshot of the product name, price, and image at the exact moment of purchase. If a seller edits a product's price later, historical receipts remain unchanged.
5. **CORS & Environment Variables**: Configured with `cors` middleware, and all database URIs, JWT secrets, and port configurations reside in `.env` files with `.env.example` templates provided.

---

*VERO © 2026 - Curated Tech & Modern Living. Crafted for Full-Stack Excellence.*
