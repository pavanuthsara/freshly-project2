import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, File } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ProductReportGenerator = () => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportFormat, setReportFormat] = useState('excel');
  const [isLoading, setIsLoading] = useState(false);

  const generateReport = async (format) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('farmerToken');

      // Fetch farmer profile
      const profileResponse = await fetch('/api/farmers/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch farmer profile');
      }
      const profileData = await profileResponse.json();
      const farmer = profileData.farmer || {};
      console.log('Farmer profile:', farmer);

      // Fetch products
      const productResponse = await fetch('/api/farmerProducts', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!productResponse.ok) {
        throw new Error('Failed to fetch products');
      }
      const productData = await productResponse.json();
      const products = productData.data || [];
      console.log('Farmer products:', products);

      const reportData = products.map((product) => ({
        Name: product.name || 'Unknown',
        Category: product.category || 'N/A',
        Price: `LKR ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}`,
        Stock: `${product.countInStock ?? 0} kg`,
        Certification: product.certification || 'N/A',
        Description: product.description || 'No description',
      }));

      const columns = [
        'Name',
        'Category',
        'Price',
        'Stock (kg)',
        'Certification',
        'Description',
      ];

      const rows = reportData.map((item) => [
        item.Name,
        item.Category,
        item.Price,
        item.Stock,
        item.Certification,
        item.Description,
      ]);

      if (format === 'excel') {
        const coverSheetData = [
          ['Freshly.lk'],
          [],
          ['Farmer Product Report'],
          ['Generated on:', new Date().toLocaleDateString()],
          ['Farmer:', farmer.name || 'Unknown'],
          [
            'Address:',
            farmer.farmAddress
              ? `${farmer.farmAddress.streetNo}, ${farmer.farmAddress.city}, ${farmer.farmAddress.district}`
              : 'No address provided',
          ],
        ];
        const coverSheet = XLSX.utils.aoa_to_sheet(coverSheetData);

        coverSheet['!cols'] = [{ wch: 20 }, { wch: 50 }];
        coverSheet['A1'] = {
          v: 'Freshly.lk',
          s: {
            font: { name: 'Helvetica', bold: true, sz: 16 },
            fill: { fgColor: { rgb: '228B22' } },
            alignment: { horizontal: 'left', vertical: 'center' },
          },
        };
        coverSheet['A3'] = {
          v: 'Farmer Product Report',
          s: {
            font: { name: 'Helvetica', bold: true, sz: 14 },
            alignment: { horizontal: 'left', vertical: 'center' },
          },
        };
        coverSheet['A4'] = {
          v: 'Generated on:',
          s: { font: { name: 'Helvetica', bold: true } },
        };
        coverSheet['A5'] = {
          v: 'Farmer:',
          s: { font: { name: 'Helvetica', bold: true } },
        };
        coverSheet['A6'] = {
          v: 'Address:',
          s: { font: { name: 'Helvetica', bold: true } },
        };

        const worksheet = XLSX.utils.json_to_sheet(reportData, {
          header: columns,
        });

        worksheet['!cols'] = [
          { wch: 20 },
          { wch: 15 },
          { wch: 15 },
          { wch: 10 },
          { wch: 15 },
          { wch: 30 },
        ];
        columns.forEach((col, index) => {
          const cell = XLSX.utils.encode_cell({ r: 0, c: index });
          worksheet[cell] = {
            v: col,
            s: {
              font: { name: 'Helvetica', bold: true },
              fill: { fgColor: { rgb: '228B22' } },
              alignment: { horizontal: 'center', vertical: 'center' },
            },
          };
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, coverSheet, 'Cover');
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

        XLSX.writeFile(
          workbook,
          `Farmer_Products_${new Date().toISOString().split('T')[0]}.xlsx`
        );
        toast.success(`Excel report generated successfully!`, {
          style: {
            background: '#34D399',
            color: '#FFFFFF',
            fontWeight: 'bold',
          },
          duration: 3000,
        });
      } else {
        const doc = new jsPDF('landscape');

        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(34, 139, 34);
        doc.text('Freshly.lk', 14, 30);

        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Farmer Product Report', 148.5, 60, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 80);
        doc.text(`Farmer: ${farmer.name || 'Unknown'}`, 14, 90);
        const address = farmer.farmAddress
          ? `${farmer.farmAddress.streetNo}, ${farmer.farmAddress.city}, ${farmer.farmAddress.district}`
          : 'No address provided';
        doc.text(`Address: ${address}`, 14, 100);

        doc.setDrawColor(34, 139, 34);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20);

        doc.addPage();

        autoTable(doc, {
          head: [columns],
          body: rows,
          startY: 30,
          styles: {
            fontSize: 9,
            cellPadding: 3,
            overflow: 'linebreak',
          },
          headStyles: {
            fillColor: [34, 139, 34],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
          },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 30 },
            2: { cellWidth: 30 },
            3: { cellWidth: 20 },
            4: { cellWidth: 30 },
            5: { cellWidth: 50 },
          },
          didDrawPage: (data) => {
            const pageCount = doc.internal.getNumberOfPages();
            const currentPage = data.pageNumber;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(
              `Page ${currentPage - 1} of ${pageCount - 1}`,
              doc.internal.pageSize.width - 30,
              doc.internal.pageSize.height - 10,
              { align: 'right' }
            );
          },
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 2; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(34, 139, 34);
          doc.text(
            'Farmer Product Report',
            14,
            doc.internal.pageSize.height - 20
          );
          doc.text(
            `Generated on: ${new Date().toLocaleDateString()}`,
            14,
            doc.internal.pageSize.height - 10
          );
        }

        const pdfOutput = doc.output('blob');
        const url = URL.createObjectURL(pdfOutput);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Farmer_Products_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success(`PDF report generated successfully!`, {
          style: {
            background: '#34D399',
            color: '#FFFFFF',
            fontWeight: 'bold',
          },
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report. Please try again.', {
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <button
        onClick={() => setIsReportDialogOpen(true)}
        className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
      >
        <Download className="mr-2" size={20} /> Generate Report
      </button>

      {isReportDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">
                Generate Product Report
              </h2>
              <button
                onClick={() => setIsReportDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-green-700 mb-2">
                  Select Report Format
                </label>
                <select
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="excel">Excel (.xlsx)</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => generateReport(reportFormat)}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    'Generating...'
                  ) : reportFormat === 'excel' ? (
                    <>
                      <File className="mr-2" /> Generate Excel Report
                    </>
                  ) : (
                    <>
                      <File className="mr-2" /> Generate PDF Report
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsReportDialogOpen(false)}
                  disabled={isLoading}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductReportGenerator;