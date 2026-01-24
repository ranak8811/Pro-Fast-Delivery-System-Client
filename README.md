# Pro Fast Delivery System Client

A modern, full-featured web application for parcel delivery management, offering distinct dashboards for users, riders, and administrators. Built with React, Vite, and Firebase.

## Features

- **User Authentication:** Secure login, registration, and social login options.
- **Role-Based Dashboards:** Tailored experiences for Users, Riders, and Admins.
- **Parcel Management:**
  - Send parcels with ease.
  - View and manage your sent parcels.
  - Track parcel status in real-time.
- **Rider Management (Admin):**
  - Manage pending rider applications.
  - View active riders.
  - Assign riders to deliveries.
  - Users can apply to become riders.
- **Delivery Tracking:** Monitor pending and completed deliveries.
- **Earnings & Payments:**
  - Rider earnings tracking.
  - Secure payment processing (Stripe integration).
  - View payment history.
- **Interactive Maps:** Coverage area display with Leaflet maps.
- **Responsive Design:** Optimized for various devices using Tailwind CSS and DaisyUI.
- **Dynamic Charts:** Visual representation of delivery statistics and earnings using Chart.js and Recharts.
- **Animated UI:** Engaging user experience with AOS (Animate On Scroll) library.

## Technologies Used

- **Frontend:**
  - React (with Vite)
  - React Router DOM
  - Tailwind CSS (with DaisyUI)
  - Axios (for API requests)
  - Firebase (Authentication, Hosting)
  - Stripe (Payment Gateway)
  - Leaflet & React Leaflet (Mapping)
  - Chart.js & React Chartjs 2, Recharts (Data Visualization)
  - AOS (Animations)
  - React Hook Form (Form management)
  - Headless UI
  - Tanstack Query
  - SweetAlert2 (Alerts)
  - date-fns (Date utilities)
  - React Fast Marquee, React Responsive Carousel, React Slick (UI components)
- **Build Tool:** Vite
- **Linting:** ESLint

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn
- Firebase project setup (for full functionality, including authentication and hosting)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ranak8811/Pro-Fast-Delivery-System-Client.git
    cd Pro-Fast-Delivery-System-Client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Environment Variables Configuration:**
    - Create a `.env.local` file in the root directory of the project.
    - This file will hold sensitive information and API keys. Below are the required environment variables:

      ```
      VITE_apiKey=YOUR_VITE_API_KEY
      VITE_authDomain=YOUR_VITE_AUTH_DOMAIN
      VITE_projectId=YOUR_VITE_PROJECT_ID
      VITE_storageBucket=YOUR_VITE_STORAGE_BUCKET
      VITE_messagingSenderId=YOUR_VITE_MESSAGING_SENDER_ID
      VITE_appId=YOUR_VITE_APP_ID

      VITE_payment_key=YOUR_VITE_PAYMENT_KEY

      VITE_imgbb_key=YOUR_VITE_IMGBB_KEY

      VITE_API_URL=YOUR_VITE_API_URL
      ```

    - Ensure to replace the `YOUR_...` placeholders with your actual keys.

### Running the Project

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will typically be available at `http://localhost:5173`.

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The build artifacts will be generated in the `dist/` directory.

## Project Structure

```
.
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, JSON data
│   ├── components/         # Reusable UI components (e.g., charts)
│   ├── contexts/           # React Context for global state (e.g., Auth)
│   ├── firebase/           # Firebase initialization
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Root, Auth, Dashboard layouts
│   ├── pages/              # Main application pages (Home, Auth, Dashboard, etc.)
│   ├── router/             # Main application router
│   └── routes/             # Protected routes (Admin, Private, Rider)
├── .env.local              # Environment variables
├── package.json            # Project dependencies and scripts
└── vite.config.js          # Vite build configuration
```

## Contributing

Contributions are welcome! Please follow standard GitHub flow: fork the repository, create a feature branch, commit your changes, and open a pull request.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details (if applicable, otherwise state 'Proprietary' or 'All Rights Reserved').

## Contact

For any inquiries, please contact [Your Name/Email/GitHub Profile].
