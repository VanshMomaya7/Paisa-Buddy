import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function AuthUI({ googleOnly = false, setSessionInParent }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionInParent?.(session); // update parent
    });

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setSessionInParent?.(session); // update parent
      }
    );

    return () => subscription?.unsubscribe();
  }, [setSessionInParent]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error(error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error.message);
    else setSession(null); // optional, parent updated via onAuthStateChange
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-100 w-full">
        {googleOnly ? (
          <button
            onClick={handleGoogleLogin}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition w"
          >
            Sign in with Google
          </button>
        ) : (
          <div className="w-full max-w-md">
            <SupabaseAuth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={["google"]}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-semibold">Logged in!</h1>
      <button
        onClick={handleLogout}
        className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}
