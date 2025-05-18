"use client"

import { useState } from "react"
import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Mail, Lock, AlertCircle, CheckCircle } from "lucide-react"

type Role = "farmer" | "customer" | "government"

export default function SignUpPage() {
  const [role, setRole] = useState<Role>("customer")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const googleProvider = new GoogleAuthProvider()

  // Store user data in Firestore with role-specific collections
  const storeUserData = async (uid: string, email: string, method: string) => {
    try {
      // Role-specific collection
      await setDoc(doc(db, `${role}s`, uid), {
        uid,
        email,
        role,
        createdAt: new Date().toISOString(),
        authMethod: method,
      })

      // General users collection for easy querying
      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        role,
        createdAt: new Date().toISOString(),
      })

      console.log(`User data stored in ${role}s collection`)
    } catch (err: any) {
      console.error("Error storing user data:", err)
      throw new Error("Failed to store user data. Please try again.")
    }
  }

  const handleEmailSignUp = async () => {
    setError(null)
    setMessage(null)
    setIsLoading(true)

    if (!email || !password) {
      setError("Email and password are required.")
      setIsLoading(false)
      return
    }

    try {
      // Create user with email/password
      const userCred = await createUserWithEmailAndPassword(auth, email, password)

      // Store user data with role info
      await storeUserData(userCred.user.uid, email, "email")

      setMessage("Signup successful!")
      setEmail("")
      setPassword("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError(null)
    setMessage(null)
    setIsLoading(true)

    try {
      const result = await signInWithPopup(auth, googleProvider)

      // Store user data
      await storeUserData(result.user.uid, result.user.email || "", "google")

      setMessage("Google signup successful!")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = (newRole: Role) => {
    setRole(newRole)
    setError(null)
    setMessage(null)
    setEmail("")
    setPassword("")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white text-black p-8 rounded-lg border border-gray-200 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-black">Create Account</h1>
          <p className="text-gray-600 mt-2">Sign up as a {role}</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center space-x-3 mb-6">
            {(["customer", "farmer", "government"] as const).map((r) => (
              <button
                key={r}
                onClick={() => resetForm(r)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all",
                  role === r ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-black"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-black"
              />
            </div>
          </div>

          <Button
            onClick={handleEmailSignUp}
            className="w-full bg-black text-white hover:bg-gray-900 font-medium py-3 h-12 rounded-md"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? "Creating account..." : "Sign Up with Email"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignUp}
            className="w-full bg-white text-black hover:bg-gray-50 font-medium py-3 h-12 rounded-md border border-gray-300"
            variant="outline"
            disabled={isLoading}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign Up with Google
          </Button>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {message && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md text-green-600 text-sm">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <p>{message}</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <a href="/auth/login" className="text-black hover:underline font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
