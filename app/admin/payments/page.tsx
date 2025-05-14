"use client";

import React, { useEffect, useState } from 'react';
import { paymentService } from '@/services/payment-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bar, Pie } from 'react-chartjs-2';
import { saveAs } from 'file-saver';
import type { ChartData } from 'chart.js';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

type Payment = {
  id: string;
  amount: number;
  status: string;
  date: string;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pieChartData, setPieChartData] = useState<ChartData<'pie', number[], unknown>>({
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: [],
      },
    ],
  });

  const [barChartData, setBarChartData] = useState<ChartData<'bar', number[], unknown>>({
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: [],
      },
    ],
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchPayments = async () => {
      const mockPayments: Payment[] = [
        { id: '1', amount: 100, status: 'Completed', date: '2025-04-01T10:00:00Z' },
        { id: '2', amount: 50, status: 'Pending', date: '2025-04-02T12:00:00Z' },
        { id: '3', amount: 75, status: 'Failed', date: '2025-04-03T14:00:00Z' },
        { id: '4', amount: 200, status: 'Completed', date: '2025-03-04T16:00:00Z' },
        { id: '5', amount: 150, status: 'Pending', date: '2025-03-05T18:00:00Z' },
      ];

      setPayments(mockPayments);
      setPieChartData(generatePieChartData(mockPayments));
      setBarChartData(generateBarChartData(mockPayments));
    };
    fetchPayments();
  }, []);

  const generatePieChartData = (payments: Payment[]) => {
    const statusCounts = payments.reduce((acc: Record<string, number>, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: 'Payment Status',
          data: Object.values(statusCounts),
          backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        },
      ],
    };
  };

  const generateBarChartData = (payments: Payment[]) => {
    const monthlyRevenue = payments.reduce((acc: Record<string, number>, payment) => {
      const month = new Date(payment.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + payment.amount;
      return acc;
    }, {});

    return {
      labels: Object.keys(monthlyRevenue),
      datasets: [
        {
          label: 'Monthly Revenue',
          data: Object.values(monthlyRevenue),
          backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#2196f3'],
        },
      ],
    };
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const reportBlob = await paymentService.generateReport();
      saveAs(reportBlob, 'payment-report.pdf');
      toast({ title: 'Report Generated', description: 'The report has been downloaded.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate the report.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Payments Dashboard</h1>
      <div className="flex justify-between items-center mb-6">
        <Button onClick={handleGenerateReport} disabled={isGenerating} className="mb-6">
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </Button>
        <div className="flex space-x-4">
          <Button variant="outline">Filter by Date</Button>
          <Button variant="outline">Filter by Status</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Payment Status Distribution</h2>
          <Pie data={pieChartData} />
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
          <Bar data={barChartData} />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id} className="border-t">
                  <td className="px-4 py-2">{payment.id}</td>
                  <td className="px-4 py-2">${payment.amount.toFixed(2)}</td>
                  <td className="px-4 py-2">{payment.status}</td>
                  <td className="px-4 py-2">{new Date(payment.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
