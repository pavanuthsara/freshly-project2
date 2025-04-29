// src/utils/driverpdfUtils.js
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Placeholder logo
const logoUrl = '../src/assets/freshly-logo.png';

// Company details (replace with actual details)
const companyDetails = {
  name: 'Freshly.lk',
  address: '123 Green Harvest Road, Colombo 00700, Sri Lanka',
  email: 'support@freshly.lk',
  phone: '+94 11 234 5678',
  website: 'www.freshly.lk',
  tagline: 'Delivering Freshness Across Sri Lanka',
};

export const generatePDF = (user, deliveryStats, recentDeliveries) => {
  console.log('generatePDF called with:', { user, deliveryStats, recentDeliveries });

  // Validate inputs
  if (!deliveryStats || typeof deliveryStats !== 'object') {
    console.error('Invalid deliveryStats:', deliveryStats);
    alert('Cannot generate PDF: Delivery statistics are missing or invalid.');
    return;
  }
  if (!recentDeliveries || !Array.isArray(recentDeliveries)) {
    console.error('Invalid recentDeliveries:', recentDeliveries);
    alert('Cannot generate PDF: Recent deliveries are missing or invalid.');
    return;
  }

  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    console.log('jsPDF initialized');

    // Generate a simple report ID (e.g., based on timestamp)
    const reportId = `FR-${Date.now()}`;

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
    doc.text('Driver Report', 105, 100, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(50);
    doc.text(`Prepared for: ${user?.name || 'Driver'}`, 105, 115, { align: 'center' });
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
    doc.text('Delivery Summary', 20, 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text(
      'This report provides an overview of your delivery activities with Freshly.lk, ' +
      'including key statistics, crop deliveries, and recent delivery details.',
      20,
      40,
      { maxWidth: 170 }
    );

    // Stats Table
    autoTable(doc, {
      startY: 60,
      head: [['Metric', 'Value']],
      body: [
        ['Total Deliveries', deliveryStats.totalDeliveries || 0],
        ['Completed Deliveries', deliveryStats.completedDeliveries || 0],
        ['Pending Deliveries', deliveryStats.pendingDeliveries || 0],
        ['Total Earnings', `LKR ${(deliveryStats.totalEarnings || 0).toFixed(2)}`],
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

    // Crop Breakdown Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text('Crop Delivery Breakdown', 20, doc.lastAutoTable.finalY + 20);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 30,
      head: [['Crop', 'Quantity', 'Unit']],
      body: (deliveryStats.cropTypes || []).map(crop => [
        crop?.name || 'N/A',
        crop?.quantity || 0,
        crop?.unit || 'N/A',
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
        0: { cellWidth: 60 },
        1: { cellWidth: 60, halign: 'right' },
        2: { cellWidth: 40 },
      },
      margin: { left: 20, right: 20 },
    });

    // Recent Deliveries Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text('Recent Deliveries', 20, doc.lastAutoTable.finalY + 20);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 30,
      head: [['ID', 'Farm', 'Destination', 'Crop', 'Qty (kg)', 'Status', 'Date']],
      body: recentDeliveries.map(delivery => [
        delivery?.id || 'N/A',
        delivery?.farm || 'N/A',
        delivery?.destination || 'N/A',
        delivery?.crop || 'N/A',
        delivery?.quantity || 0,
        delivery?.status || 'N/A',
        delivery?.date || 'N/A',
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
        0: { cellWidth: 15 },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 25 },
        4: { cellWidth: 15, halign: 'right' },
        5: { cellWidth: 25 },
        6: { cellWidth: 35 },
      },
      margin: { left: 20, right: 20 },
    });

    // Save the PDF
    console.log('Saving PDF...');
    doc.save(`Freshly_Driver_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please check the console for details.');
  }
};