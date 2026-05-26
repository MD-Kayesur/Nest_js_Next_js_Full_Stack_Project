# NestJS & Prisma Full-Stack Project: Developer Guide & Roadmap

This document provides a high-level architectural overview, request flow guide, current build diagnostics, roadmap of suggested new features, and execution references.

---

## 1. High-Level Architecture Overview

The backend uses a standard NestJS modular architecture coupled with Prisma ORM and PostgreSQL. The application is organized by domain features under `src/modules`.

```mermaid
graph TD
    Client[Client Request] --> Guards[Guards: JWT, Roles]
    Guards --> Controller[Controller: Routing & DTO Validation]
    Controller --> Service[Service: Business Logic]
    Service --> Prisma[Prisma Service: ORM Database Access]
    Prisma --> PostgreSQL[(PostgreSQL Database)]
```

### Key Layers
1. **Controller Layer**: Handles incoming HTTP requests, maps routes, enforces DTO validation constraints using `class-validator`, and documents endpoints via Swagger (`@nestjs/swagger`).
2. **Service Layer**: Implements core business logic, handles exceptions (e.g., `ConflictException`, `NotFoundException`), and interacts with the database.
3. **Database Layer (Prisma)**: Prisma acts as the query builder and type-safe database layer. It leverages the multi-file schema feature using the `prismaSchemaFolder` configuration to organize model definitions.

---

## 2. Request Flow & Security

Here is how a request travels through the system when interacting with a protected endpoint:

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant G as JWT Guard
    participant C as Controller
    participant S as Service
    participant P as Prisma / DB

    Client->>G: Request with Authorization Header (Bearer JWT)
    Note over G: Validates JWT signature & expiry
    alt Token Invalid
        G-->>Client: 401 Unauthorized
    else Token Valid
        G->>C: Routes Request (attaches User to request object)
        C->>C: Validates DTO Schema
        alt Validation Fails
            C-->>Client: 400 Bad Request
        else Validation Passes
            C->>S: Invokes Service Method
            S->>P: Query / Mutate Database
            P-->>S: Data Output
            S-->>C: Returns Processed Response DTO
            C-->>Client: 200 OK / 201 Created
        end
    end
