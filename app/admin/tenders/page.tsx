"use client"

import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data
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
    currentAmount: 320,
    totalAmount: 500,
    percentage: 64,
    bids: [
      {
        id: "BID-001",
        farmer: "Punjab Farms Collective",
        quantity: "200 tons",
        price: "₹30,000/ton",
        status: "Accepted",
      },
      {
        id: "BID-002",
        farmer: "Haryana Wheat Growers",
        quantity: "120 tons",
        price: "₹31,500/ton",
        status: "Accepted",
      },
      {
        id: "BID-003",
        farmer: "UP Farmers Association",
        quantity: "150 tons",
        price: "₹32,000/ton",
        status: "Pending",
      },
      {
        id: "BID-004",
        farmer: "Rajasthan Organic Farms",
        quantity: "100 tons",
        price: "₹33,500/ton",
        status: "Pending",
      },
    ],
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
    currentAmount: 450,
    totalAmount: 1000,
    percentage: 45,
    bids: [
      {
        id: "BID-005",
        farmer: "Punjab Rice Producers",
        quantity: "300 tons",
        price: "₹32,000/ton",
        status: "Accepted",
      },
      {
        id: "BID-006",
        farmer: "Amritsar Farmers Collective",
        quantity: "150 tons",
        price: "₹32,500/ton",
        status: "Accepted",
      },
      { id: "BID-007", farmer: "Ludhiana Rice Growers", quantity: "200 tons", price: "₹33,000/ton", status: "Pending" },
      { id: "BID-008", farmer: "Patiala Organic Farms", quantity: "250 tons", price: "₹34,000/ton", status: "Pending" },
    ],
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
    currentAmount: 120,
    totalAmount: 200,
    percentage: 60,
    bids: [
      {
        id: "BID-009",
        farmer: "Nashik Vegetable Growers",
        quantity: "80 tons",
        price: "₹40,000/ton",
        status: "Accepted",
      },
      {
        id: "BID-010",
        farmer: "Pune Farmers Association",
        quantity: "40 tons",
        price: "₹41,000/ton",
        status: "Accepted",
      },
      { id: "BID-011", farmer: "Nagpur Fresh Produce", quantity: "50 tons", price: "₹42,000/ton", status: "Pending" },
      { id: "BID-012", farmer: "Kolhapur Organic Farms", quantity: "30 tons", price: "₹43,500/ton", status: "Pending" },
    ],
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
    currentAmount: 80,
    totalAmount: 300,
    percentage: 26.7,
    bids: [
      { id: "BID-013", farmer: "MP Pulse Growers", quantity: "50 tons", price: "₹60,000/ton", status: "Accepted" },
      {
        id: "BID-014",
        farmer: "Maharashtra Pulse Farms",
        quantity: "30 tons",
        price: "₹61,000/ton",
        status: "Accepted",
      },
      {
        id: "BID-015",
        farmer: "Rajasthan Pulse Collective",
        quantity: "100 tons",
        price: "₹62,000/ton",
        status: "Pending",
      },
      { id: "BID-016", farmer: "UP Pulse Association", quantity: "80 tons", price: "₹63,000/ton", status: "Pending" },
    ],
  },
  {
    id: "TEN-005",
    title: "Sugar Supply - Uttar Pradesh",
    description: "Sugar procurement for ration shops in Uttar Pradesh",
    product: "Sugar",
    quantity: "150 tons",
    budget: "₹0.6 Cr",
    deadline: "2023-06-18",
    status: "Open",
    region: "Uttar Pradesh",
    currentAmount: 30,
    totalAmount: 150,
    percentage: 20,
    bids: [
      {
        id: "BID-017",
        farmer: "UP Sugar Mills Association",
        quantity: "30 tons",
        price: "₹40,000/ton",
        status: "Accepted",
      },
      { id: "BID-018", farmer: "Meerut Sugar Producers", quantity: "40 tons", price: "₹41,000/ton", status: "Pending" },
      {
        id: "BID-019",
        farmer: "Lucknow Sugar Cooperative",
        quantity: "50 tons",
        price: "₹42,000/ton",
        status: "Pending",
      },
    ],
  },
]

