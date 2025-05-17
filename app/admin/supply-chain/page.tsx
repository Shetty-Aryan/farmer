"use client"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Building,
  FileText,
  Home,
  Leaf,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  Store,
  Truck,
  User,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { auth } from '@/lib/firebase'
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth'

// Sample data
const supplyChainEvents = [
  {
    id: "SCE-001",
    product: "Wheat",
    quantity: "500 tons",
    source: "Punjab Farms",
    sourceLocation: "Punjab",
    destination: "Delhi Ration Center",
    destinationLocation: "Delhi",
    status: "In Transit",
    date: "2023-05-15",
    estimatedArrival: "2023-05-18",
    transactionId: "0x8f7e6d5c4b3a2918",
  },
  {
    id: "SCE-002",
    product: "Rice",
    quantity: "1000 tons",
    source: "Haryana Farms",
    sourceLocation: "Haryana",
    destination: "UP Ration Center",
    destinationLocation: "Uttar Pradesh",
    status: "Delivered",
    date: "2023-05-12",
    estimatedArrival: "2023-05-15",
    transactionId: "0x7e6d5c4b3a291807",
  },
  {
    id: "SCE-003",
    product: "Vegetables",
    quantity: "200 tons",
    source: "Maharashtra Farms",
    sourceLocation: "Maharashtra",
    destination: "Mumbai Ration Center",
    destinationLocation: "Maharashtra",
    status: "Processing",
    date: "2023-05-16",
    estimatedArrival: "2023-05-20",
    transactionId: "0x6d5c4b3a29180796",
  },
  {
    id: "SCE-004",
    product: "Potatoes",
    quantity: "300 tons",
    source: "Gujarat Farms",
    sourceLocation: "Gujarat",
    destination: "Ahmedabad Ration Center",
    destinationLocation: "Gujarat",
    status: "Delivered",
    date: "2023-05-10",
    estimatedArrival: "2023-05-13",
    transactionId: "0x5c4b3a2918079685",
  },
  {
    id: "SCE-005",
    product: "Onions",
    quantity: "150 tons",
    source: "Maharashtra Farms",
    sourceLocation: "Maharashtra",
    destination: "Pune Ration Center",
    destinationLocation: "Maharashtra",
    status: "In Transit",
    date: "2023-05-14",
    estimatedArrival: "2023-05-17",
    transactionId: "0x4b3a291807968574",
  },
]

export default function SupplyChainPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
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

  // Filter supply chain events
  const filteredEvents = supplyChainEvents.filter((event) => {
    const matchesSearch =
      event.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.destination.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || event.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

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
                <Button variant="secondary" className="w-full justify-start">
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
              <h1 className="text-2xl font-bold">Supply Chain Management</h1>
              <p className="text-gray-500">Track and manage the movement of goods from purchase to distribution</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button>
                <Truck className="mr-2 h-4 w-4" />
                Add New Shipment
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-auto md:flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search by ID, product, source, or destination..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="in transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="list" className="mb-6">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="ledger">Ledger View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Supply Chain Events</CardTitle>
                  <CardDescription>All shipments and their current status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">ID</th>
                          <th className="text-left py-3 px-2">Product</th>
                          <th className="text-left py-3 px-2">Quantity</th>
                          <th className="text-left py-3 px-2">Source</th>
                          <th className="text-left py-3 px-2">Destination</th>
                          <th className="text-left py-3 px-2">Status</th>
                          <th className="text-left py-3 px-2">Date</th>
                          <th className="text-left py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEvents.map((event) => (
                          <tr key={event.id} className="border-b">
                            <td className="py-3 px-2">{event.id}</td>
                            <td className="py-3 px-2">{event.product}</td>
                            <td className="py-3 px-2">{event.quantity}</td>
                            <td className="py-3 px-2">
                              {event.source}
                              <div className="text-xs text-gray-500">{event.sourceLocation}</div>
                            </td>
                            <td className="py-3 px-2">
                              {event.destination}
                              <div className="text-xs text-gray-500">{event.destinationLocation}</div>
                            </td>
                            <td className="py-3 px-2">
                              <Badge
                                className={
                                  event.status === "Delivered"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : event.status === "In Transit"
                                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                      : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                                }
                              >
                                {event.status}
                              </Badge>
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
            </TabsContent>

            <TabsContent value="map" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Supply Chain Map</CardTitle>
                  <CardDescription>Visual representation of current shipments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Map visualization would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ledger" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Supply Chain Ledger</CardTitle>
                  <CardDescription>Immutable record of all supply chain transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-blue-100 p-2">
                            <ShieldCheck className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {event.product} Shipment - {event.id}
                            </p>
                            <p className="text-sm text-gray-500">
                              From {event.source} to {event.destination}
                            </p>
                            <p className="text-xs text-gray-400">Transaction ID: {event.transactionId}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{event.date}</div>
                      </div>
                    ))}
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
