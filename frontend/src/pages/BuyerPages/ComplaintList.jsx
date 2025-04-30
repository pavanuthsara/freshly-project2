import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Configure axios defaults
axios.defaults.withCredentials = true;

function ComplaintList() {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try{
            const response = await axios.get('http://localhost:5000/api/buyers/complaints', {
                withCredentials: true
            });
            setComplaints(response.data);
        } catch(error){
            console.error('Error fetching complaints:', error);
        }
    }

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this complaint?');
        console.log(isConfirmed);
        if(!isConfirmed) return;
        try{
            await axios.delete(`http://localhost:5000/api/buyers/complaints/${id}`, {
                withCredentials: true
            });
            alert('Complaint deleted successfully!');
            fetchComplaints();
        } catch(error){
            console.error('Error deleting complaint:', error);
        }
    }

    const handlePDF = () => {
        window.open('http://localhost:5000/api/checkpdf');
        alert('PDF generated successfully!');
    };

    const [search , setSearch] = useState("");
    console.log(search);

    return(
        <>
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-full mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
                <h1 className="text-3xl font-bold text-center text-gray-800 bg-green-50 py-4 border-b border-gray-200">
                    Your Complaints
                </h1>
    
                <form className="p-6"> 
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search complaints by type..."
                            onChange={(e) => setSearch(e.target.value)} 
                            className="w-full px-4 py-3 pl-10 text-sm text-gray-700 
                            bg-white border border-gray-300 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-green-500 
                            focus:border-transparent 
                            transition duration-300 ease-in-out 
                            shadow-sm hover:shadow-md"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </form>
    
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-green-100">
                            <tr>
                                {['Complaint Type', 'Description', 'Contact No', 'Edit', 'Delete'].map((header) => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-gray-200">
                        {complaints.filter((complaint) => {
                            return search.toLowerCase() === '' ? complaint : complaint.type.toLowerCase().includes(search.toLowerCase())
                        }).map((complaint) => (
                            <tr key={complaint._id} className="hover:bg-gray-50 transition duration-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{complaint.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.contactNo}</td> 
                                <td className="px-6 py-4 whitespace-nowrap text-sm"> 
                                    <Link 
                                        to={`/editComplaint/${complaint._id}`} 
                                        className="text-amber-600 hover:text-amber-900 transition duration-300 font-medium"
                                    >
                                        Edit
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"> 
                                    <button 
                                        onClick={() => handleDelete(complaint._id)}
                                        className="text-red-600 hover:text-red-900 
                                        transition duration-300 
                                        bg-red-100 hover:bg-red-200 
                                        px-3 py-1 rounded-md 
                                        font-medium"
                                    >
                                        Delete
                                    </button> 
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
    
                <div className="p-6 bg-gray-100 flex justify-center">
                    <button 
                        onClick={handlePDF}
                        className="px-6 py-3 mr-4
                        bg-green-600 text-white 
                        rounded-lg 
                        hover:bg-green-700 
                        focus:outline-none focus:ring-2 
                        focus:ring-green-500 focus:ring-opacity-50
                        transition duration-300 
                        shadow-md hover:shadow-lg
                        flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Generate PDF of Complaints
                    </button>
                    
                    <Link to="/">
                    <button
                        className="px-6 py-3 ml-4
                        bg-orange-600 text-white 
                        rounded-lg 
                        hover:bg-orange-700 
                        focus:outline-none focus:ring-2 
                        focus:ring-orange-500 focus:ring-opacity-50
                        transition duration-300 
                        shadow-md hover:shadow-lg
                        flex items-center justify-center"
                    >
                        
                        Add a new Complaint
                    </button> </Link>
                </div>
            </div>
        </div>
        </>
    );
};

export default ComplaintList;
