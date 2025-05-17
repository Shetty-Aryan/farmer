"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store"
import {
  Bell,
  ChevronLeft,
  Heart,
  Home,
  Leaf,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  ShoppingCart,
  Trash,
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function FavoritesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { favorites, removeFromFavorites, addToCart } = useStore()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter favorites based on search
  const filteredFavorites = favorites.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleRemoveFromFavorites = (id: number, name: string) => {
    removeFromFavorites(id)
    toast({
      title: "Removed from favorites",
      description: `${name} has been removed from your favorites.`,
    })
  }

  const handleAddToCart = (item: { id: any; name: any; farmer: any; location?: string; price: any; unit: any; image: any }) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      unit: item.unit,
      farmer: item.farmer,
      image: item.image,
    })

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
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
                  <Search className="mr-2 h-4 w-4" />
                  Discover Products
                </Button>
              </Link>
              <Link href="/consumer/orders">
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  My Orders
                </Button>
              </Link>
              <Link href="/consumer/favorites">
                <Button variant="secondary" className="w-full justify-start">
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
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Priya Sharma</p>
              <p className="text-xs text-gray-500">Delhi, India</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/consumer/settings">
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Link href="/auth/logout">
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="flex h-14 items-center border-b px-4 md:h-16">
          <Button variant="outline" size="sm" className="mr-4 md:hidden">
            <Leaf className="h-5 w-5 text-green-600" />
          </Button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search favorites..."
              className="w-full bg-gray-100 pl-8 focus-visible:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/consumer/cart">
              <Button variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Your Favorites</h1>
          </div>

          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Heart className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-gray-500 mb-6">You haven't added any products to your favorites yet.</p>
              <Link href="/consumer/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredFavorites.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="flex flex-col items-center p-4">
                    <div className="relative w-full">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-40 object-cover mb-4"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white rounded-full h-8 w-8 shadow-sm hover:bg-white text-red-500"
                        onClick={() => handleRemoveFromFavorites(item.id, item.name)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <h2 className="text-lg font-bold mb-2">{item.name}</h2>
                    <p className="text-sm text-gray-500 mb-2">Farmer: {item.farmer}</p>
                    <p className="text-sm text-gray-500 mb-2">Location: {item.location}</p>
                    <Badge variant="outline" className="mb-4">
                      ₹{item.price}/{item.unit}
                    </Badge>
                    <Button variant="default" className="w-full" onClick={() => handleAddToCart(item)}>
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {favorites.length > 0 && filteredFavorites.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Search className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No matching favorites</h2>
              <p className="text-gray-500 mb-6">Try adjusting your search criteria.</p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
