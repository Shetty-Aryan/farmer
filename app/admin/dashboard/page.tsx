"use client"
import { useRouter } from 'next/navigation'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "@/components/ui/chart"
import {
  Bell,
  Building,
  FileText,
  Home,
  Leaf,
  LogOut,
  Settings,
  ShieldCheck,
  Store,
  Truck,
  User,
  Users,
} from "lucide-react"
import { auth } from "@/lib/firebase"
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth"

// Sample data for charts
const procurementData = [
  { name: "Jan", amount: 4000 },
  { name: "Feb", amount: 3000 },
  { name: "Mar", amount: 5000 },
  { name: "Apr", amount: 4500 },
  { name: "May", amount: 6000 },
  { name: "Jun", amount: 5500 },
]

const supplyDistribution = [
  { name: "Delhi", value: 30 },
  { name: "Punjab", value: 25 },
  { name: "Haryana", value: 20 },
  { name: "UP", value: 15 },
  { name: "Gujarat", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const activeTenders = [
  {
    id: "TEN-001",
    title: "Wheat Procurement - Delhi Region",
    deadline: "2023-06-15",
    quantity: "500 tons",
    status: "Open",
    bids: 12,
  },
  {
    id: "TEN-002",
    title: "Rice Procurement - Punjab",
    deadline: "2023-06-20",
    quantity: "1000 tons",
    status: "Open",
    bids: 8,
  },
  {
    id: "TEN-003",
    title: "Vegetable Supply - Maharashtra",
    deadline: "2023-06-10",
    quantity: "200 tons",
    status: "Closing Soon",
    bids: 15,
  },
]

const supplyChainEvents = [
  {
    id: "SCE-001",
    product: "Wheat",
    source: "Punjab Farms",
    destination: "Delhi Ration Center",
    status: "In Transit",
    date: "2023-05-15",
  },
  {
    id: "SCE-002",
    product: "Rice",
    source: "Haryana Farms",
    destination: "UP Ration Center",
    status: "Delivered",
    date: "2023-05-12",
  },
  {
    id: "SCE-003",
    product: "Vegetables",
    source: "Maharashtra Farms",
    destination: "Mumbai Ration Center",
    status: "Processing",
    date: "2023-05-16",
  },
]

export default function AdminDashboard() {
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
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <Building className="h-5 w-5 text-purple-600" />
            <span>Admin Portal</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="px-4 py-2">
            <h2 className="mb-2 text-xs font-semibold tracking-tight">Dashboard</h2>
            <div className="space-y-1">
              <Link href="/admin/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Overview
                </Button>
              </Link>
              <Link href="/admin/tenders">
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Tenders
                </Button>
              </Link>
              <Link href="/admin/supply-chain">
                <Button variant="ghost" className="w-full justify-start">
                  <Truck className="mr-2 h-4 w-4" />
                  Supply Chain
                </Button>
              </Link>
              <Link href="/admin/ration-shops">
                <Button variant="ghost" className="w-full justify-start">
                  <Store className="mr-2 h-4 w-4" />
                  Ration Shops
                </Button>
              </Link>
            </div>
          </div>
          <div className="px-4 py-2">
            <h2 className="mb-2 text-xs font-semibold tracking-tight">Management</h2>
            <div className="space-y-1">
              <Link href="/admin/farmers">
                <Button variant="ghost" className="w-full justify-start">
                  <Leaf className="mr-2 h-4 w-4" />
                  Farmers
                </Button>
              </Link>
              <Link href="/admin/consumers">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Consumers
                </Button>
              </Link>
              <Link href="/admin/ledger">
                <Button variant="ghost" className="w-full justify-start">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Public Ledger
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
            <Building className="h-5 w-5 text-purple-600" />
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
              <h1 className="text-2xl font-bold">Government Admin Dashboard</h1>
              <p className="text-gray-500">Welcome back, Amit Verma</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Link href="/admin/tenders/new">
                <Button>Create New Tender</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Procurement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹2.5 Cr</div>
                <p className="text-xs text-muted-foreground">+15.2% from last quarter</p>
                <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-1 w-[75%]" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Tenders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">3 closing this week</p>
                <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-1 w-[45%]" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ration Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,250 tons</div>
                <p className="text-xs text-muted-foreground">Distributed this month</p>
                <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-1 w-[65%]" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tenders">Tenders</TabsTrigger>
              <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Procurement Overview</CardTitle>
                    <CardDescription>Government procurement over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={procurementData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="amount" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Supply Distribution</CardTitle>
                    <CardDescription>Distribution by region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={supplyDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {supplyDistribution.map((entry, index) => (
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
                  <CardDescription>Latest updates from the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-purple-100 p-2">
                          <FileText className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">New Tender Created</p>
                          <p className="text-sm text-gray-500">Wheat Procurement - Delhi Region</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">2 hours ago</div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-green-100 p-2">
                          <Truck className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Supply Delivered</p>
                          <p className="text-sm text-gray-500">Rice shipment to UP Ration Center</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">5 hours ago</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-blue-100 p-2">
                          <ShieldCheck className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Ledger Updated</p>
                          <p className="text-sm text-gray-500">15 new transactions recorded</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">1 day ago</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tenders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Tenders</CardTitle>
                  <CardDescription>Current procurement opportunities</CardDescription>
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
                          <th className="text-left py-3 px-2">Bids</th>
                          <th className="text-left py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeTenders.map((tender) => (
                          <tr key={tender.id} className="border-b">
                            <td className="py-3 px-2">{tender.id}</td>
                            <td className="py-3 px-2">{tender.title}</td>
                            <td className="py-3 px-2">{tender.deadline}</td>
                            <td className="py-3 px-2">{tender.quantity}</td>
                            <td className="py-3 px-2">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  tender.status === "Open"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-orange-100 text-orange-800"
                                }`}
                              >
                                {tender.status}
                              </span>
                            </td>
                            <td className="py-3 px-2">{tender.bids}</td>
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

            <TabsContent value="supply-chain" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Supply Chain Tracking</CardTitle>
                  <CardDescription>Monitor movement of goods from purchase to distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">ID</th>
                          <th className="text-left py-3 px-2">Product</th>
                          <th className="text-left py-3 px-2">Source</th>
                          <th className="text-left py-3 px-2">Destination</th>
                          <th className="text-left py-3 px-2">Status</th>
                          <th className="text-left py-3 px-2">Date</th>
                          <th className="text-left py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supplyChainEvents.map((event) => (
                          <tr key={event.id} className="border-b">
                            <td className="py-3 px-2">{event.id}</td>
                            <td className="py-3 px-2">{event.product}</td>
                            <td className="py-3 px-2">{event.source}</td>
                            <td className="py-3 px-2">{event.destination}</td>
                            <td className="py-3 px-2">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  event.status === "Delivered"
                                    ? "bg-green-100 text-green-800"
                                    : event.status === "In Transit"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-orange-100 text-orange-800"
                                }`}
                              >
                                {event.status}
                              </span>
                            </td>
                            <td className="py-3 px-2">{event.date}</td>
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

              <Card>
                <CardHeader>
                  <CardTitle>Public Ledger</CardTitle>
                  <CardDescription>Transparent record of all government purchases and movement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-blue-100 p-2">
                          <ShieldCheck className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Purchase Transaction</p>
                          <p className="text-sm text-gray-500">500 tons of wheat from Punjab Farms</p>
                          <p className="text-xs text-gray-400">Transaction ID: 0x8f7e6d5c4b3a2918</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">May 15, 2023</div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-blue-100 p-2">
                          <ShieldCheck className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Distribution Transaction</p>
                          <p className="text-sm text-gray-500">200 tons of rice to UP Ration Centers</p>
                          <p className="text-xs text-gray-400">Transaction ID: 0x7e6d5c4b3a291807</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">May 12, 2023</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-blue-100 p-2">
                          <ShieldCheck className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Tender Creation</p>
                          <p className="text-sm text-gray-500">Vegetable Supply - Maharashtra</p>
                          <p className="text-xs text-gray-400">Transaction ID: 0x6d5c4b3a29180796</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">May 10, 2023</div>
                    </div>
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