export default function TendersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")

  // Filter tenders
  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      tender.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.product.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || tender.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesRegion = regionFilter === "all" || tender.region === regionFilter

    return matchesSearch && matchesStatus && matchesRegion
  })

  // Get unique regions for filter
  const regions = ["all", ...new Set(tenders.map((tender) => tender.region))]

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
                <Button variant="secondary" className="w-full justify-start">
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
                <Button variant="ghost" className="w-full justify-start">
                  <Store className="mr-2 h-4 w-4" />
                  Ration Shops
                </Button>
              </Link>
            </div>
          </div>
          <div className="px-4 py-2">
            <h2 className="mb-2 text-xs font-semibold tracking-tight">Management</h2>
            <div className="space-y-1">
              <Link href="/admin/farmers">
                <Button variant="ghost" className="w-full justify-start">
                  <Leaf className="mr-2 h-4 w-4" />
                  Farmers
                </Button>
              </Link>
              <Link href="/admin/consumers">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Consumers
                </Button>
              </Link>
              <Link href="/admin/ledger">
                <Button variant="ghost" className="w-full justify-start">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Public Ledger
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
              <p className="text-sm font-medium">Amit Verma</p>
              <p className="text-xs text-gray-500">Government Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/settings">
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
            <Building className="h-5 w-5 text-purple-600" />
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
              <h1 className="text-2xl font-bold">Government Procurement Tenders</h1>
              <p className="text-gray-500">Manage and monitor procurement tenders and farmer bids</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Create New Tender
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-auto md:flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search by ID, title, or product..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closing soon">Closing Soon</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions
                    .filter((r) => r !== "all")
                    .map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="active" className="mb-6">
            <TabsList>
              <TabsTrigger value="active">Active Tenders</TabsTrigger>
              <TabsTrigger value="bids">Farmer Bids</TabsTrigger>
              <TabsTrigger value="completed">Completed Tenders</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {filteredTenders.map((tender) => (
                <Card key={tender.id} className="mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{tender.title}</CardTitle>
                        <CardDescription>
                          {tender.id} • {tender.product} • {tender.region}
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          tender.status === "Open"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : tender.status === "Closing Soon"
                              ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
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
                            <span className="text-sm text-gray-500">Bids Received:</span>
                            <span className="text-sm">{tender.bids.length}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Procurement Progress</h3>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Current Amount</span>
                              <span className="text-sm">
                                {tender.currentAmount} tons / {tender.totalAmount} tons
                              </span>
                            </div>
                            <Progress value={tender.percentage} className="h-2" />
                            <p className="text-xs text-gray-500">
                              {tender.percentage}% of required quantity has been procured
                            </p>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-sm font-medium">Accepted Bids</h4>
                            {tender.bids
                              .filter((bid) => bid.status === "Accepted")
                              .map((bid) => (
                                <div key={bid.id} className="flex justify-between text-sm">
                                  <span>{bid.farmer}</span>
                                  <span>{bid.quantity}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm" className="mr-2">
                        View All Bids
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit Tender
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredTenders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No tenders found</h2>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                      setRegionFilter("all")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bids" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Farmer Bids</CardTitle>
                  <CardDescription>All bids received for active tenders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">Bid ID</th>
                          <th className="text-left py-3 px-2">Tender</th>
                          <th className="text-left py-3 px-2">Farmer</th>
                          <th className="text-left py-3 px-2">Quantity</th>
                          <th className="text-left py-3 px-2">Price</th>
                          <th className="text-left py-3 px-2">Status</th>
                          <th className="text-left py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTenders.flatMap((tender) =>
                          tender.bids.map((bid) => (
                            <tr key={bid.id} className="border-b">
                              <td className="py-3 px-2">{bid.id}</td>
                              <td className="py-3 px-2">{tender.id}</td>
                              <td className="py-3 px-2">{bid.farmer}</td>
                              <td className="py-3 px-2">{bid.quantity}</td>
                              <td className="py-3 px-2">{bid.price}</td>
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
                              <td className="py-3 px-2">
                                <div className="flex gap-2">
                                  {bid.status === "Pending" && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                                      >
                                        Reject
                                      </Button>
                                    </>
                                  )}
                                  {bid.status !== "Pending" && (
                                    <Button variant="outline" size="sm">
                                      View
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )),
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Tenders</CardTitle>
                  <CardDescription>Archive of past procurement tenders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Completed tenders would be displayed here</p>
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
