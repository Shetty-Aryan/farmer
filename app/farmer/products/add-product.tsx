"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

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
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form data
      if (!formData.name || !formData.price || !formData.quantity) {
        throw new Error("Please fill in all required fields")
      }

      // Simulate API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a random ID for the new product
      const newProductId = Math.floor(Math.random() * 1000) + 10

      // In a real application, we'd make an API call to save the product
      console.log("Product data submitted:", { ...formData, id: newProductId, image: imagePreview })

      toast({
        title: "Product added successfully",
        description: `${formData.name} has been added to your product list.`,
      })

      // Redirect back to products page
      router.push("/farmer/products")
    } catch (error) {
      toast({
        title: "Error adding product",
        description:
          error instanceof Error ? error.message : "There was an error adding your product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-4xl py-6 md:py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/farmer/products">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-4">
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-[1fr_2fr] gap-6">
              {/* Product Image */}
              <div className="space-y-2">
                <Label htmlFor="image" className="font-medium">
                  Product Image
                </Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-3 w-full">
                      <div className="relative w-full h-48">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Product preview"
                          className="w-full h-full object-contain rounded-md"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setImagePreview(null)}
                        size="sm"
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center justify-center py-4">
                        <Upload className="w-10 h-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        size="sm"
                        onClick={() => document.getElementById("image")?.click()}
                      >
                        Select Image
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Product Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="font-medium">
                    Category <span className="text-red-500">*</span>
                  </Label>
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
                    <Label htmlFor="price" className="font-medium">
                      Price (₹) <span className="text-red-500">*</span>
                    </Label>
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
                    <Label htmlFor="unit" className="font-medium">
                      Unit
                    </Label>
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
              </div>
            </div>

            <Separator />

            {/* Product Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your product - include details about quality, growing methods, and special features"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="font-medium">
                  Available Quantity <span className="text-red-500">*</span>
                </Label>
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

              {/* Harvest Date */}
              <div className="space-y-2">
                <Label htmlFor="harvestDate" className="font-medium">
                  Harvest Date
                </Label>
                <Input
                  id="harvestDate"
                  name="harvestDate"
                  type="date"
                  value={formData.harvestDate}
                  onChange={handleInputChange}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="font-medium">
                  Farm Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter farm location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 border-t">
            <Button variant="outline" type="button" asChild>
              <Link href="/farmer/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting} className="px-8">
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
