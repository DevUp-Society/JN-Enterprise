# JN ENTERPRISE | WHOLESALE PROCUREMENT ENGINE

### **Vision**
A minimalist, high-performance portal for global retail supply chains. Designed for efficiency, transparency, and architectural precision in high-volume B2B commerce.

---

## 🛠 Tech Stack (Decoupled Architecture)

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS (v4), Framer Motion, Lucide React |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL & Prisma ORM (Current: High-performance Mock JSON Layer) |
| **Styling** | Vanilla CSS + Tailwind Utility Extraction |

---

## 💎 Core Features

- **The Wholesale Matrix**: Engineering-grade bulk ordering interface allowing retailers to input quantities across all size/color variants in a single view.
- **Category-First UX**: A high-density "China Bazaar" inspired layout optimized for rapid discovery of thousands of SKUs across Textiles, Household, Apparel, and Hardware.
- **Role-Based Access (RBAC)**: Secure, distinct environments for **Admins** (Inventory & Order Orchestration) and **Retailers** (Procurement & Logistics).
- **Global Search**: Sub-second SKU and product name search powered by an architectural indexing system.
- **Custom Apparel Lab**: *(Upcoming)* An integrated design studio for bespoke branding and private label manufacturing.

---

## 🏗 Architecture & Design System

### Architectural Pattern
The system follows a clean **MVC / Service-Repository** pattern, ensuring strict separation of concerns and scalability for enterprise-grade data handling.

### Design Tokens
- **Background**: `#F6F4F2` (Bone)
- **Primary**: `#425664` (Slate Blue)
- **Accent**: `#C6AD8F` (Muted Gold)
- **Grid**: Strict 8px modular grid with 1px hairline borders (5-10% opacity).

---

## 🔄 User Workflow

1.  **Landing**: High-impact introduction with dynamic product showcases.
2.  **Authentication**: Secure JWT-based entry with automatic role-based redirection.
3.  **Discovery**: Rapid browsing via the Category Grid or high-density category streams.
4.  **Procurement**: 
    - `Add to Waiting List` for future stock allocation.
    - `Wholesale Matrix` for precision bulk ordering.
    - `Unified Cart` for consolidated shipment management.
    - `Bulk Checkout` for enterprise payment processing.

---

## 📂 Project Structure

```text
JN_Enterprise/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI (Atomic Design)
│   │   ├── pages/          # Layouts (Home, Shop, Product, Admin)
│   │   ├── store/          # State Management (AuthContext)
│   │   └── utils/          # Formatting & Helpers
│   └── public/             # Static Assets
├── server/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/    # Request Handlers
│   │   ├── services/       # Business Logic
│   │   ├── models/         # Data Schemas
│   │   └── routes/         # API Endpoints
│   └── prisma/             # Database Schema
└── data/                   # Mock JSON Datasets
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm / yarn

### Server Setup
```bash
cd server
npm install
npm run dev
```

### Client Setup
```bash
cd client
npm install
npm run dev
```

The portal will be accessible at `http://localhost:5173`.

---

## 🔐 Test Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@jn.com` | `admin123` | Full Inventory Control |
| **Retailer** | `user@jn.com` | `user123` | Wholesale Catalog & Orders |

---
*Developed for JN Enterprise - The New Standard in Wholesale Supply.*