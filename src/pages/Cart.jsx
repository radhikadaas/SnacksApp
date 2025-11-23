import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, updateQty, removeItem } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (cart.length === 0)
    return <h1 className="text-center mt-6">Your cart is empty</h1>;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 bg-white shadow-md p-3 rounded mb-3"
        >
          <img
            src={item.image}
            className="w-20 h-20 object-cover rounded"
          />

          <div className="flex-1">
            <h3 className="font-semibold">{item.name}</h3>
            <p>₹{item.price}</p>

            <div className="flex items-center mt-2 gap-2">
              <button
                onClick={() => updateQty(item.id, item.qty - 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                -
              </button>

              <span>{item.qty}</span>

              <button
                onClick={() => updateQty(item.id, item.qty + 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            className="text-red-500 font-bold"
          >
            X
          </button>
        </div>
      ))}

      <h2 className="text-xl font-bold mt-4">Total: ₹{total}</h2>

      <Link
        to="/checkout"
        className="block bg-blue-600 text-white text-center py-2 rounded mt-4"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
