// src/utils/generateComplaintPDF.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Default base64 encoded transparent pixel as fallback
const transparentPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const generateComplaintPDF = (complaints, logoPath) => {
  const doc = new jsPDF();
  
  // Document settings
  doc.setDocumentProperties({
    title: 'Complaint Summary Report',
    creator: 'Your Application Name',
  });

  // Add header
  doc.setFontSize(18);
  doc.text('Complaint Summary Report', 14, 22);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

  // Add logo with error handling
  const addLogo = () => {
    return new Promise((resolve) => {
      if (!logoPath) {
        resolve();
        return;
      }

      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      img.onload = () => {
        try {
          doc.addImage(img, 'PNG', 170, 10, 30, 10);
        } catch (error) {
          console.warn('Failed to add logo:', error);
        }
        resolve();
      };
      
      img.onerror = () => {
        console.warn('Failed to load logo, using fallback');
        doc.addImage(transparentPixel, 'PNG', 170, 10, 30, 10);
        resolve();
      };

      img.src = logoPath || transparentPixel;
    });
  };

  // Create the PDF content
  const createPDFContent = async () => {
    await addLogo();

    // Prepare table data
    const headers = [['Date', 'Type', 'Contact', 'Description', 'Status']];
    const body = complaints.map(complaint => [
      new Date(complaint.createdAt).toLocaleDateString(),
      complaint.type,
      complaint.contactNo,
      complaint.description.substring(0, 40) + (complaint.description.length > 40 ? '...' : ''),
      complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)
    ]);

    // Generate table
    doc.autoTable({
      head: headers,
      body: body,
      startY: 35,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 1.5,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [55, 65, 81],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 35 },
        2: { cellWidth: 30 },
        3: { cellWidth: 60 },
        4: { cellWidth: 25 }
      }
    });

    // Save the document
    doc.save(`complaint-summary-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  createPDFContent().catch(error => {
    console.error('PDF generation failed:', error);
  });
};

export default generateComplaintPDF;