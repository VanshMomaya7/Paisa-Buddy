import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function TestSupabase() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const testConnection = async () => {
      // Just to confirm env vars are loaded
      console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);

      // Try fetching from a table (e.g. "lessons")
      const { data, error } = await supabase.from("lessons").select("*");

      if (error) {
        console.error("Error fetching lessons:", error.message);
      } else {
        console.log("Lessons:", data);
        setLessons(data);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Supabase Test</h1>
      {lessons.length > 0 ? (
        <ul className="list-disc pl-6">
          {lessons.map((lesson) => (
            <li key={lesson.id}>{lesson.title}</li>
          ))}
        </ul>
      ) : (
        <p>No lessons found or error occurred. Check console.</p>
      )}
    </div>
  );
}
