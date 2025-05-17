"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Leaf, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Role = "farmer" | "customer" | "government"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<Role>("farmer")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const googleProvider = new GoogleAuthProvider()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Attempting to sign in with email:", email)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("Sign in successful, checking role...")

      try {
        // First check in the role-specific collection
        const roleDocRef = doc(db, role + "s", userCredential.user.uid)
        const roleDocSnap = await getDoc(roleDocRef)

        if (roleDocSnap.exists()) {
          // User exists in the selected role collection
          console.log(`User found in ${role}s collection`)
          setError(null)
          toast({
            title: "Login successful",
            description: `You have been logged in as a ${role}`,
          })

          // Redirect based on role
          if (role === "farmer") {
            router.push("/farmer/dashboard")
          } else if (role === "customer") {
            router.push("/consumer/dashboard")
          } else if (role === "government") {
            router.push("/government/dashboard")
          }
          return
        }

        // If not found in the selected role collection, check the users collection
        console.log("User not found in role collection, checking users collection")
        const userDocRef = doc(db, "users", userCredential.user.uid)
        const userDocSnap = await getDoc(userDocRef)

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data()
          const actualRole = userData.role as Role

          if (actualRole !== role) {
            // User exists but with a different role
            console.log(`User is a ${actualRole}, not a ${role}`)
            setError(`You are registered as a ${actualRole}, not a ${role}. Please select the correct role.`)
            toast({
              title: "Wrong role selected",
              description: `You are registered as a ${actualRole}, not a ${role}. Please select the correct role.`,
              variant: "destructive",
            })
            await auth.signOut()
            return
          }
        }

        // User not found in any collection
        console.log("User not found in any collection")
        setError(`No ${role} account found with these credentials.`)
        toast({
          title: "Account not found",
          description: `No ${role} account found with these credentials.`,
          variant: "destructive",
        })
        await auth.signOut()
      } catch (roleErr: any) {
        console.error("Error checking user role:", roleErr)
        setError(`Error verifying account: ${roleErr.message}`)
        toast({
          title: "Error",
          description: "Failed to verify account. Please try again.",
          variant: "destructive",
        })
        await auth.signOut()
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message)
      toast({
        title: "Login failed",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Attempting to sign in with Google")
      const result = await signInWithPopup(auth, googleProvider)
      console.log("Google sign in successful, checking role...")

      try {
        // First check in the role-specific collection
        const roleDocRef = doc(db, role + "s", result.user.uid)
        const roleDocSnap = await getDoc(roleDocRef)

        if (roleDocSnap.exists()) {
          // User exists in the selected role collection
          console.log(`User found in ${role}s collection`)
          setError(null)
          toast({
            title: "Login successful",
            description: `You have been logged in as a ${role}`,
          })

          // Redirect based on role
          if (role === "farmer") {
            router.push("/farmer/dashboard")
          } else if (role === "customer") {
            router.push("/customer/dashboard")
          } else if (role === "government") {
            router.push("/government/dashboard")
          }
          return
        }

        // If not found in the selected role collection, check the users collection
        console.log("User not found in role collection, checking users collection")
        const userDocRef = doc(db, "users", result.user.uid)
        const userDocSnap = await getDoc(userDocRef)

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data()
          const actualRole = userData.role as Role

          if (actualRole !== role) {
            // User exists but with a different role
            console.log(`User is a ${actualRole}, not a ${role}`)
            setError(`You are registered as a ${actualRole}, not a ${role}. Please select the correct role.`)
            toast({
              title: "Wrong role selected",
              description: `You are registered as a ${actualRole}, not a ${role}. Please select the correct role.`,
              variant: "destructive",
            })
            await auth.signOut()
            return
          }
        }

        // User not found in any collection
        console.log("User not found in any collection")
        setError(`No ${role} account found with these credentials.`)
        toast({
          title: "Account not found",
          description: `No ${role} account found with these credentials.`,
          variant: "destructive",
        })
        await auth.signOut()
      } catch (roleErr: any) {
        console.error("Error checking user role:", roleErr)
        setError(`Error verifying account: ${roleErr.message}`)
        toast({
          title: "Error",
          description: "Failed to verify account. Please try again.",
          variant: "destructive",
        })
        await auth.signOut()
      }
    } catch (err: any) {
      console.error("Google login error:", err)
      setError(err.message)
      toast({
        title: "Login failed",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center bg-white">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <Leaf className="h-6 w-6" />
        <span className="text-lg font-bold">KisanDirect</span>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>

        <Tabs defaultValue="farmer" className="w-full" onValueChange={(value) => setRole(value as Role)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="farmer"
              className={cn(
                role === "farmer"
                  ? "bg-black text-white data-[state=active]:bg-black data-[state=active]:text-white"
                  : "",
              )}
            >
              Farmer
            </TabsTrigger>
            <TabsTrigger
              value="customer"
              className={cn(
                role === "customer"
                  ? "bg-black text-white data-[state=active]:bg-black data-[state=active]:text-white"
                  : "",
              )}
            >
              Customer
            </TabsTrigger>
            <TabsTrigger
              value="government"
              className={cn(
                role === "government"
                  ? "bg-black text-white data-[state=active]:bg-black data-[state=active]:text-white"
                  : "",
              )}
            >
              Government
            </TabsTrigger>
          </TabsList>

          {["farmer", "customer", "government"].map((currentRole) => (
            <TabsContent key={currentRole} value={currentRole}>
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle>{currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Login</CardTitle>
                  <CardDescription>
                    {currentRole === "government"
                      ? "Government official secure login"
                      : "Login with your email and password"}
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleEmailLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-10 border-gray-300 focus:border-black focus:ring-black"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 h-10 border-gray-300 focus:border-black focus:ring-black"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}

                    {success && (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <p>{success}</p>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Link href="/auth/forgot-password" className="text-sm text-gray-600 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button
                      className="w-full bg-black text-white hover:bg-gray-900 h-10"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In with Email"}
                    </Button>

                    <div className="relative w-full">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">or</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full bg-white text-black hover:bg-gray-50 font-medium h-10 rounded-md border border-gray-300"
                      variant="outline"
                      disabled={isLoading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                      Sign In with Google
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-black font-medium hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
