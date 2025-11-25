export default function OrderStatusBadge({ status }) {
  const colors = {
    ordered: "bg-blue-500",
    in_process: "bg-yellow-500",
    shipped: "bg-indigo-500",
    delivered: "bg-green-600",
    cancelled: "bg-red-600",
  };

  const text = {
    ordered: "Ordered",
    in_process: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return (
    <span
      className={`text-white px-3 py-1 rounded text-sm ${colors[status]}`}
    >
      {text[status]}
    </span>
  );
}
