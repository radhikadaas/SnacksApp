import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchProductById } from "../lib/supabaseClient";

export default function Product() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await fetchProductById(id);
      setProduct(data);
    }
    load();
  }, [id]);

  if (!product) return <h1 className="text-center mt-6">Product not found</h1>;

  return (
    <div className="max-w-md mx-auto p-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-56 object-cover rounded-lg"
      />

      <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
      <p className="text-gray-600 mt-2 text-lg">₹{product.price}</p>

      <p className="text-gray-700 mt-4">{product.description}</p>

      <button
        onClick={() => {
          addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
          });

          toast.success(`${product.name} added to cart!`);

          setTimeout(() => navigate("/cart"), 800);
        }}
        className="w-full bg-blue-600 text-white py-2 rounded mt-6 active:scale-95 transition-transform"
      >
        Add to Cart
      </button>
    </div>
  );
}
