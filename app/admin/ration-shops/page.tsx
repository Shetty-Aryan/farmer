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
import { Progress } from "@/components/ui/progress"
import { auth } from '@/lib/firebase'
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth'

// Sample data
const rationShops = [
  {
    id: "RS-001",
    name: "Delhi Central Ration Shop",
    location: "Central Delhi",
    manager: "Rajiv Kumar",
    contact: "+91 98765 43210",
    status: "Active",
    inventory: [
      { product: "Rice", quantity: "2000 kg", allocated: "5000 kg", percentage: 40 },
      { product: "Wheat", quantity: "1500 kg", allocated: "3000 kg", percentage: 50 },
      { product: "Sugar", quantity: "500 kg", allocated: "1000 kg", percentage: 50 },
      { product: "Oil", quantity: "300 L", allocated: "800 L", percentage: 37.5 },
    ],
    beneficiaries: 1250,
    lastDelivery: "2023-05-10",
    nextDelivery: "2023-05-25",
  },
  {
    id: "RS-002",
    name: "East Delhi Ration Center",
    location: "East Delhi",
    manager: "Priya Singh",
    contact: "+91 87654 32109",
    status: "Active",
    inventory: [
      { product: "Rice", quantity: "1800 kg", allocated: "4000 kg", percentage: 45 },
      { product: "Wheat", quantity: "1200 kg", allocated: "2500 kg", percentage: 48 },
      { product: "Sugar", quantity: "400 kg", allocated: "800 kg", percentage: 50 },
      { product: "Oil", quantity: "250 L", allocated: "600 L", percentage: 41.7 },
    ],
    beneficiaries: 980,
    lastDelivery: "2023-05-12",
    nextDelivery: "2023-05-27",
  },
  {
    id: "RS-003",
    name: "South Delhi Distribution Center",
    location: "South Delhi",
    manager: "Amit Sharma",
    contact: "+91 76543 21098",
    status: "Low Stock",
    inventory: [
      { product: "Rice", quantity: "800 kg", allocated: "4500 kg", percentage: 17.8 },
      { product: "Wheat", quantity: "500 kg", allocated: "3000 kg", percentage: 16.7 },
      { product: "Sugar", quantity: "200 kg", allocated: "900 kg", percentage: 22.2 },
      { product: "Oil", quantity: "100 L", allocated: "700 L", percentage: 14.3 },
    ],
    beneficiaries: 1450,
    lastDelivery: "2023-05-05",
    nextDelivery: "2023-05-20",
  },
  {
    id: "RS-004",
    name: "West Delhi Ration Shop",
    location: "West Delhi",
    manager: "Sanjay Gupta",
    contact: "+91 65432 10987",
    status: "Inactive",
    inventory: [
      { product: "Rice", quantity: "0 kg", allocated: "4000 kg", percentage: 0 },
      { product: "Wheat", quantity: "0 kg", allocated: "2800 kg", percentage: 0 },
      { product: "Sugar", quantity: "0 kg", allocated: "850 kg", percentage: 0 },
      { product: "Oil", quantity: "0 L", allocated: "650 L", percentage: 0 },
    ],
    beneficiaries: 1100,
    lastDelivery: "2023-04-28",
    nextDelivery: "Under Maintenance",
  },
  {
    id: "RS-005",
    name: "North Delhi Distribution Center",
    location: "North Delhi",
    manager: "Neha Patel",
    contact: "+91 54321 09876",
    status: "Active",
    inventory: [
      { product: "Rice", quantity: "3000 kg", allocated: "4200 kg", percentage: 71.4 },
      { product: "Wheat", quantity: "2200 kg", allocated: "2800 kg", percentage: 78.6 },
      { product: "Sugar", quantity: "700 kg", allocated: "950 kg", percentage: 73.7 },
      { product: "Oil", quantity: "500 L", allocated: "700 L", percentage: 71.4 },
    ],
    beneficiaries: 1320,
    lastDelivery: "2023-05-15",
    nextDelivery: "2023-05-30",
  },
]

export default function RationShopsPage() {
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
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter ration shops
  const filteredShops = rationShops.filter((shop) => {
    const matchesSearch =
      shop.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.manager.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && shop.status === "Active") ||
      (statusFilter === "low" && shop.status === "Low Stock") ||
      (statusFilter === "inactive" && shop.status === "Inactive")

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
                <Button variant="ghost" className="w-full justify-start">
                  <Truck className="mr-2 h-4 w-4" />
                  Supply Chain
                </Button>
              </Link>
              <Link href="/admin/ration-shops">
                <Button variant="secondary" className="w-full justify-start">
                  <Store className="mr-2 h-4 w-4" />
                  Ration Shops
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
          
        </div>

        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Ration Shops Management</h1>
              <p className="text-gray-500">Manage and monitor ration shops and distribution centers</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button>
                <Store className="mr-2 h-4 w-4" />
                Add New Shop
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-auto md:flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search by ID, name, location, or manager..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "low" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("low")}
              >
                Low Stock
              </Button>
              <Button
                variant={statusFilter === "inactive" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("inactive")}
              >
                Inactive
              </Button>
            </div>
          </div>

          <Tabs defaultValue="list" className="mb-6">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {filteredShops.map((shop) => (
                <Card key={shop.id} className="mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{shop.name}</CardTitle>
                        <CardDescription>
                          {shop.location} • ID: {shop.id}
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          shop.status === "Active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : shop.status === "Low Stock"
                              ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {shop.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Shop Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Manager:</span>
                            <span className="text-sm">{shop.manager}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Contact:</span>
                            <span className="text-sm">{shop.contact}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Beneficiaries:</span>
                            <span className="text-sm">{shop.beneficiaries}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Last Delivery:</span>
                            <span className="text-sm">{shop.lastDelivery}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Next Delivery:</span>
                            <span className="text-sm">{shop.nextDelivery}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Inventory Status</h3>
                        <div className="space-y-4">
                          {shop.inventory.map((item) => (
                            <div key={item.product} className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-sm">{item.product}</span>
                                <span className="text-sm">
                                  {item.quantity} / {item.allocated}
                                </span>
                              </div>
                              <Progress value={item.percentage} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm" className="mr-2">
                        Update Inventory
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredShops.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Store className="h-16 w-16 text-gray-300 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No ration shops found</h2>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="map" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ration Shops Map</CardTitle>
                  <CardDescription>Geographic distribution of ration shops</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Map visualization would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ration Distribution Analytics</CardTitle>
                  <CardDescription>Performance metrics and distribution statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Analytics dashboard would be displayed here</p>
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
