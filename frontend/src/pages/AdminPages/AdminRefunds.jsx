import React, { useState, useEffect } from 'react';
import { FaInfoCircle, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AdminRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState('');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processStatus, setProcessStatus] = useState('');
  const [adminReason, setAdminReason] = useState('');
  const [selectedRefund, setSelectedRefund] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/admin/refunds');
      console.log('Fetched refunds data structure:', {
        count: data.length,
        firstItem: data[0] ? {
          id: data[0]._id,
          user: data[0].user,
          isPaid: data[0].isPaid,
          refundStatus: data[0].refundStatus,
          totalPrice: data[0].totalPrice,
          refundReason: data[0].refundReason
        } : null
      });
      setRefunds(data);
    } catch (err) {
      console.error('Error fetching refunds:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }
      setError(err.response?.data?.message || 'Failed to fetch refunds');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRefund = (refund, status) => {
    setSelectedRefund(refund);
    setProcessStatus(status);
    setShowProcessModal(true);
  };

  const closeModal = () => {
    setShowProcessModal(false);
    setAdminReason('');
    setProcessStatus('');
    setSelectedRefund(null);
    setProcessingId('');
  };

  const submitRefundProcess = async () => {
    if (!adminReason.trim()) {
      setError('Please provide a reason for your decision');
      return;
    }

    try {
      setProcessingId(selectedRefund._id);
      const response = await axiosInstance.put(`/admin/refunds/${selectedRefund._id}/process`, {
        status: processStatus,
        adminReason: adminReason.trim()
      });
      
      // Close modal and reset states
      closeModal();
      
      // Show success message
      alert(`Refund request ${processStatus} successfully`);
      
      // Force refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      console.error('Error processing refund:', err);
      setError(err.response?.data?.message || 'Failed to process refund');
      setProcessingId('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin h-8 w-8 text-teal-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Refund Requests</h1>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin h-8 w-8 text-teal-600" />
            </div>
          ) : refunds.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No refund requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {refunds.map((refund) => {
                    console.log('Rendering refund:', {
                      id: refund._id,
                      user: refund.user,
                      isPaid: refund.isPaid,
                      refundStatus: refund.refundStatus,
                      totalPrice: refund.totalPrice,
                      refundReason: refund.refundReason
                    });
                    return (
                      <tr key={refund._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {refund._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {refund.user?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          LKR {refund.totalPrice?.toLocaleString() || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {refund.refundReason || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${refund.refundStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                refund.refundStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'}`}>
                              {refund.refundStatus || 'No Status'}
                            </span>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${refund.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {refund.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleProcessRefund(refund, 'approved')}
                              disabled={processingId === refund._id || refund.refundStatus !== 'pending' || !refund.isPaid}
                              className="p-2 text-green-600 hover:text-green-900 rounded-full hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={!refund.isPaid ? "Cannot process refund for unpaid order" : "Approve Refund"}
                            >
                              {processingId === refund._id ? (
                                <FaSpinner className="animate-spin h-5 w-5" />
                              ) : (
                                <FaCheck className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleProcessRefund(refund, 'rejected')}
                              disabled={processingId === refund._id || refund.refundStatus !== 'pending' || !refund.isPaid}
                              className="p-2 text-red-600 hover:text-red-900 rounded-full hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={!refund.isPaid ? "Cannot process refund for unpaid order" : "Reject Refund"}
                            >
                              {processingId === refund._id ? (
                                <FaSpinner className="animate-spin h-5 w-5" />
                              ) : (
                                <FaTimes className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Process Refund Modal */}
      {showProcessModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {processStatus === 'approved' ? 'Approve' : 'Reject'} Refund Request
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="adminReason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for {processStatus === 'approved' ? 'approval' : 'rejection'}
              </label>
              <textarea
                id="adminReason"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={adminReason}
                onChange={(e) => setAdminReason(e.target.value)}
                placeholder={`Enter your reason for ${processStatus === 'approved' ? 'approving' : 'rejecting'} this refund request...`}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={submitRefundProcess}
                disabled={processingId === selectedRefund?._id}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {processingId === selectedRefund?._id ? (
                  <FaSpinner className="animate-spin h-5 w-5 mx-auto" />
                ) : (
                  `${processStatus === 'approved' ? 'Approve' : 'Reject'} Refund`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRefunds; 