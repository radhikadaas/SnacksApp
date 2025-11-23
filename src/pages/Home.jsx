import { useEffect, useState } from "react";
import { fetchProducts } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await fetchProducts();
      setProducts(data);
    }
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Snacks Menu</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            className="bg-white shadow-md rounded p-3"
          >
            <img
              src={p.image}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="font-semibold mt-2">{p.name}</h2>
            <p className="text-gray-600">₹{p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
