"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import { useStore, type CartItem, type FavoriteItem } from "@/lib/store"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth"

// Sample data
const products = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    farmer: "Rajesh Kumar",
    location: "Punjab",
    distance: 5,
    price: 40,
    unit: "kg",
    rating: 4.5,
    category: "Vegetables",
    freshness: "1 day ago",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Organic Potatoes",
    farmer: "Suresh Singh",
    location: "Haryana",
    distance: 8,
    price: 30,
    unit: "kg",
    rating: 4.2,
    category: "Vegetables",
    freshness: "2 days ago",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Fresh Onions",
    farmer: "Mahesh Patel",
    location: "Gujarat",
    distance: 12,
    price: 35,
    unit: "kg",
    rating: 4.0,
    category: "Vegetables",
    freshness: "1 day ago",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "Organic Rice",
    farmer: "Ramesh Yadav",
    location: "Uttar Pradesh",
    distance: 15,
    price: 60,
    unit: "kg",
    rating: 4.8,
    category: "Grains",
    freshness: "10 days ago",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 5,
    name: "Fresh Apples",
    farmer: "Amit Kumar",
    location: "Himachal Pradesh",
    distance: 20,
    price: 80,
    unit: "kg",
    rating: 4.6,
    category: "Fruits",
    freshness: "3 days ago",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 6,
    name: "Organic Wheat",
    farmer: "Vijay Singh",
    location: "Punjab",
    distance: 7,
    price: 45,
    unit: "kg",
    rating: 4.3,
    category: "Grains",
    freshness: "15 days ago",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 7,
    name: "Fresh Mangoes",
    farmer: "Ravi Patel",
    location: "Maharashtra",
    distance: 25,
    price: 120,
    unit: "kg",
    rating: 4.9,
    category: "Fruits",
    freshness: "1 day ago",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 8,
    name: "Organic Milk",
    farmer: "Sanjay Yadav",
    location: "Haryana",
    distance: 10,
    price: 50,
    unit: "liter",
    rating: 4.7,
    category: "Dairy",
    freshness: "Today",
    image: "/placeholder.svg?height=200&width=200",
  },
]

const categories = ["Vegetables", "Fruits", "Grains", "Dairy", "Spices"]
const locations = ["Delhi", "Punjab", "Haryana", "Uttar Pradesh", "Gujarat", "Maharashtra", "Himachal Pradesh"]

