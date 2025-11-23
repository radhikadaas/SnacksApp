import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

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

          {/* Payment Badge */}
          <span
            className={`inline-block mt-2 px-3 py-1 rounded text-white text-sm ${
              o.status === "paid" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {o.status === "paid" ? "Paid" : "Unpaid"}
          </span>

          <p className="mt-2 font-bold">
            Total: ₹{o.total}
          </p>

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






// import { useAuth } from "../context/AuthContext";
// import { Link } from "react-router-dom";

// export default function Orders() {
//   const { user } = useAuth();

//   if (!user)
//     return (
//       <h1 className="text-center mt-6 text-lg">
//         Please <Link className="text-blue-500" to="/login">login</Link> to view your orders.
//       </h1>
//     );

//   // Dummy orders (will be replaced by real backend orders later)
//   const dummyOrders = [
//     {
//       id: "ORD-101",
//       total: 120,
//       status: "Delivered",
//       deliveryType: "delivery",
//       date: "2024-01-01",
//     },
//     {
//       id: "ORD-102",
//       total: 60,
//       status: "Processing",
//       deliveryType: "pickup",
//       date: "2024-01-02",
//     },
//   ];

//   return (
//     <div className="max-w-lg mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">My Orders</h1>

//       {dummyOrders.map((order) => (
//         <div
//           key={order.id}
//           className="bg-white p-4 shadow-md rounded mb-4"
//         >
//           <div className="flex justify-between">
//             <h2 className="font-semibold">{order.id}</h2>
//             <span
//               className={`px-2 py-1 rounded text-white text-sm ${
//                 order.status === "Delivered"
//                   ? "bg-green-600"
//                   : order.status === "Processing"
//                   ? "bg-yellow-500"
//                   : "bg-gray-500"
//               }`}
//             >
//               {order.status}
//             </span>
//           </div>

//           <p className="mt-2">Total: ₹{order.total}</p>
//           <p className="text-sm text-gray-600">
//             {order.deliveryType === "delivery" ? "Home Delivery" : "Pickup"}
//           </p>
//           <p className="text-sm text-gray-600">Date: {order.date}</p>

//           <Link
//             to={`/orders/${order.id}`}
//             className="mt-3 inline-block bg-blue-600 text-white px-4 py-1 rounded"
//           >
//             View Details
//           </Link>
//         </div>
//       ))}
//     </div>
//   );
// }
