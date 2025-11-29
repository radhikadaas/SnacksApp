import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import OrderStatusBadge from "../components/OrderStatusBadge";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function load() {
      if (!user) return;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setOrders(data);
    }
    load();
  }, [user]);

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

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">My Orders</h1>

      {orders.map((o) => (
        <div key={o.id} className="bg-white rounded shadow p-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">{shortId(o.id)}</h2>

            {/* Delivery Type Badge */}
            <span
              className={`px-3 py-1 rounded text-white text-sm ${
                o.delivery_type === "pickup" ? "bg-blue-600" : "bg-green-600"
              }`}
            >
              {o.delivery_type === "pickup" ? "Self Pickup" : "Home Delivery"}
            </span>
          </div>

          <div className="flex justify-between">
            {/* ORDER STATUS BADGE */}
            <OrderStatusBadge status={o.order_status} />

            {/* PAYMENT BADGE */}
            <span
              className={`inline-block mt-2 px-3 py-1 rounded text-white text-sm ${
                o.payment_status === "paid" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {o.payment_status === "paid" ? "Paid" : "Unpaid"}
            </span>
          </div>

          <p className="mt-2 font-bold">Total: ₹{o.total}</p>

          <p className="text-gray-600 text-sm">
            Date: {formatDate(o.created_at)}
          </p>

          <Link
            to={`/orders/${o.id}`}
            className="inline-block mt-3 bg-blue-600 text-white px-4 py-1 rounded"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}
