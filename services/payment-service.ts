import { jsPDF } from 'jspdf';

interface Payment {
  id: string;
  userId: string;
  amount: number;
  date: string;
  status: 'success' | 'failed';
}

const payments: Payment[] = [
  { id: '1', userId: '1', amount: 25.99, date: new Date().toISOString(), status: 'success' },
  { id: '2', userId: '2', amount: 15.49, date: new Date().toISOString(), status: 'failed' },
];

// delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class PaymentService {
  async processPayment(userId: string, amount: number): Promise<Payment> {
    await delay(500);
    const payment: Payment = {
      id: `payment-${Date.now()}`,
      userId,
      amount,
      date: new Date().toISOString(),
      status: Math.random() > 0.2 ? 'success' : 'failed',
    };
    payments.push(payment);
    return payment;
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    await delay(300);
    return payments.filter(payment => payment.userId === userId);
  }

  async getAllPayments(): Promise<Payment[]> {
    await delay(300);
    return payments;
  }

  async generateReport(): Promise<Blob> {
    const doc = new jsPDF();

    doc.text('Payment Report', 10, 10);
    doc.text('ID', 10, 20);
    doc.text('User ID', 50, 20);
    doc.text('Amount', 90, 20);
    doc.text('Date', 130, 20);
    doc.text('Status', 170, 20);

    payments.forEach((payment, index) => {
      const y = 30 + index * 10;
      doc.text(payment.id, 10, y);
      doc.text(payment.userId, 50, y);
      doc.text(payment.amount.toFixed(2), 90, y);
      doc.text(new Date(payment.date).toLocaleString(), 130, y);
      doc.text(payment.status, 170, y);
    });

    return doc.output('blob');
  }

  async getAggregatedData(): Promise<{ success: number; failed: number }> {
    const counts = { success: 0, failed: 0 };
    for (const payment of payments) {
      counts[payment.status]++;
    }
    return counts;
  }
}

export const paymentService = new PaymentService();
