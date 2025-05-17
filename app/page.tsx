import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Leaf, ShoppingBag, Building } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">KisanDirect</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Connecting Farmers Directly to Consumers & Government
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Empowering farmers with direct market access while ensuring transparency in government procurement.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/register?role=farmer">
                    <Button className="w-full">
                      I'm a Farmer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/register?role=consumer">
                    <Button className="w-full" variant="outline">
                      I'm a Consumer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Farmer to Consumer Platform"
                  className="rounded-lg object-cover"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Platform Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform serves three distinct user groups with specialized features
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <Card>
                <CardContent className="p-6 flex flex-col items-center space-y-4">
                  <Leaf className="h-12 w-12 text-green-600" />
                  <h3 className="text-xl font-bold">For Farmers</h3>
                  <p className="text-gray-500 text-sm text-center">
                    List products, manage orders, access government procurement opportunities, and track sales
                    analytics.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center space-y-4">
                  <ShoppingBag className="h-12 w-12 text-blue-600" />
                  <h3 className="text-xl font-bold">For Consumers</h3>
                  <p className="text-gray-500 text-sm text-center">
                    Discover local produce, place orders directly with farmers, track deliveries, and build
                    relationships with producers.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center space-y-4">
                  <Building className="h-12 w-12 text-purple-600" />
                  <h3 className="text-xl font-bold">For Government</h3>
                  <p className="text-gray-500 text-sm text-center">
                    Publish procurement tenders, manage bids, track supply chain, and maintain transparent records.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="farmer" className="w-full max-w-4xl mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tighter">How It Works</h2>
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="farmer">For Farmers</TabsTrigger>
                  <TabsTrigger value="consumer">For Consumers</TabsTrigger>
                  <TabsTrigger value="government">For Government</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="farmer" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center">
                  <div>
                    <img
                      src="/placeholder.svg?height=300&width=400"
                      alt="Farmer Dashboard"
                      className="rounded-lg object-cover"
                      width={400}
                      height={300}
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Farmer Dashboard</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-green-500 p-1 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>Authenticate with phone number or Aadhar</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-green-500 p-1 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>List products with details and pricing</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-green-500 p-1 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>Manage orders and update status</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-green-500 p-1 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>Access government procurement opportunities</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="consumer" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center">
                  <div>
                    <img
                      src="/placeholder.svg?height=300&width=400"
                      alt="Consumer Dashboard"
                      className="rounded-lg object-cover"
                      width={400}
                      height={300}
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Consumer Experience</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-blue-500 p-1 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>Discover nearby farms and products</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-blue-500 p-1 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>Filter products by category, freshness, and price</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-blue-500 p-1 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>Place orders directly with farmers</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-blue-500 p-1 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>Track orders and message farmers</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="government" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center">
                  <div>
                    <img
                      src="/placeholder.svg?height=300&width=400"
                      alt="Government Dashboard"
                      className="rounded-lg object-cover"
                      width={400}
                      height={300}
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Government Administration</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-purple-500 p-1 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>Publish procurement tenders</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-purple-500 p-1 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>Manage and verify farmer bids</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-purple-500 p-1 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>Track supply chain from purchase to distribution</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-purple-500 p-1 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>Maintain transparent public ledger</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 KisanDirect. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
