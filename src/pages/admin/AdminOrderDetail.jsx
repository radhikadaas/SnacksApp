import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => setOrder(data));
  }, [id]);

  async function updateStatus(newStatus) {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) alert(error.message);
    else {
      alert("Status updated");
      setOrder({ ...order, status: newStatus });
    }
  }

  if (!order) return <p>Loading...</p>;

  const shortId = order.id.split("-")[0];

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-3">
        Order <span className="text-blue-600">{shortId}</span>
      </h2>

      <p>Total: ₹{order.total}</p>
      <p>Status: {order.status}</p>

      <h3 className="text-xl font-semibold mt-4 mb-2">Update Status</h3>
      <div className="space-y-2">
        {["ordered", "in_process", "shipped", "delivered", "cancelled"].map(
          (s) => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              className={`px-4 py-1 rounded block w-full ${
                order.status === s
                  ? "bg-gray-400 text-white"
                  : "bg-blue-600 text-white"
              }`}
            >
              Mark as {s.replace("_", " ")}
            </button>
          )
        )}
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">Items</h3>
      {order.items.map((item, i) => (
        <div key={i} className="flex justify-between border-b py-2">
          <span>
            {item.name} (Qty: {item.qty})
          </span>
          <span>₹{item.price * item.qty}</span>
        </div>
      ))}
    </div>
  );
}
