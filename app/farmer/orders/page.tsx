"use client"
import { useRouter } from "next/navigation"
import { SetStateAction, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  Check,
  Clock,
  Filter,
  BarChart3,
  Home,
  Inbox,
  Leaf,
  LogOut,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { auth } from "@/lib/firebase"
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth"

// Sample order data
const orders = [
  {
    id: "ORD-2023-001",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98765 43210",
    customerAddress: "123 Main Street, Delhi",
    date: "2023-05-15",
    status: "Pending",
    total: 1200,
    paymentMethod: "Cash on Delivery",
    items: [
      {
        id: 1,
        name: "Fresh Tomatoes",
        price: 40,
        quantity: 10,
        unit: "kg",
        total: 400,
      },
      {
        id: 2,
        name: "Organic Potatoes",
        price: 30,
        quantity: 15,
        unit: "kg",
        total: 450,
      },
      {
        id: 3,
        name: "Fresh Onions",
        price: 35,
        quantity: 10,
        unit: "kg",
        total: 350,
      },
    ],
  },
  {
    id: "ORD-2023-002",
    customerName: "Priya Patel",
    customerPhone: "+91 87654 32109",
    customerAddress: "456 Park Avenue, Mumbai",
    date: "2023-05-14",
    status: "Processing",
    total: 900,
    paymentMethod: "Online Payment",
    items: [
      {
        id: 4,
        name: "Organic Rice",
        price: 60,
        quantity: 15,
        unit: "kg",
        total: 900,
      },
    ],
  },
  {
    id: "ORD-2023-003",
    customerName: "Amit Singh",
    customerPhone: "+91 76543 21098",
    customerAddress: "789 Garden Road, Bangalore",
    date: "2023-05-12",
    status: "Shipped",
    total: 1750,
    paymentMethod: "Online Payment",
    items: [
      {
        id: 1,
        name: "Fresh Tomatoes",
        price: 40,
        quantity: 5,
        unit: "kg",
        total: 200,
      },
      {
        id: 2,
        name: "Organic Potatoes",
        price: 30,
        quantity: 10,
        unit: "kg",
        total: 300,
      },
      {
        id: 3,
        name: "Fresh Onions",
        price: 35,
        quantity: 5,
        unit: "kg",
        total: 175,
      },
      {
        id: 4,
        name: "Organic Rice",
        price: 60,
        quantity: 18,
        unit: "kg",
        total: 1080,
      },
    ],
  },
  {
    id: "ORD-2023-004",
    customerName: "Neha Gupta",
    customerPhone: "+91 65432 10987",
    customerAddress: "101 Lake View, Chennai",
    date: "2023-05-10",
    status: "Delivered",
    total: 1400,
    paymentMethod: "Cash on Delivery",
    items: [
      {
        id: 1,
        name: "Fresh Tomatoes",
        price: 40,
        quantity: 15,
        unit: "kg",
        total: 600,
      },
      {
        id: 3,
        name: "Fresh Onions",
        price: 35,
        quantity: 8,
        unit: "kg",
        total: 280,
      },
      {
        id: 4,
        name: "Organic Rice",
        price: 60,
        quantity: 8.5,
        unit: "kg",
        total: 510,
      },
    ],
  },
  {
    id: "ORD-2023-005",
    customerName: "Vikram Reddy",
    customerPhone: "+91 54321 09876",
    customerAddress: "234 Hill Road, Hyderabad",
    date: "2023-05-08",
    status: "Cancelled",
    total: 750,
    paymentMethod: "Online Payment",
    items: [
      {
        id: 2,
        name: "Organic Potatoes",
        price: 30,
        quantity: 25,
        unit: "kg",
        total: 750,
      },
    ],
  },
]

export default function FarmerOrders() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [ordersList, setOrdersList] = useState(orders)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/auth/login") // Redirect user after logout
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

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

  // View order details
  const handleViewOrder = (order: SetStateAction<{ id: string; customerName: string; customerPhone: string; customerAddress: string; date: string; status: string; total: number; paymentMethod: string; items: { id: number; name: string; price: number; quantity: number; unit: string; total: number }[] } | null>) => {
    setSelectedOrder(order)
    setIsOrderDetailsOpen(true)
  }

  // Update order status
  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = ordersList.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: newStatus }
      }
      return order
    })
    setOrdersList(updatedOrders)

    // If we're updating the currently selected order, update that too
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  // Filter orders based on search query and active tab
  const filteredOrders = ordersList.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "pending") return matchesSearch && order.status === "Pending"
    if (activeTab === "processing") return matchesSearch && order.status === "Processing"
    if (activeTab === "shipped") return matchesSearch && order.status === "Shipped"
    if (activeTab === "delivered") return matchesSearch && order.status === "Delivered"
    if (activeTab === "cancelled") return matchesSearch && order.status === "Cancelled"

    return matchesSearch
  })

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Processing":
        return "bg-blue-500 hover:bg-blue-600"
      case "Shipped":
        return "bg-purple-500 hover:bg-purple-600"
      case "Delivered":
        return "bg-green-500 hover:bg-green-600"
      case "Cancelled":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col bg-gray-50 border-r md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/farmer/dashboard" className="flex items-center gap-2 font-semibold">
            <Leaf className="h-5 w-5 text-green-600" />
            <span>Farmer Portal</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="px-4 py-2">
            <h2 className="mb-2 text-xs font-semibold tracking-tight">Dashboard</h2>
            <div className="space-y-1">
              <Link href="/farmer/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Overview
                </Button>
              </Link>
              <Link href="/farmer/products">
                <Button variant="ghost" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  My Products
                </Button>
              </Link>
              <Link href="/farmer/orders">
                <Button variant="secondary" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Orders
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
        </div>

        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Orders</h1>
              <p className="text-gray-500">Manage your customer orders</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 md:grid-cols-6">
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>₹{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Order Details Dialog */}
        <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                Order ID: {selectedOrder?.id} | Date: {selectedOrder?.date}
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Customer Information</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Name:</span> {selectedOrder.customerName}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {selectedOrder.customerPhone}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span> {selectedOrder.customerAddress}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Order Information</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                      </p>
                      <p>
                        <span className="font-medium">Total Amount:</span> ₹{selectedOrder.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Order Items</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-right">
                              ₹{item.price}/{item.unit}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.quantity} {item.unit}
                            </TableCell>
                            <TableCell className="text-right">₹{item.total.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">
                            Total
                          </TableCell>
                          <TableCell className="text-right font-medium">₹{selectedOrder.total.toFixed(2)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Update Order Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={selectedOrder.status === "Pending" ? "bg-yellow-100" : ""}
                      onClick={() => handleUpdateStatus(selectedOrder.id, "Pending")}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Pending
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={selectedOrder.status === "Processing" ? "bg-blue-100" : ""}
                      onClick={() => handleUpdateStatus(selectedOrder.id, "Processing")}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Processing
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={selectedOrder.status === "Shipped" ? "bg-purple-100" : ""}
                      onClick={() => handleUpdateStatus(selectedOrder.id, "Shipped")}
                    >
                      <Truck className="mr-2 h-4 w-4" />
                      Shipped
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={selectedOrder.status === "Delivered" ? "bg-green-100" : ""}
                      onClick={() => handleUpdateStatus(selectedOrder.id, "Delivered")}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Delivered
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={selectedOrder.status === "Cancelled" ? "bg-red-100" : ""}
                      onClick={() => handleUpdateStatus(selectedOrder.id, "Cancelled")}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancelled
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOrderDetailsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
