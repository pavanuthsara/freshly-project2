import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {Download, File} from 'lucide-react';


const ProductReportGenerator = () => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportFormat, setReportFormat] = useState('excel');
  const [isLoading, setIsLoading] = useState(false);

  const generateReport = async (format) => {
    try {
      setIsLoading(true);
      // Get the farmer's token from local storage
      const token = localStorage.getItem('farmerToken');
      
      // Configure the axios request
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Fetch farmer's products
      const response = await axios.get('/api/farmerProducts', config);
      const products = response.data.data || [];

      // Prepare report data
      const reportData = products.map(product => ({
        Name: product.name,
        Category: product.category,
        Price: `LKR ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        Quantity: `${product.quantity} kg`,
        Certification: product.certification,
        Description: product.description || 'No description'
      }));

      // Generate report based on selected format
      if (format === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        
        XLSX.writeFile(workbook, `Farmer_Products_${new Date().toISOString().split('T')[0]}.xlsx`);
      } else {
        const doc = new jsPDF('landscape');
        
        doc.setFontSize(18);
        doc.text('Farmer Products Report', 14, 15);
        
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

        const columns = [
          'Name', 'Category', 'Price', 'Quantity', 'Certification', 'Description'
        ];

        const rows = reportData.map(product => [
          product.Name,
          product.Category,
          product.Price,
          product.Quantity,
          product.Certification,
          product.Description
        ]);

        doc.autoTable({
          head: [columns],
          body: rows,
          startY: 30,
          styles: { 
            fontSize: 9,
            cellPadding: 3,
            overflow: 'linebreak'
          },
          columnStyles: { 
            5: { cellWidth: 50 } 
          }
        });

        doc.save(`Farmer_Products_${new Date().toISOString().split('T')[0]}.pdf`);
      }

      setIsReportDialogOpen(false);
    } catch (error) {
      console.error('Error generating report:', error);
      alert(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
                <label className="block text-green-700 mb-2">Select Report Format</label>
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
                  {isLoading ? 'Generating...' : (
                    reportFormat === 'excel' ? (
                    <><File className="mr-2" /> Generate Excel Report</>
                      ) : (
                    <><File className="mr-2" /> Generate PDF Report</>
                  )
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