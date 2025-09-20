import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) alert(error.message)
    else alert("Check your email for confirmation!")
  }

  // Login
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) alert(error.message)
  }

  // Google Login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) alert(error.message)
  }

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (user) {
    return (
      <div className="p-4">
        <h2>Welcome, {user.email}</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-2 w-80 mx-auto">
      <h2 className="text-xl font-bold">Login / Signup</h2>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        onChange={e => setPassword(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2 rounded" onClick={handleSignup}>
        Sign Up
      </button>
      <button className="bg-green-500 text-white p-2 rounded" onClick={handleLogin}>
        Login
      </button>
      <hr className="my-2" />
      <button className="bg-red-500 text-white p-2 rounded" onClick={handleGoogleLogin}>
        Continue with Google
      </button>
    </div>
  )
}
