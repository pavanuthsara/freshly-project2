import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Placeholder logo
const logoUrl = '../src/assets/freshly-logo.png';

// Company details
const companyDetails = {
  name: 'Freshly.lk',
  address: '123 Green Harvest Road, Colombo 00700, Sri Lanka',
  email: 'support@freshly.lk',
  phone: '+94 11 234 5678',
  website: 'www.freshly.lk',
  tagline: 'Delivering Freshness Across Sri Lanka',
};

export const generateOrderPDF = (order) => {
  console.log('generateOrderPDF called with:', { order });

  // Validate input
  if (!order || typeof order !== 'object') {
    console.error('Invalid order:', order);
    alert('Cannot generate PDF: Order details are missing or invalid.');
    return;
  }

  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    console.log('jsPDF initialized');

    // Generate a simple report ID (e.g., based on timestamp)
    const reportId = `ORD-${Date.now()}`;

    // Cover Page
    // Company Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94); // Freshly.lk green
    doc.text(companyDetails.name, 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(companyDetails.tagline, 20, 28);

    // Company Logo
    try {
      doc.addImage(logoUrl, 'PNG', 160, 15, 30, 30); // Logo at top-right
    } catch (imgError) {
      console.warn('Failed to load logo:', imgError);
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text('Freshly.lk', 160, 25); // Fallback text
    }

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
    doc.line(20, 65, 190, 65); // Horizontal line

    // Document Title and Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(34, 197, 94);
    doc.text('Order Report', 105, 100, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(50);
    doc.text(`Order ID: ${order._id || 'N/A'}`, 105, 115, { align: 'center' });
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 105, 125, { align: 'center' });
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
      try {
        doc.addImage(logoUrl, 'PNG', 180, 5, 20, 20); // Small logo in header
      } catch (imgError) {
        console.warn('Failed to load header logo:', imgError);
      }
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
      'This report provides a detailed overview of your order with Freshly.lk, ' +
      'including order status, shipping details, payment information, and items purchased.',
      20,
      40,
      { maxWidth: 170 }
    );

    // Order Details Table
    autoTable(doc, {
      startY: 60,
      head: [['Detail', 'Value']],
      body: [
        ['Order ID', order._id || 'N/A'],
        ['Order Date', new Date(order.createdAt).toLocaleDateString()],
        ['Status', order.status || 'N/A'],
        ['Payment Status', order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'],
        ['Delivery Status', order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Not Delivered'],
        ['Shipping Address', `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`],
        ['Payment Method', order.paymentMethod || 'N/A'],
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
        1: { cellWidth: 80, halign: 'left' },
      },
      margin: { left: 20, right: 20 },
    });

    // Order Items Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text('Order Items', 20, doc.lastAutoTable.finalY + 20);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 30,
      head: [['Item Name', 'Quantity', 'Unit Price (LKR)', 'Total (LKR)']],
      body: (order.orderItems || []).map(item => [
        item.name || 'N/A',
        item.qty || 0,
        (item.price || 0).toFixed(2),
        (item.qty * item.price || 0).toFixed(2),
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
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: 'right' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 30, halign: 'right' },
      },
      margin: { left: 20, right: 20 },
    });

    // Financial Summary Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text('Financial Summary', 20, doc.lastAutoTable.finalY + 20);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 30,
      head: [['Description', 'Amount (LKR)']],
      body: [
        ['Items Price', (order.itemsPrice || 0).toFixed(2)],
        ['Shipping', (order.shippingPrice || 0).toFixed(2)],
        ['Tax', (order.taxPrice || 0).toFixed(2)],
        ['Total', (order.totalPrice || 0).toFixed(2)],
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

    // Refund/Cancellation Info (if applicable)
    if (order.refundRequested || order.status === 'Cancelled') {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(34, 197, 94);
      doc.text('Additional Information', 20, doc.lastAutoTable.finalY + 20);
      const additionalInfo = [];
      if (order.status === 'Cancelled') {
        additionalInfo.push(['Cancellation Reason', order.cancellationReason || 'N/A']);
      }
      if (order.refundRequested) {
        additionalInfo.push(['Refund Status', order.refundStatus || 'N/A']);
        additionalInfo.push(['Refund Reason', order.refundReason || 'N/A']);
        if (order.refundProcessedAt) {
          additionalInfo.push(['Refund Processed', new Date(order.refundProcessedAt).toLocaleDateString()]);
        }
      }
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 30,
        head: [['Field', 'Details']],
        body: additionalInfo,
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
          1: { cellWidth: 80, halign: 'left' },
        },
        margin: { left: 20, right: 20 },
      });
    }

    // Save the PDF
    console.log('Saving PDF...');
    doc.save(`Freshly_Order_Report_${order._id}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please check the console for details.');
  }
};