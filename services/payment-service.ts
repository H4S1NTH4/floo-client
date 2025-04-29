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

    // Add title
    doc.text('Payment Report', 10, 10);

    // Add table headers
    doc.text('ID', 10, 20);
    doc.text('User ID', 50, 20);
    doc.text('Amount', 90, 20);
    doc.text('Date', 130, 20);
    doc.text('Status', 170, 20);

    // Add payment data
    payments.forEach((payment, index) => {
      const y = 30 + index * 10;
      doc.text(payment.id, 10, y);
      doc.text(payment.userId, 50, y);
      doc.text(payment.amount.toFixed(2), 90, y);
      doc.text(new Date(payment.date).toLocaleString(), 130, y);
      doc.text(payment.status, 170, y);
    });

    // Generate PDF as Blob
    const pdfBlob = doc.output('blob');
    return pdfBlob;
  }

  async getAggregatedData(): Promise<{ [key: string]: number }> {
    const statusCounts = payments.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {});

    return statusCounts;
  }
}

export const paymentService = new PaymentService();
