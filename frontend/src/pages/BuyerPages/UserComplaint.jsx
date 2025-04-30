import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserComplaint() {
  const [formData, setFormData] = React.useState({
    type: "",
    contactNo: "",
    description: "",
  });

  const navigate = useNavigate();

  const [error, setError] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name == "contactNo") {
      const mobileNumberRegex = /^(04|07)\d{8}$/;
      if (!mobileNumberRegex.test(value)) {
        setError("Mobile number must be 10 digits and start with 04 or 07.");
      } else {
        setError(""); // Clear error if valid
      }
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      await axios.post('http://localhost:3002/api/complaints', formData);
      alert('Data saved successfully!');
      setFormData({ type: '', contactNo: '', description: '' });
      navigate('/complaintList');
    } catch(error){
      console.error('Error saving data:', error);
    }
  };

  console.log(formData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
            <div className="bg-green-600 text-white p-6">
                <h1 className="text-3xl font-bold text-center tracking-wide">
                    Customer Complaint Form
                </h1>
            </div>

            <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Select Complaint Type
                    </label>
                    <select
                        onChange={handleChange}
                        name="type"
                        className="w-full px-4 py-3 
                        bg-gray-50 border border-gray-300 
                        text-gray-900 text-sm rounded-lg 
                        focus:ring-2 focus:ring-green-500 
                        focus:border-transparent 
                        transition duration-300 
                        appearance-none"
                    >
                        <option value="">Select an option</option>
                        <option value="Technical issue">Technical Issue</option>
                        <option value="Fake seller">Fake Seller</option>
                        <option value="Delivery">Regarding Delivery</option>
                        <option value="Regarding order">Regarding Order</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Contact Number
                    </label>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="contactNo"
                        className="w-full px-4 py-3 
                        bg-white border border-gray-300 
                        text-gray-900 text-sm rounded-lg 
                        focus:ring-2 focus:ring-green-500 
                        focus:border-transparent 
                        transition duration-300"
                        placeholder="Enter your mobile no"
                        required
                    />
                    <p className="mt-2 text-xs text-gray-500">
                        Should contain 10 digits ex:07xxxxxxxx
                    </p>

                    {error && (
                        <p className="mt-2 text-xs text-red-600 animate-pulse">
                            {error}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Complaint Description
                    </label>
                    <textarea
                        onChange={handleChange}
                        name="description"
                        className="w-full px-4 py-3 
                        bg-white border border-gray-300 
                        text-gray-900 text-sm rounded-lg 
                        focus:ring-2 focus:ring-green-500 
                        focus:border-transparent 
                        transition duration-300 
                        min-h-[120px]"
                        placeholder="Enter your complaint"
                        required
                    />
                </div>

                {/* <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Upload Supporting Documents
                    </label>
                    <input
                        name="uploads"
                        className="block w-full text-sm text-gray-600 
                        file:mr-4 file:py-2 file:px-4 
                        file:rounded-full file:border-0 
                        file:text-sm file:font-semibold 
                        file:bg-green-100 file:text-green-700 
                        hover:file:bg-green-200 
                        cursor-pointer"
                        type="file"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                </div> */}

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full py-3 
                        bg-green-600 text-white 
                        font-bold rounded-lg 
                        hover:bg-green-700 
                        focus:outline-none 
                        focus:ring-2 focus:ring-green-500 
                        focus:ring-opacity-50 
                        transition duration-300 
                        transform hover:scale-[1.02] 
                        active:scale-[0.98]"
                    >
                        Submit Complaint
                    </button>
                </div>

                <div className="pt-4">
                    <button
                        className="w-full py-3 
                        bg-orange-600 text-white 
                        font-bold rounded-lg 
                        hover:bg-orange-700 
                        focus:outline-none 
                        focus:ring-2 focus:ring-orange-500 
                        focus:ring-opacity-50 
                        transition duration-300 
                        transform hover:scale-[1.02] 
                        active:scale-[0.98]"
                        onClick={ () => {navigate('/complaintList')}}
                    >
                        Cancel 
                    </button>
                </div>
            </form>
        </div>
    </div>
);
}

export default UserComplaint;