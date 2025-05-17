"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AddProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    unit: "kg",
    quantity: "",
    location: "",
    harvestDate: "",
    category: "Vegetables",
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a random ID for the new product
      const newProductId = Math.floor(Math.random() * 1000) + 10

      // In a real application, we'd make an API call to save the product
      // For now, we'll just show a success message and redirect

      toast({
        title: "Product added successfully",
        description: `${formData.name} has been added to your product list.`,
      })

      // Redirect back to products page
      router.push("/farmer/products")
    } catch (error) {
      toast({
        title: "Error adding product",
        description: "There was an error adding your product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-3xl py-6 md:py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 bg-gray-50">
                {imagePreview ? (
                  <div className="space-y-2 w-full">
                    <div className="relative w-full h-48">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Product preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <Button type="button" variant="outline" className="w-full" onClick={() => setImagePreview(null)}>
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center py-4">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById("image")?.click()}
                    >
                      Select Image
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Product Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your product"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>

            {/* Product Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vegetables">Vegetables</SelectItem>
                  <SelectItem value="Fruits">Fruits</SelectItem>
                  <SelectItem value="Grains">Grains</SelectItem>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Spices">Spices</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select value={formData.unit} onValueChange={(value) => handleSelectChange("unit", value)}>
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="g">Gram (g)</SelectItem>
                    <SelectItem value="l">Liter (l)</SelectItem>
                    <SelectItem value="piece">Piece</SelectItem>
                    <SelectItem value="dozen">Dozen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quantity and Harvest Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Available Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="harvestDate">Harvest Date</Label>
                <Input
                  id="harvestDate"
                  name="harvestDate"
                  type="date"
                  value={formData.harvestDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Farm Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Enter farm location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/farmer/products">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Product...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
