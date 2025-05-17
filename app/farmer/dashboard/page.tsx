"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "@/components/ui/chart"
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Calendar,
  Home,
  Inbox,
  Leaf,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  User,
} from "lucide-react"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

// Sample data for charts
const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
]

const productPerformance = [
  { name: "Tomatoes", value: 35 },
  { name: "Potatoes", value: 25 },
  { name: "Onions", value: 20 },
  { name: "Wheat", value: 15 },
  { name: "Rice", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const recentOrders = [
  { id: "ORD-001", customer: "Rahul Sharma", date: "2023-05-15", status: "Delivered", amount: "₹1,200" },
  { id: "ORD-002", customer: "Priya Patel", date: "2023-05-14", status: "Processing", amount: "₹850" },
  { id: "ORD-003", customer: "Amit Kumar", date: "2023-05-13", status: "Pending", amount: "₹2,100" },
  { id: "ORD-004", customer: "Neha Singh", date: "2023-05-12", status: "Delivered", amount: "₹750" },
]

const govProcurements = [
  {
    id: "GOV-001",
    title: "Wheat Procurement - Delhi Region",
    deadline: "2023-06-15",
    quantity: "500 tons",
    status: "Open",
  },
  { id: "GOV-002", title: "Rice Procurement - Punjab", deadline: "2023-06-20", quantity: "1000 tons", status: "Open" },
  {
    id: "GOV-003",
    title: "Vegetable Supply - Maharashtra",
    deadline: "2023-06-10",
    quantity: "200 tons",
    status: "Closing Soon",
  },
]

export default function FarmerDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login"); // Redirect user after logout
    } catch (error) {
      console.error("Error signing out:", error);
      // Optional: Toast or alert
    }
  };
  const useCurrentUser = () => {
    const [user, setUser] = useState<any>(null);
    const auth = getAuth();
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            id: firebaseUser.uid,
            name: firebaseUser.displayName || null,
            email: firebaseUser.email || null,
            image: firebaseUser.photoURL || null,
          });
        } else {
          setUser(null);
        }
      });
  
      return () => unsubscribe();
    }, [auth]);
  
    return user;
  };
  const [activeTab, setActiveTab] = useState("overview")
  const user = useCurrentUser();

const userId = user?.uid;

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
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Orders
                </Button>
              </Link>
              <Link href="/farmer/procurement">
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Gov. Procurement
                </Button>
              </Link>
            </div>
          </div>
        </nav>
        <div className="border-t p-4">
  <div className="flex items-center gap-4 mb-4">
    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
      {user?.photoURL ? (
        <img src={user.photoURL} alt="User" className="h-10 w-10 rounded-full" />
      ) : (
        <span className="text-sm font-semibold">
          {user?.displayName?.[0] || user?.email?.[0] || "U"}
        </span>
      )}
    </div>
    <div>
      <p className="text-sm font-medium">
        {user?.displayName || user?.email || "Unknown User"}
      </p>
      {/* {!editingLocation ? (
        <p className="text-xs text-gray-500">
          {location || (
            <button
              className="text-blue-500 underline"
              onClick={() => setEditingLocation(true)}
            >
              Add Location
            </button>
          )}
        </p>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="Enter city"
            className="text-xs border px-2 py-1 rounded"
          />
          <button
            onClick={saveLocation}
            className="text-blue-600 text-xs underline"
          >
            Save
          </button>
        </div>
      )} */}
    </div>
  </div>
  <div className="flex items-center gap-2">
    <Link href="/consumer/settings">
      <Button variant="outline" size="sm" className="w-full">
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button>
    </Link>
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="text-red-600 hover:bg-red-100"
    >
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
            <Button variant="outline" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Farmer Dashboard</h1>
              <p className="text-gray-500">Welcome back, Rajesh Kumar</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Link href="/farmer/products/new">
                <Button>Add New Product</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹45,231</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-1 w-[75%]" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 new orders today</p>
                <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-1 w-[45%]" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Procurement Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">1 closing soon</p>
                <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-1 w-[30%]" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="procurement">Gov. Procurement</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>Your sales performance over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>Your best performing products by sales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={productPerformance}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {productPerformance.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent orders and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-gray-500">
                            Order {order.id} • {order.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">{order.amount}</p>
                            <p
                              className={`text-sm ${
                                order.status === "Delivered"
                                  ? "text-green-500"
                                  : order.status === "Processing"
                                    ? "text-blue-500"
                                    : "text-orange-500"
                              }`}
                            >
                              {order.status}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Manage your customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">Order ID</th>
                          <th className="text-left py-3 px-2">Customer</th>
                          <th className="text-left py-3 px-2">Date</th>
                          <th className="text-left py-3 px-2">Status</th>
                          <th className="text-left py-3 px-2">Amount</th>
                          <th className="text-left py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="border-b">
                            <td className="py-3 px-2">{order.id}</td>
                            <td className="py-3 px-2">{order.customer}</td>
                            <td className="py-3 px-2">{order.date}</td>
                            <td className="py-3 px-2">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  order.status === "Delivered"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "Processing"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-orange-100 text-orange-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-2">{order.amount}</td>
                            <td className="py-3 px-2">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="procurement" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Government Procurement Opportunities</CardTitle>
                  <CardDescription>Available tenders and procurement requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">ID</th>
                          <th className="text-left py-3 px-2">Title</th>
                          <th className="text-left py-3 px-2">Deadline</th>
                          <th className="text-left py-3 px-2">Quantity</th>
                          <th className="text-left py-3 px-2">Status</th>
                          <th className="text-left py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {govProcurements.map((proc) => (
                          <tr key={proc.id} className="border-b">
                            <td className="py-3 px-2">{proc.id}</td>
                            <td className="py-3 px-2">{proc.title}</td>
                            <td className="py-3 px-2">{proc.deadline}</td>
                            <td className="py-3 px-2">{proc.quantity}</td>
                            <td className="py-3 px-2">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  proc.status === "Open"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-orange-100 text-orange-800"
                                }`}
                              >
                                {proc.status}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <Button variant="outline" size="sm">
                                Apply
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
