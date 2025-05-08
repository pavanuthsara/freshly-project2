import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  Edit2, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  Phone
} from 'lucide-react';

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    contactNo: '',
    description: '',
    type: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const complaintTypes = [
    'Product Quality',
    'Delivery Issue',
    'Payment Problem',
    'Service Complaint',
    'Other'
  ];

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/complaints', {
        withCredentials: true
      });
      setComplaints(response.data);
    } catch (error) {
      setError('Failed to fetch complaints');
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (complaint) => {
    setEditingId(complaint._id);
    setEditForm({
      contactNo: complaint.contactNo,
      description: complaint.description,
      type: complaint.type
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/complaints/${editingId}`, editForm, {
        withCredentials: true
      });
      setSuccess('Complaint updated successfully');
      setEditingId(null);
      fetchComplaints();
    } catch (error) {
      setError('Failed to update complaint');
      console.error('Error updating complaint:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await axios.delete(`/api/complaints/${id}`, {
          withCredentials: true
        });
        setSuccess('Complaint deleted successfully');
        fetchComplaints();
      } catch (error) {
        setError('Failed to delete complaint');
        console.error('Error deleting complaint:', error);
      }
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    const logoUrl = '../../assets/logo.png';

    const companyDetails = {
      name: 'Freshly.lk',
      address: '123 Green Harvest Road, Colombo 00700, Sri Lanka',
      email: 'support@freshly.lk',
      phone: '+94 11 234 5678',
      website: 'www.freshly.lk',
      tagline: 'Delivering Freshness Across Sri Lanka',
    };

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
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(0); // Black color for title
    doc.text('Complaint History Summary', 14, 70); // Moved title lower to avoid overlap
    
    // Prepare table data
    const tableData = filteredComplaints.map(complaint => [
      new Date(complaint.createdAt).toLocaleDateString(),
      complaint.type,
      complaint.contactNo,
      complaint.description,
      complaint.status
    ]);

    // Add table using autoTable
    autoTable(doc, {
      startY: 80, // Adjusted to start below the title
      head: [['Date', 'Type', 'Contact', 'Description', 'Status']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [0, 128, 128],
        textColor: [255, 255, 255]
      },
      styles: {
        cellPadding: 2,
        fontSize: 10,
        overflow: 'linebreak'
      },
      columnStyles: {
        3: { cellWidth: 80 } // Make description column wider
      }
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount} | Generated on ${new Date().toLocaleDateString()}`,
        14,
        doc.internal.pageSize.height - 10
      );
    }

    // Save the PDF
    doc.save('complaint_history.pdf');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const filteredComplaints = complaints
    .filter(complaint => 
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Complaint History</h1>
        
        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5" />
            <p className="text-sm">{success}</p>
          </div>
        )}

        {/* Complaints Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <button
                      className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                      onClick={() => {
                        setSortField('createdAt');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}
                    >
                      <span>Date</span>
                      {sortField === 'createdAt' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text k-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No complaints found
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === complaint._id ? (
                          <select
                            value={editForm.type}
                            onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                          >
                            {complaintTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        ) : (
                          complaint.type
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === complaint._id ? (
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                              type="tel"
                              value={editForm.contactNo}
                              onChange={(e) => setEditForm({ ...editForm, contactNo: e.target.value })}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                              placeholder="Contact number"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            {complaint.contactNo}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {editingId === complaint._id ? (
                          <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            rows="2"
                          />
                        ) : (
                          complaint.description
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(complaint.status)}
                          <span className="text-sm text-gray-900 capitalize">
                            {complaint.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {editingId === complaint._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={handleUpdate}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(complaint)}
                              className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(complaint._id)}
                              className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end">      
          <button 
            type="button" 
            onClick={generatePDF}
            className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 transition-colors font-medium text-sm"
          >
            Download Complaint Summary PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintHistory;