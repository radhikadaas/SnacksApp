import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useParams } from "react-router-dom";
import OrderStatusBadge from "../components/OrderStatusBadge";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [showAddress, setShowAddress] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setOrder(data);
    }

    load();
  }, [id]);

  function shortId(id) {
    return "ORD-" + id.slice(0, 5);
  }

  function formatDate(d) {
    return new Date(d).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (!order) return <h1>Loading...</h1>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      

      <div className="flex items-center gap-3 justify-between">
        <h1 className="text-2xl font-bold mb-2">Order {shortId(order.id)}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Status */}
      <span
        className={`inline-block px-3 py-1 rounded text-white ${
          order.status === "paid" ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {order.status === "paid" ? "Paid" : "Unpaid"}
      </span>

      <br />
      <br />

      {/* Delivery Badge */}
      <span
        className={`px-3 py-1 rounded text-white ${
          order.delivery_type === "pickup" ? "bg-blue-600" : "bg-green-600"
        }`}
      >
        {order.delivery_type === "pickup" ? "Self Pickup" : "Home Delivery"}
      </span>

      <p className="mt-3 font-semibold">Total: ₹{order.total}</p>

      <p className="text-gray-600">Date: {formatDate(order.created_at)}</p>

      {/* Address Dropdown for Home Delivery */}
      {order.delivery_type === "delivery" && order.address && (
        <div className="mt-4">
          <button
            onClick={() => setShowAddress(!showAddress)}
            className="bg-gray-200 px-4 py-1 rounded"
          >
            {showAddress ? "Hide Address" : "Show Address"}
          </button>

          {showAddress && (
            <div className="mt-3 bg-gray-100 p-3 rounded">
              <p>
                <b>Name:</b> {order.address.name}
              </p>
              <p>
                <b>Phone:</b> {order.address.phone}
              </p>
              <p>
                <b>Address 1:</b> {order.address.line1}
              </p>
              <p>
                <b>Address 2:</b> {order.address.line2}
              </p>
              <p>
                <b>City:</b> {order.address.city}
              </p>
              <p>
                <b>Pincode:</b> {order.address.pincode}
              </p>
            </div>
          )}
        </div>
      )}

      <hr className="my-4" />

      {/* Items */}
      <h2 className="text-xl font-bold mb-2">Items</h2>

      {order.items.map((item) => (
        <div key={item.id} className="flex justify-between mb-2">
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm">Qty: {item.qty}</p>
          </div>
          <p className="font-bold">₹{item.price * item.qty}</p>
        </div>
      ))}

      <hr className="my-4" />

      <h2 className="text-xl font-bold text-green-600">
        Total: ₹{order.total}
      </h2>
    </div>
  );
}
