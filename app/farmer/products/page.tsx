"use client"
import { useRouter } from "next/navigation"
import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Filter, Home, Leaf, LogOut, Package, Plus, Search, Settings, ShoppingCart, Trash } from "lucide-react"
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
import { auth, db } from "@/lib/firebase"
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore"

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
    farmerName: "Sample Farmer",
    farmerEmail: "farmer@example.com",
    image: "/tomato.png?height=200&width=200",
  },
]

export default function FarmerProducts() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const router = useRouter()
  // Replace the static products array with a state variable
  const [productsList, setProductsList] = useState(products)
  // State for new product form
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    unit: "kg",
    quantity: "",
    harvestDate: "",
    location: "",
    farmerName: "",
    farmerEmail: "",
    image: "/placeholder.svg?height=200&width=200",
  })

  const [isEditMode, setIsEditMode] = useState(false)
  const [editProductId, setEditProductId] = useState(null)

  

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
  const [activeTab, setActiveTab] = useState("overview")
  const user = useCurrentUser()

  const userId = user?.uid

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) return
      const userRef = doc(db, "users", userId)
      const userDoc = await getDoc(userRef)
      if (userDoc.exists()) {
        const data = userDoc.data()
        if (data.products) {
          setProductsList(data.products)
        }
      }
    }
    fetchProducts()
  }, [userId])
  

  // Handle input changes in the new product form
  const handleInputChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target
    setNewProduct({
      ...newProduct,
      [id]: value,
    })
  }

  // Handle select changes
  const handleSelectChange = (value: string, field: string) => {
    setNewProduct({
      ...newProduct,
      [field]: value,
    })
  }

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setNewProduct({
          ...newProduct,
          image: (event.target?.result as string) || "",
        })
      }
      reader.readAsDataURL(file)
    }
  }
  // Handle form submission
  const handleAddProduct = async () => {
    if (!userId) return
  
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)
  
    let updatedProducts: any[] = []
  
    if (isEditMode && editProductId !== null) {
      updatedProducts = productsList.map((product) => {
        if (product.id === editProductId) {
          return {
            ...product,
            name: newProduct.name,
            description: newProduct.description,
            price: Number.parseFloat(newProduct.price) || 0,
            unit: newProduct.unit,
            quantity: Number.parseInt(newProduct.quantity) || 0,
            harvestDate: newProduct.harvestDate,
            location: newProduct.location,
            farmerEmail: user?.email || "No Email",
            status: Number.parseInt(newProduct.quantity) > 50 ? "Available" : "Low Stock",
            image: newProduct.image || product.image,
          }
        }
        return product
      })
  
      await updateDoc(userRef, { products: updatedProducts })
      setProductsList(updatedProducts)
      setIsEditMode(false)
      setEditProductId(null)
    } else {
      const newProductData = {
        id: productsList.length + 1,
        name: newProduct.name,
        description: newProduct.description,
        price: Number.parseFloat(newProduct.price) || 0,
        unit: newProduct.unit,
        quantity: Number.parseInt(newProduct.quantity) || 0,
        harvestDate: newProduct.harvestDate,
        location: newProduct.location,
        farmerName: user?.name || "Unknown Farmer",
        farmerEmail: user?.email || "No Email",
        status: Number.parseInt(newProduct.quantity) > 50 ? "Available" : "Low Stock",
        image: newProduct.image,
      }
  
      updatedProducts = [...productsList, newProductData]
      if (userDoc.exists()) {
        await updateDoc(userRef, { products: updatedProducts })
      } else {
        await setDoc(userRef, { products: updatedProducts })
      }
  
      setProductsList(updatedProducts)
    }
  
    setNewProduct({
      name: "",
      description: "",
      price: "",
      unit: "kg",
      quantity: "",
      harvestDate: "",
      location: "",
      farmerName: "",
      farmerEmail: "",
      image: "/placeholder.svg?height=200&width=200",
    })
  
    setIsAddProductOpen(false)
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!userId) return; // safety check
  
    try {
      const userRef = doc(db, "users", userId);
  
      // Filter out the product to delete
      const updatedProducts = productsList.filter(p => p.id !== productId);
  
      // Update Firestore
      await updateDoc(userRef, { products: updatedProducts });
  
      // Update local state
      setProductsList(updatedProducts);

      window.location.reload()
  
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };
  

  // Handle edit product
  const handleEditProduct = (product: {
    id: any
    name: any
    description: any
    price: any
    unit: any
    quantity: any
    harvestDate: any
    location: any
    status?: string
    image: any
    farmerName?: string
    farmerEmail?: string
  }) => {
    setIsEditMode(true)
    setEditProductId(product.id)
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      unit: product.unit,
      quantity: product.quantity.toString(),
      harvestDate: product.harvestDate,
      location: product.location,
      farmerName: product.farmerName || "",
      farmerEmail: product.farmerEmail || "",
      image: product.image,
    })
    setIsAddProductOpen(true)
  }

  const handleDialogOpenChange = (open: boolean | ((prevState: boolean) => boolean)) => {
    setIsAddProductOpen(open)
    if (!open) {
      setIsEditMode(false)
      setEditProductId(null)
      setNewProduct({
        name: "",
        description: "",
        price: "",
        unit: "kg",
        quantity: "",
        harvestDate: "",
        location: "",
        farmerName: "",
        farmerEmail: "",
        image: "/placeholder.svg?height=200&width=200",
      })
    }
  }

  // Filter products based on search query and active tab
  const filteredProducts = productsList.filter((product) => {
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
              <h1 className="text-2xl font-bold">My Products</h1>
              <p className="text-gray-500">Manage your product listings</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Dialog open={isAddProductOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Product" : "Add New Product"}</DialogTitle>
                    <DialogDescription>Enter the details of your new product listing.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Product name"
                        className="col-span-3"
                        value={newProduct.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Product description"
                        className="col-span-3"
                        value={newProduct.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">
                        Price
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="Price per unit"
                        className="col-span-3"
                        value={newProduct.price}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="unit" className="text-right">
                        Unit
                      </Label>
                      <Select value={newProduct.unit} onValueChange={(value) => handleSelectChange(value, "unit")}>
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
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="Available quantity"
                        className="col-span-3"
                        value={newProduct.quantity}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="harvestDate" className="text-right">
                        Harvest Date
                      </Label>
                      <Input
                        id="harvestDate"
                        type="date"
                        className="col-span-3"
                        value={newProduct.harvestDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">
                        Location
                      </Label>
                      <Input
                        id="location"
                        placeholder="Farm location"
                        className="col-span-3"
                        value={newProduct.location}
                        onChange={handleInputChange}
                      />
                    </div>
                    {/* <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="farmerName" className="text-right">
                        Farmer Name
                      </Label>
                      <Input
                        id="farmerName"
                        placeholder="Your name or email"
                        className="col-span-3"
                        value={newProduct.farmerName}
                        onChange={handleInputChange}
                      />
                    </div> */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image" className="text-right">
                        Image
                      </Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="col-span-3"
                        onChange={handleFileChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="text-right"></div>
                      <div className="col-span-3">
                        {newProduct.image && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                            <img
                              src={newProduct.image || "/placeholder.svg"}
                              alt="Preview"
                              className="h-32 w-32 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={handleAddProduct}>
                      {isEditMode ? "Update Product" : "Add Product"}
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
                      src={product.image || "/placeholder.svg?height=200&width=200"}
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
                    {/* <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Farmer:</span>
                      <span className="font-medium">{product.farmerName || user?.displayName || "Unknown Farmer"}</span>
                    </div> */}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Contact:</span>
                      <span className="font-medium text-xs truncate">
                        {product.farmerEmail || user?.email || "No Email"}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-0">
                  <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
  variant="outline"
  size="sm"
  className="text-red-500 hover:text-red-700"
  onClick={() => handleDeleteProduct(product.id)} // pass product.id here
>
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
