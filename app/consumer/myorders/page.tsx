"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import {
  Bell,
  ChevronLeft,
  Clock,
  Home,
  Leaf,
  LogOut,
  Package,
  PackageCheck,
  PackageX,
  Settings,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react"

// Mock order data - in a real app, this would come from an API
interface OrderItem {
  id: number
  name: string
  price: number
  image: string
  farmer: string
  unit: string
  quantity: number
}

interface Order {
  id: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: OrderItem[]
  total: number
  paymentMethod: string
  deliveryAddress: {
    address: string
    city: string
    state: string
    postalCode: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
}

// Mock data generator
const generateMockOrders = (userId: string): Order[] => {
  const statuses: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"]
  const products = [
    {
      id: 1,
      name: "Organic Tomatoes",
      price: 40,
      image: "/placeholder.svg?height=80&width=80",
      farmer: "Green Farms",
      unit: "kg",
    },
    {
      id: 2,
      name: "Fresh Spinach",
      price: 30,
      image: "/placeholder.svg?height=80&width=80",
      farmer: "Healthy Harvests",
      unit: "bunch",
    },
    {
      id: 3,
      name: "Red Onions",
      price: 25,
      image: "/placeholder.svg?height=80&width=80",
      farmer: "Local Growers",
      unit: "kg",
    },
    {
      id: 4,
      name: "Organic Potatoes",
      price: 35,
      image: "/placeholder.svg?height=80&width=80",
      farmer: "Earth Bounty",
      unit: "kg",
    },
    {
      id: 5,
      name: "Fresh Carrots",
      price: 30,
      image: "/placeholder.svg?height=80&width=80",
      farmer: "Sunrise Farms",
      unit: "kg",
    },
  ]

  const paymentMethods = ["Credit Card", "UPI", "Wallet"]
  const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"]
  const states = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Telangana"]

  // Generate 5-10 random orders
  const orderCount = Math.floor(Math.random() * 6) + 5
  const orders: Order[] = []

  for (let i = 0; i < orderCount; i++) {
    // Generate random date within the last 3 months
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 90))

    // Random status
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    // Random items (1-4 items per order)
    const itemCount = Math.floor(Math.random() * 4) + 1
    const items: OrderItem[] = []
    let orderTotal = 0

