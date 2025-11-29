import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deliveryType, setDeliveryType] = useState("pickup"); // pickup | delivery
  const [paymentMethod, setPaymentMethod] = useState("online"); // online | cod
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    pincode: "",
  });

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  async function placeOrder() {
    if (!user) {
      alert("Please login");
      navigate("/login");
      return;
    }

    // Require address if delivery
    if (deliveryType === "delivery") {
      if (
        !address.name ||
        !address.phone ||
        !address.line1 ||
        !address.city ||
        !address.pincode
      ) {
        alert("Please fill all required delivery fields");
        return;
      }
    }

    // Determine payment status
    let payment_status = "unpaid";
    if (paymentMethod === "online") {
      payment_status = "paid";
    }

    // FINAL ORDER PAYLOAD
    // const orderPayload = {
    //   user_id: user.id,
    //   items: cart,
    //   total,
    //   status: "ordered", // default order status
    //   payment_status : payment_status,
    //   delivery_type: deliveryType,
    //   address: deliveryType === "delivery" ? address : null,
    // };

    const orderPayload = {
      user_id: user.id,
      user_email: user.email, 
      items: cart,
      total,
      order_status: "ordered", // correct workflow status
      payment_status: payment_status, // paid or unpaid
      delivery_type: deliveryType,
      address: deliveryType === "delivery" ? address : null,
    };

    console.log("Creating order:", orderPayload);

    const { error } = await supabase.from("orders").insert(orderPayload);

    if (error) {
      alert("Failed to place order: " + error.message);
      return;
    }

    clearCart();
    navigate("/orders");
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Payment</h1>

      {/* Delivery Type */}
      <div className="mb-6">
        <label className="font-semibold">Delivery Type:</label>
        <div className="flex gap-4 mt-2">
          <label>
            <input
              type="radio"
              checked={deliveryType === "pickup"}
              onChange={() => {
                setDeliveryType("pickup");
                setPaymentMethod("online");
              }}
            />
            <span className="ml-2">Self Pickup</span>
          </label>

          <label>
            <input
              type="radio"
              checked={deliveryType === "delivery"}
              onChange={() => {
                setDeliveryType("delivery");
                setPaymentMethod("online"); // COD disabled for delivery
              }}
            />
            <span className="ml-2">Home Delivery</span>
          </label>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <label className="font-semibold">Payment Method:</label>

        <div className="mt-2 space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
            />
            <span>Online Payment</span>
          </label>

          <label
            className={`flex items-center gap-2 ${
              deliveryType === "delivery" ? "opacity-50" : ""
            }`}
          >
            <input
              type="radio"
              disabled={deliveryType === "delivery"}
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            <span>Cash on Pickup</span>
          </label>
        </div>
      </div>

      {/* Address Form */}
      {deliveryType === "delivery" && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h3 className="font-semibold mb-3">Delivery Address</h3>

          {["name", "phone", "line1", "line2", "city", "pincode"].map(
            (field) => (
              <input
                key={field}
                placeholder={field}
                className="border p-2 w-full mb-2"
                value={address[field]}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, [field]: e.target.value }))
                }
              />
            )
          )}
        </div>
      )}

      {/* DELIVERY CHARGE NOTICE (Only for Home Delivery) */}
      {deliveryType === "delivery" && (
        <div className="bg-gray-200 border border-gray-300 p-4 rounded mb-6">
          <h3 className="font-semibold text-lg mb-1">Delivery Charge Notice</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Our home delivery is fulfilled using{" "}
            <strong>Ola / Uber / Auto</strong>. Delivery charges vary based on
            your location.
            <br />
            <br />
            We will confirm the delivery charge shortly. You can pay the
            delivery amount{" "}
            <strong>later at the time of delivery to that Person only.</strong>
          </p>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>

        {cart.map((item) => (
          <div key={item.id} className="flex justify-between text-sm mb-1">
            <span>
              {item.name} × {item.qty}
            </span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}

        <hr className="my-2" />

        <p className="font-bold text-lg">Total: ₹{total}</p>
      </div>

      {/* Submit */}
      <button
        onClick={placeOrder}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Pay Now (Simulated)
      </button>
    </div>
  );
}
