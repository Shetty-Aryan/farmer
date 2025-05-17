"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Calendar, FileText, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Sample tenders data
const tenders = [
  {
    id: "TEN-001",
    title: "Wheat Procurement - Delhi Region",
    description: "Procurement of high-quality wheat for Delhi region ration shops",
    product: "Wheat",
    quantity: "500 tons",
    budget: "₹1.5 Cr",
    deadline: "2023-06-15",
    status: "Open",
    region: "Delhi",
    minPrice: 30000,
    maxPrice: 35000,
    requirements: "Moisture content below 12%, Clean and free from foreign material, Must conform to FSSAI standards",
  },
  {
    id: "TEN-002",
    title: "Rice Procurement - Punjab",
    description: "Procurement of basmati and non-basmati rice varieties for distribution",
    product: "Rice",
    quantity: "1000 tons",
    budget: "₹3.2 Cr",
    deadline: "2023-06-20",
    status: "Open",
    region: "Punjab",
    minPrice: 32000,
    maxPrice: 38000,
    requirements: "Grade A quality, Maximum broken rice percentage 5%, Aged for minimum 6 months",
  },
  {
    id: "TEN-003",
    title: "Vegetable Supply - Maharashtra",
    description: "Fresh vegetable supply for Mumbai and Pune ration shops",
    product: "Vegetables (Mixed)",
    quantity: "200 tons",
    budget: "₹0.8 Cr",
    deadline: "2023-06-10",
    status: "Closing Soon",
    region: "Maharashtra",
    minPrice: 35000,
    maxPrice: 45000,
    requirements: "Freshly harvested within 48 hours, Organically grown preferred, Properly sorted and graded",
  },
  {
    id: "TEN-004",
    title: "Pulses Procurement - National",
    description: "Procurement of various pulses for nationwide distribution",
    product: "Pulses (Mixed)",
    quantity: "300 tons",
    budget: "₹1.8 Cr",
    deadline: "2023-06-25",
    status: "Open",
    region: "National",
    minPrice: 60000,
    maxPrice: 65000,
    requirements: "High protein content, Clean and properly dried, Free from infestation",
  },
]

// Sample of farmer's bids
const myBids = [
  {
    id: "BID-001",
    tenderId: "TEN-001",
    tenderTitle: "Wheat Procurement - Delhi Region",
    quantity: "100 tons",
    price: "₹32,000/ton",
    totalValue: "₹32,00,000",
    status: "Under Review",
    submittedDate: "2023-05-10",
    product: "Wheat",
  },
  {
    id: "BID-002",
    tenderId: "TEN-003",
    tenderTitle: "Vegetable Supply - Maharashtra",
    quantity: "50 tons",
    price: "₹40,000/ton",
    totalValue: "₹20,00,000",
    status: "Accepted",
    submittedDate: "2023-05-08",
    product: "Vegetables (Mixed)",
  },
]

