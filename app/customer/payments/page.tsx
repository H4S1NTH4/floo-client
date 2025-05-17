"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

// Define payment type
type Payment = {
  id: string;
  name: string;
  status: string;
  amount: number;
  currency: string;
  quantity: number;
  createdAt: string;
};

export default function PaymentListPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8080/payment-service/api/v1/payment/all");
        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
    };
    fetchPayments();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Payment List</h2>
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-gray-900 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Currency</th>
              <th className="px-4 py-3 text-left">Quantity</th>
              <th className="px-4 py-3 text-left">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3">{payment.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-4 py-3">{payment.amount}</td>
                <td className="px-4 py-3">{payment.currency}</td>
                <td className="px-4 py-3">{payment.quantity}</td>
                <td className="px-4 py-3">{new Date(payment.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
