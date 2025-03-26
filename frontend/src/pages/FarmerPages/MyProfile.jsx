import React, { useState } from 'react';
import { User, MapPin, Edit, Save, X } from 'lucide-react';

const ProfileSection = ({ farmerData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+94 77 123 4567',
    nic: '199845123456',
    farmAddress: {
      streetNo: '123',
      city: 'Colombo',
      district: 'Colombo'
    }
  });

  const [editedData, setEditedData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfileData({ ...editedData });
    setIsEditing(false);
  };

  const handleInputChange = (e, field, subfield = null) => {
    if (subfield) {
      setEditedData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subfield]: e.target.value
        }
      }));
    } else {
      setEditedData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    }
  };

  const renderField = (label, value, field, subfield = null) => (
    <div className="mb-4">
      <h2 className="text-green-700 font-semibold mb-1">{label}</h2>
      {isEditing ? (
        <input
          type="text"
          value={subfield ? editedData[field][subfield] : editedData[field]}
          onChange={(e) => handleInputChange(e, field, subfield)}
          className="w-full px-2 py-1 border-b border-green-200 focus:outline-none focus:border-green-500"
        />
      ) : (
        <p className="text-gray-800">{value}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold text-green-800 flex items-center">
          <User className="mr-3 text-green-600" size={24} />
          My Profile
        </h1>
        
        {!isEditing ? (
          <button 
            onClick={handleEdit}
            className="flex items-center text-green-600 hover:text-green-800"
          >
            <Edit className="mr-1" size={18} /> Edit
          </button>
        ) : (
          <div className="flex space-x-2">
            <button 
              onClick={handleCancel}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <X className="mr-1" size={18} />
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center text-green-600 hover:text-green-800"
            >
              <Save className="mr-1" size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {renderField('Full Name', profileData.name, 'name')}
        {renderField('Email Address', profileData.email, 'email')}
        {renderField('Phone Number', profileData.phone, 'phone')}
        {renderField('NIC Number', profileData.nic, 'nic')}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-green-800 flex items-center">
          <MapPin className="mr-3 text-green-600" size={20} />
          Farm Address
        </h2>
        
        <div className="mt-4 space-y-4">
          {renderField('Street Number', profileData.farmAddress.streetNo, 'farmAddress', 'streetNo')}
          {renderField('City', profileData.farmAddress.city, 'farmAddress', 'city')}
          {renderField('District', profileData.farmAddress.district, 'farmAddress', 'district')}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;