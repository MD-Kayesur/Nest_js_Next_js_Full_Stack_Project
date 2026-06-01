# Full-Stack Implementation & File Structure Guide

This document serves as the master blueprint for the entire project, describing both the backend (`/api`) and the frontend (`/frontend`) structures, current backend fixes required, and the frontend implementation flow.

---

## 1. Directory Structures

Below is the directory map of both the NestJS Backend and the Next.js Frontend.

### 📂 Backend Structure (`api/`)
```text
api/
├── prisma/
│   ├── schema.prisma           # Master Prisma schemas (User, Category, Order, Payment)
│   └── product.prisma          # Product Prisma schema configuration
├── src/
│   ├── main.ts                 # Application entry point (needs CORS enabled)
│   ├── app.module.ts           # Root module importing all feature modules
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── common/                 # Global filters, guards, and decorators
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts  # Standardizes API error formats
│   │   └── guards/
│   │       ├── jwt-auth.guard.ts         # Protects endpoints with JWT verification
│   │       └── roles.guard.ts            # Protects endpoints based on roles (ADMIN, USER)
│   ├── prisma/
│   │   └── prisma.service.ts   # Prisma DB client connection wrapper
│   └── modules/                # Feature Modules
│       ├── auth/               # User Authentication & JWT Refresh flow
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── auth.module.ts
│       │   ├── dto/
│       │   │   ├── login.dto.ts
│       │   │   └── register.dto.ts
│       │   ├── guards/
│       │   └── strategies/
│       │       └── jwt.strategy.ts
│       ├── users/              # User Profile and Roles management
│       │   ├── users.controller.ts
│       │   ├── users.service.ts
│       │   └── users.module.ts
│       ├── products/           # Product Catalog endpoints
│       │   ├── products.controller.ts
│       │   ├── products.service.ts
│       │   └── products.module.ts
│       ├── category/           # Categories definition endpoints
│       │   ├── category.controller.ts
│       │   ├── category.service.ts
│       │   └── category.module.ts
│       ├── orders/             # Checkout and Order Processing
│       │   ├── orders.controller.ts
│       │   ├── orders.service.ts
│       │   └── orders.module.ts
│       └── payments/           # Simulated Stripe payments
│           ├── payments.controller.ts
│           ├── payments.service.ts
│           └── payments.module.ts
```