```

> [!NOTE]
> The backend issues both a short-lived **Access Token** (15 minutes) and a long-lived **Refresh Token** (7 days). The refresh token is securely hashed (`bcrypt`) and saved to the database to support secure token rotation.

---

## 3. Active Compilation Diagnostics (Current Errors)

### Build Status
Running `npm run build` inside the `api` folder currently fails with **111 TypeScript errors**. The codebase contains scoping issues, syntax typos, missing imports, and type mismatches.

### Detailed Diagnostic of Broken Modules

#### 📂 Payments Module (`api/src/modules/payments/`)

* **Syntax Errors & Broken `try` Block in `payments.service.ts`**:
  * **Incomplete try/catch**: The `createPaymentIntent` method opens a `try {` block, but the closing brace is not followed by a `catch` or `finally` block, causing compilation to break.
  * **Typos & Missing Syntax**:
    * `currencyk` is a syntax typo. It should be `currency` or `currency: currency`.
    * Missing commas between object properties (e.g., between `paymentMethod: 'STRIPE'` and `transactionId`).
    * `PaymentStaus` is used instead of the correct `PaymentStatus` enum.
* **Misplaced Controller Code**:
  * The service file contains controller decorators (`@Get(':id')`, `@ApiParam`, etc.) and route handler logic which belong in `payments.controller.ts`.
* **Bracket Closure Mismatches (Class Scoping)**:
  * The `PaymentsService` class block is closed early. As a result, methods like `findOne`, `findByOrder`, and `mapTopaymentresponseDto` are defined as plain functions outside the class scope.
* **Polluted Controller Layer (`payments.controller.ts`)**:
  * A duplicate, helper-less version of `confirmPaymentIntent` is defined inside `PaymentsController`, attempting to access database resources directly (`this.prisma`, `this.stripe`) which are not injected.

#### 📂 Products Module (`api/src/modules/products/`)

* **Missing Imports in `products.controller.ts`**:
  * The `Param` decorator is not imported from `@nestjs/common`.
  * `UpdateProductDto` is referenced but never imported from `./dto/update-product.dto`.
* **DTO Property & Validation Mismatches**:
  * **Missing Properties**: `products.service.ts` destructures `sortBy`, `sortOrder`, `minPrice`, and `maxPrice` from `QueryProductDto`, but these fields do not exist in the DTO schema.
  * **Transform Logic Error**: The `@Transform` decorator in `QueryProductDto` compares the parameter directly to a string/boolean (`value === 'true'`), which always evaluates to false because it receives a `TransformFnParams` object. It should destructure the value: `@Transform(({ value }) => ... )`.
  * **Schema Mismatches**: The schema defines `sku` as a unique, required field on the `Product` model, but `CreateProductDto` defines it as optional (`sku?: string`), which throws type assignment errors inside the `prisma.product.create` method.

### Step-by-Step Guide to Resolving Build Errors

1. **Clean up `payments.service.ts`**:
   * Move the `@Get(':id')` controller route handler from the service file into `payments.controller.ts`.
   * Fix the early class-closing curly brace to bring the standalone methods back inside the `PaymentsService` class.
   * Correct the typos: change `PaymentStaus` to `PaymentStatus`, change `currencyk` to `currency`, and add missing commas.
   * Add a proper `catch` block to the `try` block in `createPaymentIntent`.
2. **Clean up `payments.controller.ts`**:
   * Delete the inline database logic in `confirmPaymentIntent` and delegate all processing logic to `PaymentsService`.
3. **Resolve Products Controller Imports**:
   * Add `Param` to the imports from `@nestjs/common` in `products.controller.ts`.
   * Add `import { UpdateProductDto } from './dto/update-product.dto';` to `products.controller.ts`.
4. **Align Product DTOs**:
   * Update `QueryProductDto` to include the sorting and filtering fields (`sortBy`, `sortOrder`, `minPrice`, `maxPrice`).
   * Fix the `@Transform` arguments in `query-product.dto.ts`.

---

## 4. Recommended New Features Roadmap

Here are the suggested features to build next to complete the e-commerce engine, along with detailed implementation instructions.

### Feature 1: Complete the Products Module
Implement CRUD operations for products mapping to the schema defined in `api/prisma/product.prisma`.

#### Step-by-Step Implementation Instructions
1. **Create Products DTOs**:
   Add Create and Update Product DTOs in `api/src/modules/products/dto/`:
   * `create-product.dto.ts`: Should contain `name`, `description`, `price`, `stock`, `sku`, `imageUrl`, and `categoryId` with validation decorators.
   * `query-product.dto.ts`: Supporting pagination (`page`, `limit`), search queries, and filters (by `categoryId`, price ranges).

2. **Implement Products Service**:
   Write methods inside `products.service.ts` for database interactions:
   ```typescript
   import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
   import { PrismaService } from 'src/prisma/prisma.service';
   import { CreateProductDto } from './dto/create-product.dto';

   @Injectable()
   export class ProductsService {
     constructor(private prisma: PrismaService) {}

     async create(dto: CreateProductDto) {
       const existing = await this.prisma.product.findUnique({ where: { sku: dto.sku } });
       if (existing) throw new ConflictException('Product with this SKU already exists');
       return this.prisma.product.create({ data: dto });
     }

     async findAll(query: any) {
       // Support paginated queries, category filtering, and search options
     }
   }
   ```

3. **Expose Controller Endpoints**:
   Secure administrative actions (create, update, delete) using the `@UseGuards(JwtAuthGuard, RolesGuard)` and `@Roles(Role.ADMIN)` decorators. Keep read actions public.

---

### Feature 2: Cart and Checkout System
A system allowing authenticated users to add items to their cart, update quantities, and prepare for checkout.

```mermaid
flowchart LR
    A[Add to Cart] --> B[Update Quantity]
    B --> C[Validate Stock Availability]
    C --> D[Calculate Subtotal & Checkout]
```

#### Step-by-Step Implementation Instructions
1. **Create Cart Module**:
   Generate a new NestJS module:
   ```bash
   nest g module modules/cart
   nest g controller modules/cart
   nest g service modules/cart
   ```
2. **Key Methods to Implement in `cart.service.ts`**:
   * `addToCart(userId: string, productId: string, quantity: number)`: Checks if the cart exists (or creates a new one). Validates if the product stock is sufficient. Creates/updates `CartItem`.
   * `getCart(userId: string)`: Retrieves the active cart, joining product details, and calculates checkout total sums.
   * `updateQuantity(userId: string, cartItemId: string, quantity: number)`: Updates item count or deletes it if quantity is set to 0.

---

### Feature 3: Order Management & Payment Processing
Transition checked-out carts into formal orders and record completed transactions.

#### Step-by-Step Implementation Instructions
1. **Create Order Module**:
   Generate the module structure. Create orders linked directly to `Cart` and `User`.
2. **Order Lifecycle Flow**:
   * **Pending**: Created immediately upon checkout initiating.
   * **Processing**: Set after payment verification.
   * **Shipped / Delivered / Cancelled**: Controlled by admin endpoints.
3. **Simulate Payments**:
   Add a payments service integrating transaction records with status checks:
   * Map `Payment` schema records to verify transaction completions.
   * Integrate mock webhook logic to transition `OrderStatus` from `PENDING` to `PROCESSING`.

---

### Feature 4: Global Error Filters & Interceptors
To provide standardized error payloads for frontend integrations, implement a global exception filter.

> [!TIP]
> Standardizing responses reduces frontend parsing errors. Return a clean payload layout such as:
> `{ "statusCode": 400, "message": "Validation failed", "errors": [...], "timestamp": "..." }`

#### Step-by-Step Implementation Instructions
1. **Create Filter**:
   Create a custom exception filter at `src/common/filters/http-exception.filter.ts`.
2. **Register Globally**:
   Register it in `main.ts` using `app.useGlobalFilters(new HttpExceptionFilter())`.

---

## 5. Local Execution Reference

To run migrations and start the environment locally:

```bash
# Run migrations to update postgres DB structures
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Run backend development server
npm run dev
```
