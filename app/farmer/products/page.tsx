"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Calendar,
  Edit,
  Filter,
  Home,
  Inbox,
  Leaf,
  LogOut,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Trash,
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { auth } from "@/lib/firebase"
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth"

// Sample data
const products = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    description: "Organically grown tomatoes, freshly harvested",
    price: 40,
    unit: "kg",
    quantity: 100,
    harvestDate: "2023-05-10",
    location: "Punjab",
    status: "Available",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Organic Potatoes",
    description: "Premium quality potatoes, no pesticides used",
    price: 30,
    unit: "kg",
    quantity: 150,
    harvestDate: "2023-05-08",
    location: "Punjab",
    status: "Available",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Fresh Onions",
    description: "Red onions, perfect for salads and cooking",
    price: 35,
    unit: "kg",
    quantity: 80,
    harvestDate: "2023-05-12",
    location: "Punjab",
    status: "Low Stock",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "Organic Rice",
    description: "Basmati rice, grown without chemicals",
    price: 60,
    unit: "kg",
    quantity: 200,
    harvestDate: "2023-04-20",
    location: "Punjab",
    status: "Available",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function FarmerProducts() {
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
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
  

  // Filter products based on search query and active tab
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "available") return matchesSearch && product.status === "Available"
    if (activeTab === "low") return matchesSearch && product.status === "Low Stock"

    return matchesSearch
  })

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
                <Button variant="secondary" className="w-full justify-start">
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
            </div>
          </div>
          <div className="px-4 py-2">
            <h2 className="mb-2 text-xs font-semibold tracking-tight">Communication</h2>
            <div className="space-y-1">
              <Link href="/farmer/messages">
                <Button variant="ghost" className="w-full justify-start">
                  <Inbox className="mr-2 h-4 w-4" />
                  Messages
                  <span className="ml-auto bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    3
                  </span>
                </Button>
              </Link>
              <Link href="/farmer/calendar">
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar
                </Button>
              </Link>
              <Link href="/farmer/notifications">
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
              <h1 className="text-2xl font-bold">My Products</h1>
              <p className="text-gray-500">Manage your product listings</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>Enter the details of your new product listing.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" placeholder="Product name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea id="description" placeholder="Product description" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">
                        Price
                      </Label>
                      <Input id="price" type="number" placeholder="Price per unit" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="unit" className="text-right">
                        Unit
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilogram (kg)</SelectItem>
                          <SelectItem value="g">Gram (g)</SelectItem>
                          <SelectItem value="l">Liter (l)</SelectItem>
                          <SelectItem value="piece">Piece</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="quantity" className="text-right">
                        Quantity
                      </Label>
                      <Input id="quantity" type="number" placeholder="Available quantity" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="harvestDate" className="text-right">
                        Harvest Date
                      </Label>
                      <Input id="harvestDate" type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">
                        Location
                      </Label>
                      <Input id="location" placeholder="Farm location" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image" className="text-right">
                        Image
                      </Label>
                      <Input id="image" type="file" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={() => setIsAddProductOpen(false)}>
                      Add Product
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="available">Available</TabsTrigger>
                <TabsTrigger value="low">Low Stock</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search products..."
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge
                      className={`absolute top-2 right-2 ${
                        product.status === "Available"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-orange-500 hover:bg-orange-600"
                      }`}
                    >
                      {product.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Price:</span>
                      <span className="font-medium">
                        ₹{product.price}/{product.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Available:</span>
                      <span className="font-medium">
                        {product.quantity} {product.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Harvest Date:</span>
                      <span className="font-medium">{product.harvestDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Location:</span>
                      <span className="font-medium">{product.location}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-0">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
