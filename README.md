# Floo Food Delivery Platform

A modern food delivery platform built with Next.js, TypeScript, and Tailwind CSS. This client application connects to various microservices to provide a complete food delivery experience.

## Table of Contents
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [API Integration](#api-integration)
- [Project Structure](#project-structure)
- [Learn More](#learn-more)
- [Deployment](#deployment)

## Getting Started

### Prerequisites
- Node.js 16.x or later
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/floo-client.git
cd floo-client
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory (see [Environment Setup](#environment-setup))

4. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

Create a `.env.local` file in the root directory with the following contents:

```
# Base URLs for services
NEXT_PUBLIC_ORDER_SERVICE_URL=http://localhost:8082/api/v1/order
NEXT_PUBLIC_RESTAURANT_SERVICE_URL=http://localhost:8081/api/v1/restaurants
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:8080/api/v1/users
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:8083/api/v1/payments

# Authentication
NEXT_PUBLIC_AUTH_SECRET=your-auth-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# External APIs
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Feature Flags
NEXT_PUBLIC_ENABLE_DRIVER_MODULE=true
NEXT_PUBLIC_ENABLE_PAYMENTS=true
```

Replace the placeholder values with your actual API keys and secrets.

## API Integration

This application connects to several backend microservices:

### Order Service
- Base URL: `http://localhost:8082/api/v1/order`
- Main endpoints:
  - `GET /allOrders`: Get all orders
  - `GET /:id`: Get order by ID
  - `GET /customer/:customerId`: Get orders by customer ID
  - `POST /`: Create new order
  - `PUT /:id`: Update order status

### Restaurant Service
- Base URL: `http://localhost:8081/api/v1/restaurants`
- Main endpoints:
  - `GET /`: Get all restaurants
  - `GET /:id`: Get restaurant by ID
  - `GET /:id/menu`: Get restaurant menu
  - `POST /`: Create restaurant
  - `PUT /:id`: Update restaurant

### User Service
- Base URL: `http://localhost:8080/api/v1/users`
- Main endpoints:
  - `POST /login`: User login
  - `POST /register`: User registration
  - `GET /:id`: Get user profile
  - `PUT /:id`: Update user profile

### Payment Service
- Base URL: `http://localhost:8083/api/v1/payments`
- Main endpoints:
  - `POST /create-payment-intent`: Create payment intent
  - `GET /history/:userId`: Get payment history

### API Integration Example

Each service integration is handled in the corresponding file in the `lib/api` directory. For example, the order service functions in `orderService.ts`:

```typescript
export const fetchOrderById = async (id: string) => {
  try {
    const apiUrl = extractBaseUrl();
    const res = await fetch(`${apiUrl}/${id}`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' } 
    });
    if (!res.ok) {
      throw new Error('Failed to fetch order');
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
};
```

To implement a new API connection:
1. Create a new file in `lib/api/` if needed
2. Add the base URL to your `.env.local` file
3. Create functions to interact with the API endpoints
4. Use proper error handling
5. Import and use these functions in your components or page files

## Project Structure

The project follows a modular architecture:

- `app/`: Next.js app router pages
  - `admin/`: Admin panel pages
  - `customer/`: Customer-facing pages
  - `driver/`: Driver-specific pages
  - `restaurant/`: Restaurant management pages
- `components/`: Reusable React components
  - `ui/`: UI components (shadcn/ui)
  - `customer/`: Customer-specific components
  - `driver/`: Driver-specific components
- `lib/`: Utility functions and API services
  - `api/`: API service functions
- `types/`: TypeScript type definitions
- `services/`: Mock services (for development)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