export default function FarmerTendersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTender, setSelectedTender] = useState<null | any>(null)
  const [bidDetails, setBidDetails] = useState({
    quantity: "",
    price: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  // Filter tenders based on search and status
  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      tender.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.product.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || tender.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Handle selecting a tender for bidding
  const handleSelectTender = (tender) => {
    setSelectedTender(tender)
    setBidDetails({
      quantity: "",
      price: tender.minPrice.toString(),
      notes: "",
    })
    setShowDialog(true)
  }

  // Handle bid form input changes
  const handleBidInputChange = (e) => {
    const { name, value } = e.target
    setBidDetails((prev) => ({ ...prev, [name]: value }))
  }

  // Handle bid submission
  const handleBidSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowDialog(false)

      toast({
        title: "Bid submitted successfully",
        description: `Your bid for ${selectedTender.title} has been submitted and is under review.`,
      })

      // In a real app, we would refresh the data
    }, 1500)
  }

  return (
    <div className="container max-w-6xl py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Government Procurement Tenders</h1>
          <p className="text-gray-500">Apply for government procurement opportunities</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-auto md:flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search tenders by ID, title, or product..."
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
            variant={statusFilter === "open" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("open")}
          >
            Open
          </Button>
          <Button
            variant={statusFilter === "closing soon" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("closing soon")}
          >
            Closing Soon
          </Button>
        </div>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList>
          <TabsTrigger value="available">Available Tenders</TabsTrigger>
          <TabsTrigger value="mybids">My Bids</TabsTrigger>
        </TabsList>

        {/* Available Tenders Tab */}
        <TabsContent value="available" className="space-y-4">
          {filteredTenders.map((tender) => (
            <Card key={tender.id} className="mb-4">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                  <div>
                    <CardTitle>{tender.title}</CardTitle>
                    <CardDescription>
                      {tender.id} • {tender.product} • {tender.region}
                    </CardDescription>
                  </div>
                  <Badge
                    className={
                      tender.status === "Open"
                        ? "mt-2 md:mt-0 bg-green-100 text-green-800 hover:bg-green-100"
                        : tender.status === "Closing Soon"
                          ? "mt-2 md:mt-0 bg-orange-100 text-orange-800 hover:bg-orange-100"
                          : "mt-2 md:mt-0 bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {tender.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tender Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Description:</span>
                        <span className="text-sm text-right">{tender.description}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Quantity Required:</span>
                        <span className="text-sm">{tender.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Budget:</span>
                        <span className="text-sm">{tender.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Deadline:</span>
                        <span className="text-sm">{tender.deadline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Price Range:</span>
                        <span className="text-sm">
                          ₹{tender.minPrice.toLocaleString()} - ₹{tender.maxPrice.toLocaleString()}/ton
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Requirements</h3>
                    <div className="space-y-2">
                      <p className="text-sm">{tender.requirements}</p>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">
                            {new Date(tender.deadline) < new Date()
                              ? "Deadline passed"
                              : `${Math.ceil((new Date(tender.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => handleSelectTender(tender)} disabled={new Date(tender.deadline) < new Date()}>
                  Apply for Tender
                </Button>
              </CardFooter>
            </Card>
          ))}

          {filteredTenders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
              <h2 className="text-xl font-medium mb-2">No tenders found</h2>
              <p className="text-gray-500 mb-6">Try adjusting your search criteria</p>
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

        {/* My Bids Tab */}
        <TabsContent value="mybids" className="space-y-4">
          {myBids.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mb-4" />
              <h2 className="text-xl font-medium mb-2">No bids yet</h2>
              <p className="text-gray-500 mb-6">You haven't applied for any tenders yet</p>
              <Button onClick={() => document.querySelector('button[value="available"]')?.click()}>
                Browse Tenders
              </Button>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>My Tender Applications</CardTitle>
                <CardDescription>Track the status of your tender applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Bid ID</th>
                        <th className="text-left py-3 px-2">Tender</th>
                        <th className="text-left py-3 px-2">Product</th>
                        <th className="text-left py-3 px-2">Quantity</th>
                        <th className="text-left py-3 px-2">Price</th>
                        <th className="text-left py-3 px-2">Total Value</th>
                        <th className="text-left py-3 px-2">Submitted</th>
                        <th className="text-left py-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myBids.map((bid) => (
                        <tr key={bid.id} className="border-b">
                          <td className="py-3 px-2">{bid.id}</td>
                          <td className="py-3 px-2">
                            <div className="font-medium">{bid.tenderTitle}</div>
                            <div className="text-xs text-gray-500">{bid.tenderId}</div>
                          </td>
                          <td className="py-3 px-2">{bid.product}</td>
                          <td className="py-3 px-2">{bid.quantity}</td>
                          <td className="py-3 px-2">{bid.price}</td>
                          <td className="py-3 px-2">{bid.totalValue}</td>
                          <td className="py-3 px-2">{bid.submittedDate}</td>
                          <td className="py-3 px-2">
                            <Badge
                              className={
                                bid.status === "Accepted"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : bid.status === "Rejected"
                                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                                    : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              }
                            >
                              {bid.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Bid Application Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply for Tender</DialogTitle>
            <DialogDescription>
              {selectedTender?.title} ({selectedTender?.id})
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBidSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity (tons)
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  max={selectedTender?.quantity?.replace(/\D/g, "")}
                  value={bidDetails.quantity}
                  onChange={handleBidInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price per ton (₹)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min={selectedTender?.minPrice}
                  max={selectedTender?.maxPrice}
                  value={bidDetails.price}
                  onChange={handleBidInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Additional details about your bid"
                  value={bidDetails.notes}
                  onChange={handleBidInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>

              {bidDetails.quantity && bidDetails.price && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-medium">Total Value:</span>
                  </div>
                  <div className="col-span-3">
                    <span className="text-lg font-bold">
                      ₹{(Number.parseInt(bidDetails.quantity) * Number.parseInt(bidDetails.price)).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {selectedTender && (
                <div className="bg-amber-50 p-4 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Important Note</h4>
                      <p className="text-sm text-amber-700">
                        By submitting this bid, you are committing to deliver the specified quantity at the price
                        mentioned above if your bid is accepted.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Bid"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
