"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Bell,
  Calendar,
  ChevronRight,
  TrendingUp,
  Clock,
  Star,
  BarChart3,
  Users,
  DollarSign,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

interface Payment {
  id: string;
  stripeSessionId: string;
  name: string;
  currency: string;
  amount: number;
  quantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch payment data from the API
        const response = await fetch(
          "http://127.0.0.1:8080/payment-service/api/v1/payment/all"
        );
        const paymentData: Payment[] = await response.json();

        // Process payment data
        const totalRevenue = paymentData
          .filter((p) => p.status === "COMPLETED")
          .reduce((sum, p) => sum + p.amount * p.quantity, 0);
        const revenueToday = paymentData
          .filter(
            (p) =>
              p.status === "COMPLETED" &&
              new Date(p.createdAt).toDateString() ===
                new Date().toDateString()
          )
          .reduce((sum, p) => sum + p.amount * p.quantity, 0);

        // Aggregate revenue by date
        const revenueByDate = paymentData
          .filter((p) => p.status === "COMPLETED")
          .reduce((acc, p) => {
            const date = new Date(p.createdAt).toLocaleDateString();
            acc[date] = (acc[date] || 0) + p.amount * p.quantity;
            return acc;
          }, {} as Record<string, number>);

        const weeklyRevenue = Object.entries(revenueByDate)
          .map(([date, amount]) => ({
            date,
            amount,
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(-7); // Last 7 days

        // Payment status distribution
        const statusCounts = paymentData.reduce(
          (acc, p) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        const processedData = {
          totalUsers: 12, // Placeholder, update with real data if available
          activeUsers: 1, // Placeholder
          revenueToday,
          totalRevenue,
          newSignups: 4, // Placeholder
          topCountries: [
            { name: "USA", count: 520 },
            { name: "India", count: 320 },
            { name: "UK", count: 150 },
          ],
          recentActivities: paymentData
            .slice(0, 5)
            .map((p) => ({
              user: p.name,
              action: `Payment ${p.status.toLowerCase()}`,
              time: new Date(p.createdAt).toLocaleTimeString(),
            })),
          weeklyRevenue,
          statusCounts,
        };

        setPayments(paymentData);
        setData(processedData);
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = {
          month: "long",
          day: "numeric",
          year: "numeric",
        };
        setCurrentDate(today.toLocaleDateString("en-US", options));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // Pie chart data for payment status
  const pieChartData = {
    labels: Object.keys(data.statusCounts),
    datasets: [
      {
        data: Object.values(data.statusCounts),
        backgroundColor: ["#7ED957", "#FF6B6B"],
        hoverOffset: 20,
      },
    ],
  };

  // Line chart data for revenue trend
  const lineChartData = {
    labels: data.weeklyRevenue.map((r: any) => r.date),
    datasets: [
      {
        label: "Revenue ($)",
        data: data.weeklyRevenue.map((r: any) => r.amount),
        fill: false,
        borderColor: "#7ED957",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Overview of platform performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            {currentDate}
          </Button>
          <Button size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Today's Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.revenueToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalRevenue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Payment Status Distribution</CardTitle>
            <CardDescription>Breakdown of payment statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Pie
                data={pieChartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom" },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Revenue over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line
                data={lineChartData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "Revenue ($)" },
                    },
                    x: {
                      title: { display: true, text: "Date" },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Details */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>All payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Currency</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b">
                    <td className="p-3">{payment.name}</td>
                    <td className="p-3">{payment.amount}</td>
                    <td className="p-3">{payment.currency}</td>
                    <td className="p-3">{payment.quantity}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          payment.status === "COMPLETED"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payment Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.recentActivities.map((activity: any, i: number) => (
            <div
              key={i}
              className="p-3 bg-gray-50 rounded-md flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{activity.user}</div>
                <div className="text-xs text-gray-500">{activity.action}</div>
              </div>
              <div className="text-xs text-gray-400">{activity.time}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}