import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentForm from "./PaymentForm";

const stripeKey =
  import.meta.env.VITE_payment_key || import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const Payment: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default Payment;
