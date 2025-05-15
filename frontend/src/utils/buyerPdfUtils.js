import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Company details
const companyDetails = {
  name: 'Freshly.lk',
  address: '123 Green Harvest Road, Colombo 00700, Sri Lanka',
  email: 'support@freshly.lk',
  phone: '+94 11 234 5678',
  website: 'www.freshly.lk',
  tagline: 'Delivering Freshness Across Sri Lanka',
};

export const generateBuyerOrderHistoryPDF = (user, orders) => {
  console.log('generateBuyerOrderHistoryPDF called with:', { user, orders });

  // Validate inputs
  if (!orders || !Array.isArray(orders)) {
    console.error('Invalid orders:', orders);
    alert('Cannot generate PDF: Order history is missing or invalid.');
    return;
  }

  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    console.log('jsPDF initialized');

    // Generate a simple report ID
    const reportId = `FR-BO-${Date.now()}`;

    // Cover Page
    // Company Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94); // Freshly.lk green
    doc.text(companyDetails.name, 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(companyDetails.tagline, 20, 28);

    // Company Contact Info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(companyDetails.address, 20, 40);
    doc.text(`Email: ${companyDetails.email}`, 20, 46);
    doc.text(`Phone: ${companyDetails.phone}`, 20, 52);
    doc.text(`Website: ${companyDetails.website}`, 20, 58);

    // Divider
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(0.5);
    doc.line(20, 65, 190, 65);

    // Document Title and Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(34, 197, 94);
    doc.text('Order History Report', 105, 100, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(50);
    doc.text(`Prepared for: ${user?.name || 'Customer'}`, 105, 115, { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 125, { align: 'center' });
    doc.text(`Report ID: ${reportId}`, 105, 135, { align: 'center' });

    // Confidentiality Note
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Confidential: For internal use only.', 105, 270, { align: 'center' });

    doc.addPage();

    // Header on each page (except cover)
    const addHeader = () => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(34, 197, 94);
      doc.text(companyDetails.name, 20, 10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(companyDetails.website, 20, 15);
    };

    // Footer on each page
    const addFooter = (pageNumber, pageCount) => {
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Page ${pageNumber} of ${pageCount}`, 190, 287, { align: 'right' });
      doc.text(`${companyDetails.name} | Report ID: ${reportId}`, 20, 287);
    };

    // Add header and footer to all pages after cover
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 2; i <= pageCount; i++) {
      doc.setPage(i);
      addHeader();
      addFooter(i - 1, pageCount - 1);
    }

    // Summary Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text('Order Summary', 20, 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text(
      'This report provides a detailed overview of your order history with Freshly.lk, ' +
      'including order status, dates, and total amounts.',
      20,
      40,
      { maxWidth: 170 }
    );

    // Order Statistics
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Stats Table
    autoTable(doc, {
      startY: 60,
      head: [['Metric', 'Value']],
      body: [
        ['Total Orders', totalOrders],
        ['Total Spent', `LKR ${totalSpent.toFixed(2)}`],
        ['Average Order Value', `LKR ${(totalSpent / totalOrders).toFixed(2)}`],
        ...Object.entries(statusCounts).map(([status, count]) => [
          `${status} Orders`,
          count
        ]),
      ],
      theme: 'striped',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: { textColor: [50, 50, 50], fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 80, halign: 'right' },
      },
      margin: { left: 20, right: 20 },
    });

    // Order History Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text('Order History', 20, doc.lastAutoTable.finalY + 20);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 30,
      head: [['Order ID', 'Date', 'Status', 'Total Amount']],
      body: orders.map(order => [
        `#${order._id.slice(-6)}`,
        new Date(order.createdAt).toLocaleDateString(),
        order.status,
        `LKR ${order.totalPrice.toFixed(2)}`,
      ]),
      theme: 'striped',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: { textColor: [50, 50, 50], fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40, halign: 'right' },
      },
      margin: { left: 20, right: 20 },
    });

    // Save the PDF
    console.log('Saving PDF...');
    doc.save(`Freshly_Order_History_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please check the console for details.');
  }
}; 