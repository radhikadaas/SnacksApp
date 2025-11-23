import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cart.length === 0)
    return <h1 className="text-center mt-6">Your cart is empty</h1>;

  function handleProceed() {
    navigate("/payment"); // all delivery logic is handled in /payment
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Order Summary */}
      <div className="bg-white p-4 rounded shadow-md mb-4">
        <h2 className="font-semibold mb-2">Order Summary</h2>

        {cart.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>
              {item.name} × {item.qty}
            </span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}

        <hr className="my-2" />
        <h3 className="font-bold text-lg">Total: ₹{total}</h3>
      </div>

      {/* Proceed Button */}
      <button
        onClick={handleProceed}
        className="w-full bg-blue-600 text-white py-2 rounded text-lg"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
