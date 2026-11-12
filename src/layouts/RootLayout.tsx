import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../pages/shared/Navbar/Navbar";
import Footer from "../pages/shared/Footer/Footer";

const RootLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-xl border-b border-base-200/60 shadow-xs">
        <Navbar />
      </nav>

      <main className="grow">
        <div className="mx-auto px-4">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
