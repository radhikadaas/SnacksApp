import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ProductForm({ product, onClose }) {
  const isEditing = Boolean(product?.id);

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(Number(product?.price) || "");
  const [image] = useState(product?.image || "");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // -----------------------------
  // Upload Image to Supabase
  // -----------------------------
  async function uploadImage() {
    if (!file) return image; // keep old image if not uploading a new one

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setUploading(false);
      return image;
    }

    const { data: publicData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    setUploading(false);
    return publicData.publicUrl;
  }

  // -----------------------------
  // Save (Insert or Update) Product
  // -----------------------------
  async function saveProduct(e) {
    e.preventDefault();

    console.log("➡ Starting save...");
    console.log("Product being edited:", product);

    const imageURL = await uploadImage();
    console.log("➡ Final Image URL:", imageURL);

    const payload = {
      name,
      description,
      price: Number(price),
      image: imageURL,
      is_active: true,
    };

    console.log("➡ Payload to Supabase:", payload);

    let response;

    if (isEditing) {
      console.log("➡ Running UPDATE...");
      response = await supabase
        .from("products")
        .update(payload)
        .eq("id", product.id)
        .select(); // IMPORTANT: forces Supabase to return updated row
    } else {
      response = await supabase.from("products").insert(payload).select();
    }

    console.log("➡ Supabase Response:", response);

    if (response.error) {
      alert(response.error.message);
    } else {
      console.log("✅ SUCCESS");
      onClose(); // close the form + reload products
    }
  }

  return (
    <div className="bg-white border rounded p-4 mb-4 shadow">
      <h2 className="text-xl font-bold mb-2">
        {isEditing ? "Edit Product" : "Add Product"}
      </h2>

      <form onSubmit={saveProduct} className="space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Price in INR"
          type="number"
          value={price === "" ? "" : Number(price)}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* IMAGE UPLOAD */}
        <div>
          <label className="font-semibold">Product Image</label>
          <input
            type="file"
            accept="image/*"
            className="border p-2 w-full"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {/* Preview logic */}
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              className="w-24 h-24 object-cover mt-2 rounded"
            />
          ) : image ? (
            <img src={image} className="w-24 h-24 object-cover mt-2 rounded" />
          ) : null}
        </div>

        <div className="space-x-2">
          <button
            type="submit"
            disabled={uploading}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            {uploading ? "Uploading..." : "Save"}
          </button>

          <button
            type="button"
            className="bg-gray-400 text-white px-3 py-1 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
