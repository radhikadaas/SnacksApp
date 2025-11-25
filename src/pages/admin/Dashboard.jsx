import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import ProductForm from "./ProductForm";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  // ----------------------------------
  // Load Products
  // ----------------------------------
  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setProducts([...data]); // NEW ARRAY → forces re-render

    setLoading(false);
  }

  // ----------------------------------
  // Delete Product
  // ----------------------------------
  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) alert(error.message);
    else loadProducts();
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <Link
        to={`/admin/orders`}
        className="inline-block m-3 bg-blue-600 text-white px-4 py-1 rounded"
      >
        Admin Order
      </Link>

      {/* Add new product */}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setEditingProduct({})}
      >
        + Add Product
      </button>

      {/* PRODUCT FORM (Add/Edit) */}
      {editingProduct !== null && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null); // hide form
            loadProducts(); // refresh list
          }}
        />
      )}

      <h2 className="text-xl font-semibold mb-2">Products</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Image</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="border p-2">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>

                <td className="border p-2">{p.name}</td>
                <td className="border p-2">₹{p.price}</td>

                <td className="border p-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => setEditingProduct(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => deleteProduct(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
