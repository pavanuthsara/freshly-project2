// src/utils/driverpdfUtils.js
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Placeholder logo
const logoUrl = '../src/assets/freshly-logo.png';

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

    // Cover Page
    doc.setFontSize(24);
    doc.setTextColor(34, 197, 94); // Freshly.lk green
    doc.setFont('helvetica', 'bold');
    doc.text('Freshly.lk Driver Report', 20, 50, { align: 'left' });
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    doc.text(`Prepared for: ${user?.name || 'Driver'}`, 20, 65);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 75);
    doc.setFontSize(12);
    doc.text('Delivering Freshness Across Sri Lanka', 20, 90);
    try {
      doc.addImage(logoUrl, 'PNG', 150, 20, 40, 40); // Logo at top-right
    } catch (imgError) {
      console.warn('Failed to load logo:', imgError);
      doc.setFontSize(12);
      doc.text('Freshly.lk', 150, 30); // Fallback text if logo fails
    }
    doc.addPage();

    // Header on each page (except cover)
    const addHeader = () => {
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Freshly.lk', 20, 10);
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
      doc.text('Freshly.lk - Delivering Freshness', 20, 287);
    };

    // Add header and footer to all pages after cover
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 2; i <= pageCount; i++) {
      doc.setPage(i);
      addHeader();
      addFooter(i - 1, pageCount - 1);
    }

    // Summary Section
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.setFont('helvetica', 'bold');
    doc.text('Delivery Summary', 20, 30);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
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
      },
      bodyStyles: { textColor: [50, 50, 50] },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 80, halign: 'right' },
      },
      margin: { left: 20, right: 20 },
    });

    // Crop Breakdown Table
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.setFont('helvetica', 'bold');
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
      },
      bodyStyles: { textColor: [50, 50, 50] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 60, halign: 'right' },
        2: { cellWidth: 40 },
      },
      margin: { left: 20, right: 20 },
    });

    // Recent Deliveries Table
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.setFont('helvetica', 'bold');
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
      },
      bodyStyles: { textColor: [50, 50, 50] },
      columnStyles: {
        0: { cellWidth: 15 }, // ID
        1: { cellWidth: 35 }, // Farm
        2: { cellWidth: 35 }, // Destination
        3: { cellWidth: 25 }, // Crop
        4: { cellWidth: 15, halign: 'right' }, // Qty (kg)
        5: { cellWidth: 25 }, // Status
        6: { cellWidth: 35 }, // Date
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