### 📂 Frontend Structure (`frontend/`)
```text
frontend/
├── public/                     # Static files (logos, placeholder banners)
├── src/
│   ├── app/                    # Next.js App Router Pages
│   │   ├── (auth)/             # Login & Registration Pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (shop)/             # E-Commerce Public Pages
│   │   │   ├── page.tsx        # Homepage (Hero, Featured Products, Categories)
│   │   │   ├── products/
│   │   │   │   ├── page.tsx    # Search, filter, and list products
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # Product details, SKU, and Stock verification
│   │   │   ├── cart/
│   │   │   │   └── page.tsx    # Responsive Shopping Cart overview
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx    # Checkout Form (Shipping details)
│   │   │   └── layout.tsx
│   │   ├── (user)/             # Customer Dashboard
│   │   │   ├── profile/
│   │   │   │   └── page.tsx    # Edit profile details & view order history
│   │   │   └── layout.tsx
│   │   ├── admin/              # Admin-only Panel (Role Guard protected)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx    # Sales, users, and order metrics
│   │   │   ├── products/
│   │   │   │   └── page.tsx    # CRUD for Products (Add/Edit modals)
│   │   │   ├── categories/
│   │   │   │   └── page.tsx    # CRUD for Categories
│   │   │   ├── orders/
│   │   │   │   └── page.tsx    # Order Status manager (PENDING -> SHIPPED)
│   │   │   └── layout.tsx
│   │   ├── layout.tsx          # Root Layout (Redux Wrapper, Google Font)
│   │   └── globals.css         # Custom Tailwind Styles and Transitions
│   ├── components/             # Reusable UI Components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── GlassCard.tsx   # Premium blurred background component
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx
│   │   │   └── CartItem.tsx
│   │   └── layout/
│   │       ├── Navbar.tsx      # Main site navigation with responsive side-drawer
│   │       └── Sidebar.tsx     # Admin specific layout menu
│   ├── store/                  # Redux State Management
│   │   ├── slices/
│   │   │   ├── authSlice.ts    # User details and session tokens
│   │   │   └── cartSlice.ts    # Local shopping cart states
│   │   ├── services/           # RTK Query integrations
│   │   │   ├── api.ts          # Custom Base Query with Silent Token Rotation
│   │   │   ├── authApi.ts
│   │   │   ├── productsApi.ts
│   │   │   └── ordersApi.ts
│   │   └── index.ts            # Global store setup & hook exports
│   ├── types/                  # Shared TypeScript interfaces
│   │   └── index.ts            # Defines User, Product, Category, Order structures
│   └── utils/
│       ├── cookies.ts          # Set/Get tokens helper
│       └── swal.ts             # Custom SweetAlert2 theme wrappers
├── tailwind.config.ts          # Core Tailwind configuration (fonts & animation frames)
├── tsconfig.json
├── package.json
└── .env.local                  # NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 2. What Will Be Implemented on the Backend (`api/`)

Before the frontend can consume the API smoothly, we need to apply key backend fixes and configurations:

1. **Enable CORS (Cross-Origin Resource Sharing)**:
   * **Location**: `api/src/main.ts`
   * **Implementation**: Enable cors inside NestJS with credentials support to accept connections from the client:
     ```typescript
     app.enableCors({
       origin: 'http://localhost:3000', // Frontend local address
       credentials: true,
     });
     ```
2. **Resolve Compilation / DTO Errors**:
   * **Payments Module**: Fix early bracket closure in `payments.service.ts` to return standalone functions inside `PaymentsService`, clean controller annotations out of the service, and resolve invalid syntax elements (`currencyk`, missing commas, and missing try-catch components).
   * **Products Module**: Add missing imports for parameters and update configurations for `QueryProductDto` and `CreateProductDto` to reflect unique SKU constraints.
3. **Register Global HTTP Exception Filter**:
   * **Location**: `api/src/common/filters/http-exception.filter.ts`
   * **Implementation**: Intercept and standardize validation/exception payloads to return predictable JSON structures, reducing parsing crashes on the frontend client.

---

## 3. What Will Be Implemented on the Frontend (`frontend/`)

The frontend application will implement a full-featured premium e-commerce design:

### 1. Authentication & Session Security (Cookies + RTK Query)
*   **Sign-Up & Login**: Fully validated input fields (via React Hook Form + Zod) triggering requests to `/auth/register` and `/auth/login`.
*   **Token Rotation (Silent Refresh)**: The API custom query wrapper (`store/services/api.ts`) will intercept `401 Unauthorized` responses, trigger a refresh token sequence with the backend, and silently retry the original resource query.
*   **Protection (Guards)**: Next.js layouts checking user roles to guard access to `/admin/*` views.

### 2. Product Catalog, Categorization & Filtering
*   **Live Grid**: Dynamically load catalog items. Support sorting by price, page navigation, keyword searching, and toggle filters.
*   **Category Sidebar**: Allows filtering products by clicking on categories.

### 3. Shopping Cart & Inventory Validation
*   **Stock Tracking**: Whenever a client updates the quantity of items, cross-check against available inventory from the database. Show SweetAlert2 warnings when adding items exceeding store stock limits.
*   **Redux Persistence**: Maintain the user's cart in Redux and persist it in LocalStorage or synchronize it with the database (via backend `/cart` routes if available).

### 4. Checkout & Stripe Simulation (SweetAlert2 Integration)
*   **Checkout Gateway**: A clean stepper component capturing Shipping details.
*   **Payment Trigger**: Upon clicking "Pay Now", show a custom SweetAlert2 loading animation, connect with the backend `/payments/create-intent` endpoint, and mock confirmation.
*   **Feedback**: Show a custom SweetAlert2 success card with a tracking number and redirect to the orders review page.

### 5. Admin Dashboard Features
*   **Catalog Editor**: Dynamic DataTables presenting products and categories with "Add", "Edit", and "Delete" button toggles. Clicking "Delete" prompts a SweetAlert2 confirmation modal before firing the API request.
*   **Order Fulfillment Manager**: Real-time listing of customer orders with progress updates. Let admins change order statuses (`PENDING` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`).

---

## 4. UI/UX Style Customizations (SweetAlert2 + Tailwind)

To ensure visual excellence, we will wrap SweetAlert2 in `utils/swal.ts` to styled-match a slate-dark dashboard theme, as detailed below:

```typescript
import Swal from 'sweetalert2';

export const customSwal = {
  success: (title: string, text: string) => {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      background: '#0f172a', // Slate 900
      color: '#f8fafc', // Slate 50
      confirmButtonColor: '#6366f1', // Indigo 500
      customClass: {
        popup: 'rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md',
      }
    });
  },
  error: (title: string, text: string) => {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#ef4444', // Red 500
      customClass: {
        popup: 'rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md',
      }
    });
  },
  confirm: (title: string, text: string) => {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#475569',
      confirmButtonText: 'Yes, proceed',
      customClass: {
        popup: 'rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md',
      }
    });
  }
};
```
