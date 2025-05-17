"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Filter,
  Heart,
  Home,
  Leaf,
  LogOut,
  MapPin,
  MessageSquare,
  Search,
  Settings,
  ShoppingCart,
  Star,
  User,
} from "lucide-react"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

// Sample data
const nearbyProducts = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    farmer: "Rajesh Kumar",
    location: "Punjab",
    distance: "5 km",
    price: "₹40/kg",
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Organic Potatoes",
    farmer: "Suresh Singh",
    location: "Haryana",
    distance: "8 km",
    price: "₹30/kg",
    rating: 4.2,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Fresh Onions",
    farmer: "Mahesh Patel",
    location: "Gujarat",
    distance: "12 km",
    price: "₹35/kg",
    rating: 4.0,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "Organic Rice",
    farmer: "Ramesh Yadav",
    location: "Uttar Pradesh",
    distance: "15 km",
    price: "₹60/kg",
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=200",
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    items: "Tomatoes, Potatoes",
    farmer: "Rajesh Kumar",
    date: "2023-05-15",
    status: "Delivered",
    amount: "₹250",
  },
  {
    id: "ORD-002",
    items: "Rice, Wheat",
    farmer: "Suresh Singh",
    date: "2023-05-10",
    status: "In Transit",
    amount: "₹500",
  },
  {
    id: "ORD-003",
    items: "Onions, Garlic",
    farmer: "Mahesh Patel",
    date: "2023-05-05",
    status: "Processing",
    amount: "₹150",
  },
]



export default function ConsumerDashboard() {
  const [activeTab, setActiveTab] = useState("discover")
  const router = useRouter()

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push("/auth/login") // Redirect user after logout
  } catch (error) {
    console.error("Error signing out:", error)
    // Optional: Toast or alert
  }
}
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

const user = useCurrentUser();

const userId = user?.uid;

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
              {/* <Link href="/consumer/discover">
                <Button variant="ghost" className="w-full justify-start">
                  <Search className="mr-2 h-4 w-4" />
                  Discover Products
                </Button>
              </Link> */}
              <Link href="/consumer/cart">
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  My Cart
                </Button>
              </Link>

              <Link href="/consumer/favorites">
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites
                </Button>
              </Link>
            </div>
          </div>
          <div className="px-4 py-2">
            <h2 className="mb-2 text-xs font-semibold tracking-tight">Communication</h2>
            <div className="space-y-1">
              <Link href="/consumer/messages">
                <Button variant="ghost" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                  <span className="ml-auto bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    3
                  </span>
                </Button>
              </Link>
              <Link href="/consumer/notifications">
                <Button variant="ghost" className="w-full justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                  <span className="ml-auto bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    5
                  </span>
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
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search for products, farmers..."
              className="w-full bg-gray-100 pl-8 focus-visible:ring-green-500"
            />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              Delhi
            </Button>
            <Button variant="outline" size="sm">
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Welcome, Priya</h1>
              <p className="text-gray-500">Discover fresh produce directly from farmers near you</p>
            </div>
          </div>

          <Tabs defaultValue="discover" className="mb-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="orders">My Orders</TabsTrigger>
              <TabsTrigger value="farmers">Favorite Farmers</TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h2 className="text-xl font-semibold">Products Near You</h2>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {nearbyProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white rounded-full h-8 w-8 shadow-sm hover:bg-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          {product.distance}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                        <span>by {product.farmer}</span>
                        <span>•</span>
                        <span>{product.location}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-lg">{product.price}</span>
                        <Button size="sm">Add to Cart</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <Button variant="outline">Load More</Button>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Track and manage your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">Order ID</th>
                          <th className="text-left py-3 px-2">Items</th>
                          <th className="text-left py-3 px-2">Farmer</th>
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
                            <td className="py-3 px-2">{order.items}</td>
                            <td className="py-3 px-2">{order.farmer}</td>
                            <td className="py-3 px-2">{order.date}</td>
                            <td className="py-3 px-2">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  order.status === "Delivered"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "In Transit"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-orange-100 text-orange-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
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
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Orders
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="farmers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Favorite Farmers</CardTitle>
                  <CardDescription>Farmers you frequently purchase from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Rajesh Kumar</h3>
                          <p className="text-sm text-gray-500">Punjab</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">4.5</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Suresh Singh</h3>
                          <p className="text-sm text-gray-500">Haryana</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">4.2</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Mahesh Patel</h3>
                          <p className="text-sm text-gray-500">Gujarat</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">4.0</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Farmers
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