export default function ConsumerProducts() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [locationQuery, setLocationQuery] = useState("")
  const [showLocationSearch, setShowLocationSearch] = useState(false)
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
  const [filters, setFilters] = useState({
    categories: [],
    maxDistance: 50,
    priceRange: [0, 200],
    minRating: 0,
  })
  const [sortBy, setSortBy] = useState("distance")

  // Get store functions
  const { cart, addToCart, favorites, addToFavorites, removeFromFavorites, isFavorite } = useStore()

  // Calculate cart count
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location.toLowerCase().includes(searchQuery.toLowerCase())

      // Location filter
      const matchesLocation = !locationQuery || product.location.toLowerCase().includes(locationQuery.toLowerCase())

      // Category filter
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category)

      // Distance filter
      const matchesDistance = product.distance <= filters.maxDistance

      // Price filter
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]

      // Rating filter
      const matchesRating = product.rating >= filters.minRating

      return matchesSearch && matchesLocation && matchesCategory && matchesDistance && matchesPrice && matchesRating
    })
    .sort((a, b) => {
      if (sortBy === "distance") return a.distance - b.distance
      if (sortBy === "price_low") return a.price - b.price
      if (sortBy === "price_high") return b.price - a.price
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "freshness") {
        // Simple sorting for freshness (in a real app, you'd use actual dates)
        const freshnessOrder = { Today: 0, "1 day ago": 1, "2 days ago": 2, "3 days ago": 3 }
        return (freshnessOrder[a.freshness] || 999) - (freshnessOrder[b.freshness] || 999)
      }
      return 0
    })

  const toggleCategory = (category) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]

      return { ...prev, categories }
    })
  }

  const handleAddToCart = (product) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      unit: product.unit,
      farmer: product.farmer,
      image: product.image,
    }

    addToCart(cartItem)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleToggleFavorite = (product) => {
    const favoriteItem: FavoriteItem = {
      id: product.id,
      name: product.name,
      farmer: product.farmer,
      location: product.location,
      price: product.price,
      unit: product.unit,
      image: product.image,
    }

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
      toast({
        title: "Removed from favorites",
        description: `${product.name} has been removed from your favorites.`,
      })
    } else {
      addToFavorites(favoriteItem)
      toast({
        title: "Added to favorites",
        description: `${product.name} has been added to your favorites.`,
      })
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col bg-gray-50 border-r lg:flex">
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
                <Button variant="secondary" className="w-full justify-start">
                  <Search className="mr-2 h-4 w-4" />
                  Discover Products
                </Button>
              </Link>
              <Link href="/consumer/orders">
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  My Orders
                  <span className="ml-auto bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    2
                  </span>
                </Button>
              </Link>
              <Link href="/consumer/favorites">
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites
                  {favorites.length > 0 && (
                    <span className="ml-auto bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {favorites.length}
                    </span>
                  )}
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
          <Button variant="outline" size="sm" className="mr-4 lg:hidden">
            <Leaf className="h-5 w-5 text-green-600" />
          </Button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search products, farmers..."
              className="w-full bg-gray-100 pl-8 focus-visible:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setShowLocationSearch(!showLocationSearch)}>
              <MapPin className="h-4 w-4 mr-2" />
              {locationQuery || "All Locations"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/consumer/cart")}>
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Location search dropdown */}
        {showLocationSearch && (
          <div className="p-4 border-b">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="location-search">Search by location</Label>
              <div className="flex gap-2">
                <Input
                  id="location-search"
                  placeholder="Enter city or state..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" onClick={() => setLocationQuery("")}>
                  Clear
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {locations.map((location) => (
                  <Badge
                    key={location}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setLocationQuery(location)}
                  >
                    {location}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Discover Products</h1>
              <p className="text-gray-500">Find fresh produce directly from farmers near you</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Nearest First</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="freshness">Freshness</SelectItem>
                </SelectContent>
              </Select>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your product search</SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Categories</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center">
                            <Checkbox
                              id={`category-${category}`}
                              checked={filters.categories.includes(category)}
                              onCheckedChange={() => toggleCategory(category)}
                            />
                            <Label htmlFor={`category-${category}`} className="ml-2 text-sm font-normal">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Maximum Distance</h3>
                        <span className="text-sm">{filters.maxDistance} km</span>
                      </div>
                      <Slider
                        value={[filters.maxDistance]}
                        min={1}
                        max={50}
                        step={1}
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, maxDistance: value[0] }))}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Price Range</h3>
                        <span className="text-sm">
                          ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                        </span>
                      </div>
                      <Slider
                        value={filters.priceRange}
                        min={0}
                        max={200}
                        step={5}
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value }))}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Minimum Rating</h3>
                        <span className="text-sm">{filters.minRating} ★</span>
                      </div>
                      <Slider
                        value={[filters.minRating]}
                        min={0}
                        max={5}
                        step={0.5}
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, minRating: value[0] }))}
                      />
                    </div>

                    <Button
                      className="w-full"
                      onClick={() =>
                        setFilters({
                          categories: [],
                          maxDistance: 50,
                          priceRange: [0, 200],
                          minRating: 0,
                        })
                      }
                    >
                      Reset Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="flex flex-col items-center p-4">
                  <div className="relative w-full">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-40 object-cover mb-4"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute top-2 right-2 bg-white rounded-full h-8 w-8 shadow-sm hover:bg-white ${
                        isFavorite(product.id) ? "text-red-500" : ""
                      }`}
                      onClick={() => handleToggleFavorite(product)}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite(product.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                  <h2 className="text-lg font-bold mb-2">{product.name}</h2>
                  <p className="text-sm text-gray-500 mb-2">Farmer: {product.farmer}</p>
                  <p className="text-sm text-gray-500 mb-2">Location: {product.location}</p>
                  <div className="flex items-center mb-2">
                    <Badge variant="outline" className="mr-2">
                      {product.distance} km
                    </Badge>
                    <Badge variant="outline" className="mr-2">
                      ₹{product.price}/{product.unit}
                    </Badge>
                    <Badge variant="outline">{product.rating} ★</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Freshness: {product.freshness}</p>
                  <Button variant="default" className="w-full" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64">
              <Search className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
