"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Check, Truck } from "lucide-react"
import { useStore } from "@/lib/store"

// Sample delivery date options
const deliveryDates = [
  { id: "tomorrow", date: "Tomorrow", time: "10:00 AM - 2:00 PM" },
  { id: "day-after", date: "Day After Tomorrow", time: "10:00 AM - 2:00 PM" },
  { id: "custom", date: "Choose a Date", time: "10:00 AM - 2:00 PM" },
]

// Sample states
const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
]

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { cart, clearCart } = useStore()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  
  // Form states
  const [deliveryMethod, setDeliveryMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryDates[0].id)
  
  // Address state
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: ""
  })

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryFee = deliveryMethod === "standard" ? 50 : 100
  const total = subtotal + deliveryFee

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setAddressForm(prev => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // In a real application, we'd submit the order to an API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Order placed successfully!",
        description: "Your order has been received and will be processed shortly."
      })
      
      // Clear cart and redirect
      clearCart()
      router.push("/consumer/orders")
      
    } catch (error) {
      toast({
        title: "Error placing order",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Navigate to address step
  const goToAddressStep = () => {
    if (cart.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Add some products to your cart before proceeding to checkout.",
        variant: "destructive"
      })
      return
    }
    setStep(2)
  }

  // Navigate to payment step after validating address
  const goToPaymentStep = (e) => {
    e.preventDefault()
    
    // Simple validation
    const requiredFields = ['fullName', 'phoneNumber', 'addressLine1', 'city', 'state', 'pincode']
    const missingFields = requiredFields.filter(field => !addressForm[field])
    
    if (missingFields.length > 0) {
      toast({
        title: "Please fill all required fields",
        description: "Some address details are missing.",
        variant: "destructive"
      })
      return
    }
    
    if (addressForm.phoneNumber.length !== 10 || isNaN(Number(addressForm.phoneNumber))) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive"
      })
      return
    }
    
    if (addressForm.pincode.length !== 6 || isNaN(Number(addressForm.pincode))) {
      toast({
        title: "Invalid pin code",
        description: "Please enter a valid 6-digit pin code.",
        variant: "destructive"
      })
      return
    }
    
    setStep(3)
  }

  if (cart.length === 0 && step === 1) {
    return (
      <div className="container max-w-3xl py-6 md:py-10">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-gray-100 p-6">
            <Truck className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-center text-gray-500">
            It looks like you haven&apos;t added any products to your cart yet.
          </p>
          <Link href="/consumer/products">
            <Button className="mt-6">Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl py-6 md:py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => step > 1 ? setStep(step - 1) : router.back()} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          {step > 1 ? "Back" : "Return to Cart"}
        </Button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      {/* Checkout Steps Indicator */}
      <div className="mb-8">
        <div className="flex justify-center">
          <ol className="relative flex w-full max-w-3xl">
            {/* Step 1: Review Order */}
            <li className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:mx-6">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${step >= 1 ? "bg-green-600" : "bg-gray-200"}`}>
                {step > 1 ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className={`text-lg font-semibold ${step >= 1 ? "text-white" : "text-gray-500"}`}>1</span>
                )}
              </div>
            </li>
            {/* Step 2: Address */}
            <li className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:mx-6">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${step >= 2 ? "bg-green-600" : "bg-gray-200"}`}>
                {step > 2 ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className={`text-lg font-semibold ${step >= 2 ? "text-white" : "text-gray-500"}`}>2</span>
                )}
              </div>
            </li>
            {/* Step 3: Payment */}
            <li className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${step >= 3 ? "bg-green-600" : "bg-gray-200"}`}>
                <span className={`text-lg font-semibold ${step >= 3 ? "text-white" : "text-gray-500"}`}>3</span>
              </div>
            </li>
          </ol>
        </div>
        <div className="flex justify-center mt-2">
          <div className="flex w-full max-w-3xl">
            <div className="w-full text-center">Review</div>
            <div className="w-full text-center">Address</div>
            <div className="w-full text-center">Payment</div>
          </div>
        </div>
      </div>

      {/* Step 1: Review Order */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-2 border-b">
                      <div className="h-16 w-16 rounded-md overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg?height=64&width=64"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">Farmer: {item.farmer}</p>
                        <p className="text-sm text-gray-500">
                          ₹{item.price}/{item.unit}
                        </p>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="font-medium">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="font-medium mb-4">Choose Delivery Method</h3>
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-3">
                    <div className="flex items-center justify-between space-x-2 border rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="font-medium">Standard Delivery</Label>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹50</p>
                        <p className="text-sm text-gray-500">2-3 days</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between space-x-2 border rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="font-medium">Express Delivery</Label>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹100</p>
                        <p className="text-sm text-gray-500">Next day</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={goToAddressStep}>
                  Continue to Delivery Address
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}\
