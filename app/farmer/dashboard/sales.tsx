"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // Legend,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, Download } from "lucide-react"
import { useState } from "react"

// Sample sales data
const monthlySales = [
  { month: "Jan", amount: 4500 },
  { month: "Feb", amount: 3200 },
  { month: "Mar", amount: 5400 },
  { month: "Apr", amount: 6200 },
  { month: "May", amount: 7800 },
  { month: "Jun", amount: 5600 },
]

const weeklyEarnings = [
  { week: "Week 1", amount: 1200 },
  { week: "Week 2", amount: 1400 },
  { week: "Week 3", amount: 950 },
  { week: "Week 4", amount: 2050 },
]

const productPerformance = [
  { name: "Tomatoes", value: 35000 },
  { name: "Potatoes", value: 25000 },
  { name: "Onions", value: 20000 },
  { name: "Wheat", value: 42000 },
  { name: "Rice", value: 38000 },
]

// Sales transactions
const transactions = [
  {
    id: "TXN-001",
    buyer: "Priya Sharma",
    date: "2023-05-15",
    products: "Tomatoes, Potatoes",
    amount: "₹1,200",
    status: "Completed",
  },
  {
    id: "TXN-002",
    buyer: "Amit Kumar",
    date: "2023-05-12",
    products: "Wheat (50kg)",
    amount: "₹2,500",
    status: "Completed",
  },
  {
    id: "TXN-003",
    buyer: "Govt. of Delhi",
    date: "2023-05-10",
    products: "Rice (200kg)",
    amount: "₹12,000",
    status: "Completed",
  },
  {
    id: "TXN-004",
    buyer: "Neha Singh",
    date: "2023-05-08",
    products: "Onions, Tomatoes",
    amount: "₹850",
    status: "Completed",
  },
  {
    id: "TXN-005",
    buyer: "Rajiv Mehta",
    date: "2023-05-05",
    products: "Potatoes (25kg)",
    amount: "₹750",
    status: "Completed",
  },
]

export default function FarmerSales() {
  const [timeRange, setTimeRange] = useState("6m")

  // Calculate total earnings
  const totalEarnings = monthlySales.reduce((sum, month) => sum + month.amount, 0)

  // Calculate average earnings
  const avgEarnings = Math.round(totalEarnings / monthlySales.length)

  // Calculate this month's earnings
  const currentMonthEarnings = monthlySales[monthlySales.length - 1].amount

  // Calculate growth percentage
  const prevMonthEarnings = monthlySales[monthlySales.length - 2].amount
  const growthPercentage = Math.round(((currentMonthEarnings - prevMonthEarnings) / prevMonthEarnings) * 100)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Sales & Earnings</h2>
          <p className="text-gray-500">Monitor your sales performance and earnings</p>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Over the last 6 months</p>
            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="bg-green-500 h-1 w-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{avgEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Average per month</p>
            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-1 w-[75%]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{currentMonthEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={growthPercentage >= 0 ? "text-green-500" : "text-red-500"}>
                {growthPercentage >= 0 ? "+" : ""}
                {growthPercentage}%
              </span>{" "}
              from last month
            </p>
            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-1 ${growthPercentage >= 0 ? "bg-green-500" : "bg-red-500"}`}
                style={{ width: `${Math.min(100, Math.abs(growthPercentage))}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Products generating revenue</p>
            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-1 w-[80%]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="earnings" className="w-full">
        <TabsList>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Earnings Tab */}
        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`₹${value}`, "Revenue"]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar dataKey="amount" fill="#4ade80" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Earnings (Current Month)</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} labelFormatter={(label) => `${label}`} />
                  {/* <Legend /> */}
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Revenue" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Revenue</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip
                    formatter={(value) => [`₹${value}`, "Revenue"]}
                    labelFormatter={(label) => `Product: ${label}`}
                  />
                  {/* <Legend /> */}
                  <Bar dataKey="value" fill="#22c55e" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productPerformance
                  .sort((a, b) => b.value - a.value)
                  .map((product, idx) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="font-medium w-6 text-center">{idx + 1}</div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{(product.value / 1000).toFixed(1)}k revenue</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-right">₹{product.value.toLocaleString()}</div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Transaction ID</th>
                      <th className="text-left py-3 px-2">Buyer</th>
                      <th className="text-left py-3 px-2">Date</th>
                      <th className="text-left py-3 px-2">Products</th>
                      <th className="text-left py-3 px-2">Amount</th>
                      <th className="text-left py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="py-3 px-2">{transaction.id}</td>
                        <td className="py-3 px-2">{transaction.buyer}</td>
                        <td className="py-3 px-2">{transaction.date}</td>
                        <td className="py-3 px-2">{transaction.products}</td>
                        <td className="py-3 px-2">{transaction.amount}</td>
                        <td className="py-3 px-2">
                          <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
