import { useEffect, useState } from "react";
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

    // Home delivery must have full address
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

    // Determine status
    let paymentStatus = "pending";

    if (deliveryType === "delivery") {
      paymentStatus = "paid"; // Home delivery requires online payment
    } else {
      // pickup
      if (paymentMethod === "online") paymentStatus = "paid";
      else if (paymentMethod === "cod") paymentStatus = "unpaid";
    }

    const orderPayload = {
      user_id: user.id,
      items: cart,
      total,
      status: paymentStatus,
      delivery_type: deliveryType, // ✔ correctly saved
      address: deliveryType === "delivery" ? address : null,
    };

    console.log("Submitting order:", orderPayload);

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
                setPaymentMethod("online");
              }}
            />
            <span className="ml-2">Home Delivery</span>
          </label>
        </div>
      </div>

      {/* Payment Method – always shown */}
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
            <span>
              Cash on Delivery {deliveryType === "delivery" && "(Pickup Only)"}
            </span>
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

// import { useCart } from "../context/CartContext";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { supabase, createOrder } from "../lib/supabaseClient";

// export default function Payment() {
//   const { cart, /* add clearCart function in your CartContext if not present */ updateQty, removeItem } = useCart();
//   const navigate = useNavigate();

//   const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
//   const total_cents = total * 100;

//   // Put your Razorpay key (test) or set via env
//   const RAZORPAY_KEY = "rzp_test_1234567890";

//   function loadRazorpayScript(src) {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = src;
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   }

//   async function saveOrderToDb({ userId, items, total_cents, delivery_type = "pickup", address = null, payment_provider = "razorpay", payment_provider_id = null }) {
//     const orderObj = {
//       user_id: userId,
//       items: items,
//       total_cents,
//       currency: "INR",
//       delivery_type,
//       address,
//       delivery_charge_cents: 0,
//       payment_status: payment_provider_id ? "paid" : "pending",
//       payment_provider,
//       payment_provider_id,
//       order_status: payment_provider_id ? "ordered" : "pending"
//     };

//     const created = await createOrder(orderObj);
//     return created;
//   }

//   async function startPayment() {
//     const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
//     if (!res) {
//       alert("Failed to load Razorpay SDK.");
//       return;
//     }

//     // get user session
//     const { data: { session } } = await supabase.auth.getSession();
//     const userId = session?.user?.id;
//     if (!userId) {
//       toast.error("Please login to pay.");
//       navigate(`/login?redirect=/payment`);
//       return;
//     }

//     const options = {
//       key: RAZORPAY_KEY,
//       amount: total_cents,
//       currency: "INR",
//       name: "Snacks App",
//       description: "Order Payment",
//       handler: async function (response) {
//         // response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
//         try {
//           // Save order to DB with payment_provider_id returned by Razorpay
//           const created = await saveOrderToDb({
//             userId,
//             items: cart,
//             total_cents,
//             payment_provider_id: response.razorpay_payment_id,
//             payment_provider: "razorpay",
//             delivery_type: "pickup"
//           });

//           toast.success("Payment successful — order placed!");
//           // clear cart: implement clearCart() in CartContext and call it here
//           if (typeof window !== "undefined" && window.localStorage) {
//             localStorage.removeItem("cart");
//           }
//           // Optionally call context clearCart if available
//           navigate(`/orders`);
//         } catch (err) {
//           console.error("Failed save order:", err);
//           toast.error("Payment succeeded but saving order failed.");
//           navigate(`/orders`);
//         }
//       },
//       prefill: {
//         name: session.user?.user_metadata?.full_name || session.user?.email || "Customer",
//         email: session.user?.email || "",
//         contact: session.user?.phone || ""
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };

//     const razorpay = new window.Razorpay(options);

//     // optional: catch payment failed event
//     razorpay.on("payment.failed", function (response) {
//       toast.error("Payment failed");
//       console.error("payment.failed", response);
//     });

//     razorpay.open();
//   }

//   if (cart.length === 0) return <h1 className="text-center mt-6">Your cart is empty</h1>;

//   return (
//     <div className="max-w-lg mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Payment</h1>

//       <div className="bg-white p-4 rounded shadow-md mb-4">
//         <h2 className="font-semibold mb-3">Order Summary</h2>
//         {cart.map((item) => (
//           <div key={item.id} className="flex justify-between mb-2">
//             <span>{item.name} x {item.qty}</span>
//             <span>₹{item.price * item.qty}</span>
//           </div>
//         ))}
//         <hr className="my-2" />
//         <h3 className="font-bold text-lg">Total: ₹{total}</h3>
//       </div>

//       <button onClick={startPayment} className="w-full bg-blue-600 text-white py-2 rounded text-lg">Pay Now</button>
//     </div>
//   );
// }