    for (let j = 0; j < itemCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)]
      const quantity = Math.floor(Math.random() * 3) + 1
      const item = {
        ...product,
        quantity,
      }
      items.push(item)
      orderTotal += product.price * quantity
    }

    // Add delivery fee
    orderTotal += 50

    // Random city and state
    const cityIndex = Math.floor(Math.random() * cities.length)

    const order: Order = {
      id: `ORD-${100000 + i}`,
      date: date.toISOString(),
      status,
      items,
      total: orderTotal,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      deliveryAddress: {
        address: `${Math.floor(Math.random() * 100) + 1}, Sample Street`,
        city: cities[cityIndex],
        state: states[cityIndex],
        postalCode: `${Math.floor(Math.random() * 900000) + 100000}`,
      },
    }

    // Add tracking and estimated delivery for shipped orders
    if (status === "shipped" || status === "delivered") {
      order.trackingNumber = `TRK${Math.floor(Math.random() * 10000000)}`

      const deliveryDate = new Date()
      deliveryDate.setDate(date.getDate() + Math.floor(Math.random() * 5) + 3)
      order.estimatedDelivery = deliveryDate.toISOString()
    }

    orders.push(order)
  }

  // Sort by date (newest first)
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export default function OrdersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const useCurrentUser = () => {
    const [user, setUser] = useState<any>(null)
    const auth = getAuth()

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            id: firebaseUser.uid,
            name: firebaseUser.displayName || null,
            email: firebaseUser.email || null,
            image: firebaseUser.photoURL || null,
          })
        } else {
          setUser(null)
        }
      })

      return () => unsubscribe()
    }, [auth])

    return user
  }

  const user = useCurrentUser()
  const userId = user?.uid

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/auth/login") // Redirect user after logout
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Fetch orders
  useEffect(() => {
    if (userId) {
      // In a real app, this would be an API call
      // Example: fetch(`/api/orders?userId=${userId}`)
      setLoading(true)

      // Simulate API delay
      setTimeout(() => {
        const mockOrders = generateMockOrders(userId)
        setOrders(mockOrders)
        setLoading(false)
      }, 1000)
    }
  }, [userId])

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return ["pending", "processing", "shipped"].includes(order.status)
    if (activeTab === "delivered") return order.status === "delivered"
    if (activeTab === "cancelled") return order.status === "cancelled"
    return true
  })

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <PackageCheck className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <PackageX className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Order Placed"
      case "processing":
        return "Processing"
      case "shipped":
        return "Shipped"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancelled"
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("en-IN", options)
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col bg-gray-50 border-r md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/consumer/dashboard" className="flex items-center gap-2 font-semibold">
            <Leaf className="h-5 w-5 text-green-600" />
            <span>Consumer Portal</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="px-4 py-2">
            <h2 className="mb-2 text-xs font-semibold tracking-tight">Shopping</h2>
            <div className="space-y-1">
              <Link href="/consumer/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/consumer/products">
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Products
                </Button>
              </Link>
              <Link href="/consumer/orders">
                <Button variant="ghost" className="w-full justify-start bg-gray-200">
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </Button>
              </Link>
            </div>
          </div>
        </nav>
        <div className="border-t p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              {user?.photoURL ? (
                <img src={user.photoURL || "/placeholder.svg"} alt="User" className="h-10 w-10 rounded-full" />
              ) : (
                <span className="text-sm font-semibold">{user?.displayName?.[0] || user?.email?.[0] || "U"}</span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.displayName || user?.email || "Unknown User"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/consumer/settings">
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 hover:bg-red-100">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="flex h-14 items-center border-b px-4 md:h-16">
          <Button variant="outline" size="sm" className="mr-4 md:hidden">
            <Leaf className="h-5 w-5 text-green-600" />
          </Button>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="md:hidden">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">My Orders</h1>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders found</h2>
              <p className="text-gray-500 mb-6">
                You don't have any {activeTab !== "all" ? activeTab : ""} orders yet.
              </p>
              <Link href="/consumer/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <CardDescription>Placed on {formatDate(order.date)}</CardDescription>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0 space-x-2">
                        {getStatusIcon(order.status)}
                        <span className="font-medium">{getStatusText(order.status)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium mb-2">Items</h3>
                        <div className="space-y-2">
                          {order.items.slice(0, 2).map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                              <div className="h-12 w-12 rounded-md overflow-hidden">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                  {item.quantity} x ₹{item.price}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Delivery Address</h3>
                        <p className="text-sm">{order.deliveryAddress.address}</p>
                        <p className="text-sm">
                          {order.deliveryAddress.city}, {order.deliveryAddress.state}
                        </p>
                        <p className="text-sm">{order.deliveryAddress.postalCode}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Order Info</h3>
                        <p className="text-sm">
                          <span className="text-gray-500">Total:</span> ₹{order.total}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Payment:</span> {order.paymentMethod}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-sm">
                            <span className="text-gray-500">Tracking:</span> {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setSelectedOrder(order)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Order #{order.id}</DialogTitle>
                          <DialogDescription>Placed on {formatDate(order.date)}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(order.status)}
                              <span className="font-medium">{getStatusText(order.status)}</span>
                            </div>
                            {order.estimatedDelivery && (
                              <div className="text-sm">
                                <span className="text-gray-500">Estimated Delivery:</span>{" "}
                                {formatDate(order.estimatedDelivery)}
                              </div>
                            )}
                          </div>

                          <Separator />

                          <div>
                            <h3 className="font-medium mb-2">Items</h3>
                            <div className="space-y-3">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center space-x-4">
                                  <div className="h-16 w-16 rounded-md overflow-hidden">
                                    <img
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">Farmer: {item.farmer}</p>
                                    <p className="text-sm">
                                      ₹{item.price}/{item.unit}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">₹{item.price * item.quantity}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-medium mb-2">Delivery Address</h3>
                              <p>{order.deliveryAddress.address}</p>
                              <p>
                                {order.deliveryAddress.city}, {order.deliveryAddress.state}
                              </p>
                              <p>{order.deliveryAddress.postalCode}</p>
                            </div>
                            <div>
                              <h3 className="font-medium mb-2">Payment Information</h3>
                              <p>
                                <span className="text-gray-500">Method:</span> {order.paymentMethod}
                              </p>
                              {order.trackingNumber && (
                                <p>
                                  <span className="text-gray-500">Tracking Number:</span> {order.trackingNumber}
                                </p>
                              )}
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Subtotal</span>
                              <span>₹{order.total - 50}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Delivery Fee</span>
                              <span>₹50</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-medium text-lg">
                              <span>Total</span>
                              <span>₹{order.total}</span>
                            </div>
                          </div>
                        </div>
                        {order.status === "delivered" && (
                          <div className="flex justify-end">
                            <Button variant="outline">Download Invoice</Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    {order.status === "pending" && (
                      <Button
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => {
                          toast({
                            title: "Order cancelled",
                            description: `Order #${order.id} has been cancelled.`,
                          })
                          // In a real app, this would call an API to cancel the order
                          setOrders(orders.map((o) => (o.id === order.id ? { ...o, status: "cancelled" as const } : o)))
                        }}
                      >
                        Cancel Order
                      </Button>
                    )}
                    {order.status === "delivered" && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "Thank you!",
                            description: "Your feedback has been submitted.",
                          })
                        }}
                      >
                        Rate Order
                      </Button>
                    )}
                    {order.status === "shipped" && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          window.open(`https://example.com/track/${order.trackingNumber}`, "_blank")
                        }}
                      >
                        Track Order
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
