import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Link } from "react-router-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setOrders(data);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const formatDate = (d) =>
    new Date(d).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4">
      <h1 className="text-3xl font-bold mb-4">All Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Order</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="border p-2">{o.id.split("-")[0]}</td>
                <td className="border p-2">₹{o.total}</td>
                <td className="border p-2">{o.user_email || "Unknown"}</td>
                <td className="border p-2">{formatDate(o.created_at)}</td>
                <td className="border p-2">
                  <Link
                    to={`/admin/orders/${o.id}`}
                    className="text-blue-600 underline"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


// import { useEffect, useState } from "react";
// import { supabase } from "../../lib/supabaseClient";
// import { Link } from "react-router-dom";

// export default function AdminOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   async function loadOrders() {
//     const { data, error } = await supabase
//       .from("orders")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (!error) setOrders(data);
//     setLoading(false);
//   }

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   const formatDate = (d) =>
//     new Date(d).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//   return (
//     <div className="max-w-4xl mx-auto mt-6 p-4">
//       <h1 className="text-3xl font-bold mb-4">All Orders</h1>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <table className="w-full border">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border p-2">Order</th>
//               <th className="border p-2">Total</th>
//               <th className="border p-2">Date</th>
//               <th className="border p-2">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {orders.map((o) => (
//               <tr key={o.id}>
//                 <td className="border p-2">{o.id.split("-")[0]}</td>
//                 <td className="border p-2">₹{o.total}</td>
//                 <td className="border p-2">{formatDate(o.created_at)}</td>
//                 <td className="border p-2">
//                   <Link
//                     to={`/admin/orders/${o.id}`}
//                     className="text-blue-600 underline"
//                   >
//                     Manage
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

