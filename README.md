# Pro-Fast Delivery System Client

A high-performance, full-featured web application for courier and parcel logistics management, featuring dedicated role-based portals for users, delivery riders, and administrators. Built with React 19, TypeScript, Vite, Tailwind CSS, DaisyUI, and Firebase.

![Pro-Fast Home & Dashboard Preview](./public/pro-fast-home.png)

## Live URLs

- **Client Web Application:** [https://zap-shift-abec3.web.app/](https://zap-shift-abec3.web.app/)
- **Production API Server:** [https://pro-fast-delivery-system-server.vercel.app/](https://pro-fast-delivery-system-server.vercel.app/)
- **Backend GitHub Repository:** [Pro-Fast-Delivery-System-Server](https://github.com/ranak8811/Pro-Fast-Delivery-System-Server.git)

---

## Key Features

### 📦 Customer Portal
- **Express Parcel Dispatch (`/sendParcel`):** Dynamic shipping form with automatic same-district vs inter-district tariff computation, weight surcharge calculation, and doorstep pickup scheduling.
- **My Parcels Management (`/dashboard/myParcels`):** Reusable data table with server-side pagination, status pill badges, debounced search, delivery status filters, and one-click tracking ID copy.
- **AI-Powered Live Parcel Tracking (`/dashboard/trackParcel`):** Real-time shipment milestone timeline paired with an integrated **AI Smart Tracking Assistant** card for status predictions and milestone breakdowns.
- **Interactive Nationwide Coverage Map (`/coverage`):** High-performance Leaflet map covering all 64 districts in Bangladesh with an isolated floating search bar, instant auto-complete suggestions, and quick hub filters (Dhaka, Chattogram, Sylhet, etc.).
- **Payment Gateway & History:** Integrated Stripe checkout with full payment history, receipt tracking, and transaction verification.

### 🛵 Rider Operations Portal
- **Pending Deliveries (`/dashboard/pendingDeliveries`):** Live dispatch board for assigned parcels with one-click status transitions (Pickup, In-Transit, Delivered).
- **Completed Deliveries & Payouts (`/dashboard/completedDeliveries`):** Detailed delivery audit logs, total earnings calculator, and withdrawal cashout dialogs.
- **Earnings Overview (`/dashboard/myEarnings`):** Visual breakdown of daily, weekly, and total rider revenue.
- **Rider Application (`/beARider`):** Dedicated onboarding form with driving license and vehicle registration validation.

### 🛡️ Administrative Portal
- **Admin Dashboard (`/dashboard/admin`):** High-level KPI metrics, real-time dispatch status breakdown, and quick action controls.
- **Rider Fleet Management (`/dashboard/activeRiders` & `/dashboard/pendingRiders`):** Review rider applications, verify credentials, activate or suspend riders with server-side paginated tables.
- **Parcel Dispatch Board (`/dashboard/assignRider`):** Assign pending shipments to verified active riders based on service centers.
- **User Role Management (`/dashboard/makeAdmin`):** Search users with debounced queries and toggle role permissions between User, Rider, and Admin.

---

## UI/UX & Architecture Highlights

- **Brand Design System:** Clean, modern visual language inspired by `#20363A` (deep teal brand color) and `#CAEB66` (high-visibility lime green accent) with rounded cards, subtle borders, and accessible typography.
- **Generic `<DataTable<T>>` Component:** Accessible, reusable table supporting customizable column definitions, skeleton loading states, empty state illustrations, and responsive horizontal scrolling.
- **Generic `<Pagination>` Component:** Compact sliding-window page selector with dynamic page sizes (5, 10, 20, 50 items/page), ellipsis jumps, and record count indicators.
- **Defensive Data Loaders:** Resilient data fetching with absolute paths, content-type checks, and automatic fallback requests to ensure 100% uptime even on client-side routing edge cases.
- **Z-Index Isolation:** CSS `isolation: isolate` and `z-50` sticky navigation preventing map markers or search dialogs from clipping over the navbar.

---

## Technologies Used

<div align="center">

| Category | Technologies & Libraries |
|---|---|
| **Core & Language** | ![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Vite 7](https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white) |
| **Styling & UI** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![DaisyUI](https://img.shields.io/badge/DaisyUI_5-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white) ![Headless UI](https://img.shields.io/badge/Headless_UI-66E3FF?style=for-the-badge&logo=headlessui&logoColor=black) |
| **Routing & Query** | ![React Router 7](https://img.shields.io/badge/React_Router_7-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![TanStack Query](https://img.shields.io/badge/TanStack_Query_v5-FF4154?style=for-the-badge&logo=react-query&logoColor=white) ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) |
| **Auth & Hosting** | ![Firebase](https://img.shields.io/badge/Firebase_Auth_&_Hosting-FFCA28?style=for-the-badge&logo=firebase&logoColor=black) |
| **Payments** | ![Stripe](https://img.shields.io/badge/Stripe_Payments-008CDD?style=for-the-badge&logo=stripe&logoColor=white) |
| **Maps & Geospatial** | ![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white) ![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white) |
| **Visuals & Charts** | ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white) ![Recharts](https://img.shields.io/badge/Recharts-22b5bf?style=for-the-badge&logoColor=white) |
| **Forms & UX** | ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white) ![SweetAlert2](https://img.shields.io/badge/SweetAlert2-8C4FFF?style=for-the-badge&logoColor=white) ![React Hot Toast](https://img.shields.io/badge/React_Hot_Toast-000000?style=for-the-badge&logoColor=white) |

</div>

---

## Getting Started

### Prerequisites
- Node.js (v18.0 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ranak8811/Pro-Fast-Delivery-System-Client.git
   cd Pro-Fast-Delivery-System-Client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the project root with the following configuration:
   ```env
   VITE_apiKey=your_firebase_api_key
   VITE_authDomain=your_project.firebaseapp.com
   VITE_projectId=your_project_id
   VITE_storageBucket=your_project.appspot.com
   VITE_messagingSenderId=your_sender_id
   VITE_appId=your_app_id

   VITE_payment_key=your_stripe_publishable_key
   VITE_imgbb_key=your_imgbb_api_key
   VITE_API_URL=https://pro-fast-delivery-system-server.vercel.app
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## Project Structure

```
Pro-Fast-Delivery-System-Client/
├── public/
│   ├── pro-fast-home.png          # Visual design reference asset
│   ├── serviceCenter.json         # 64 districts service center database
│   └── favicon.ico
├── src/
│   ├── assets/                    # Images, logos, and banners
│   ├── components/
│   │   ├── common/                # Reusable DataTable, Pagination components
│   │   ├── AITrackingAssistantCard.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorPage.tsx
│   ├── contexts/                  # AuthContext and Providers
│   ├── hooks/                     # Custom hooks (useAxiosSecure, useAuth, useTitle)
│   ├── layouts/                   # RootLayout, DashboardLayout, AuthLayout
│   ├── pages/
│   │   ├── Home/                  # Landing page and promotional sections
│   │   ├── Dashboard/             # User, Rider, and Admin dashboard pages
│   │   ├── Coverage/              # Leaflet map and district search
│   │   └── SendParcel/            # Express parcel booking and cost estimator
│   ├── router/                    # React Router configuration
│   └── types/                     # TypeScript data interfaces
├── package.json
└── vite.config.ts
```

---

## License

This project is licensed under the MIT License.
