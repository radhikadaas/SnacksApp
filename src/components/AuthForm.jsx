import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function AuthForm({ redirectTo = "/" }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email");

  async function signInWithEmail() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + `/auth/callback?redirect=${redirectTo}`
      }
    });

    if (error) alert(error.message);
    else alert("Magic link sent! Check your email.");
  }

  return (
    <div className="p-4 max-w-md mx-auto shadow-md rounded-lg bg-white">
      <h2 className="text-xl font-bold mb-3">Login</h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white py-2 w-full rounded"
        onClick={signInWithEmail}
      >
        Send Magic Link
      </button>
    </div>
  );
}

export default AuthForm;
