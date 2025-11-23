import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const active = (path) =>
    location.pathname === path ? "text-blue-600 font-bold" : "text-gray-700";

  const { user } = useAuth();

  async function logout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center">
      {/* Brand Logo */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        🍿 Snacks
      </Link>

      {/* Navigation Links */}
      <div className="space-x-4 flex items-center">
        <Link className={active("/")} to="/">
          Home
        </Link>

        <Link className={active("/cart")} to="/cart">
          Cart
        </Link>

        <Link className={active("/orders")} to="/orders">
          Orders
        </Link>

        <Link className={active("/profile")} to="/profile">
          Profile
        </Link>

        {/* Show Admin link only when logged in */}
        {user && (
          <Link className={active("/admin")} to="/admin">
            Admin
          </Link>
        )}

        {/* Login / Logout buttons */}
        {user ? (
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        ) : (
          <Link className={active("/login")} to="/login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
