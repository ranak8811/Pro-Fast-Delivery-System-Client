import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import useTrackingLogger from "../../../hooks/useTrackingLogger";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { parcelId } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { logTracking } = useTrackingLogger();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["business", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/business/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const amount = parcelInfo.cost;
  const amountInCents = amount * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

    // step- 1: validate the card
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("");
      console.log("payment method", paymentMethod);

      // step-2: create payment intent
      const res = await axiosSecure.post("/payment/create-payment-intent", {
        amountInCents,
        parcelId,
      });

      const clientSecret = res.data.clientSecret;

      // step-3: confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        setError("");
        if (result.paymentIntent.status === "succeeded") {
          console.log("Payment succeeded!");
          const transactionId = result.paymentIntent.id;
          // step-4 mark parcel paid also create payment history
          const paymentData = {
            parcelId,
            email: user.email,
            amount,
            transactionId: transactionId,
            paymentMethod: result.paymentIntent.payment_method_types,
          };

          const paymentRes = await axiosSecure.post(
            "/payment/payments",
            paymentData
          );
          if (paymentRes.data.insertedId) {
            // ✅ Show SweetAlert with transaction ID
            await Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              html: `<strong>Transaction ID:</strong> <code>${transactionId}</code>`,
              confirmButtonText: "Go to My Parcels",
            });

            await logTracking({
              tracking_id: parcelInfo.tracking_id,
              status: "payment_done",
              details: `Paid by ${user.displayName}`,
              updated_by: user.email,
            });
            // ✅ Redirect to /myParcels
            navigate("/dashboard/myParcels");
          }
        }
      }
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-2xl font-bold text-[#20363A] mb-4">Payment for Parcel</h2>
        <div className="space-y-2 text-gray-700">
          <p><strong>Tracking ID:</strong> {parcelInfo.tracking_id}</p>
          <p><strong>Title:</strong> {parcelInfo.title}</p>
          <p><strong>Type:</strong> <span className="capitalize">{parcelInfo.type}</span></p>
          {parcelInfo.type === "non-document" && (
            <p><strong>Weight:</strong> {parcelInfo.weight} kg</p>
          )}
          <p className="text-xl font-bold mt-4">Amount Due: ৳{parcelInfo.cost}</p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full"
      >
        <CardElement className="p-2 border rounded"></CardElement>
        <button
          type="submit"
          className="btn btn-primary text-black w-full"
          disabled={!stripe}
        >
          Pay ৳{amount}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
