import React, { useState, useEffect } from 'react';
import { User, MapPin, Edit, Save, X } from 'lucide-react';

// Validate name (only letters, spaces, and hyphens)
const validateName = (name) => {
  if (!name || name.trim() === '') return false;
  const nameRegex = /^[A-Za-z\s-]+$/;
  return nameRegex.test(name);
};

// Validate phone number (exactly 10 digits)
const validatePhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

// Validate NIC number (10 digits followed by V or v, or 12 digits)
const validateNIC = (nic) => {
  if (!nic) return false;
  const nicRegex = /^(\d{10}[Vv]|\d{12})$/;
  return nicRegex.test(nic);
};

// Validate street number (maximum 5 digits)
const validateStreetNo = (streetNo) => {
  if (!streetNo || streetNo.trim() === '') return false;
  const streetRegex = /^\d{1,5}$/;
  return streetRegex.test(streetNo);
};

// Validate city and district (only letters, spaces, and hyphens)
const validateLocationName = (name) => {
  if (!name || name.trim() === '') return false;
  const nameRegex = /^[A-Za-z\s-]+$/;
  return nameRegex.test(name);
};

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (!input) return '';
  return input.trim();
};

const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeFields, setActiveFields] = useState({});

  // Fetch farmer profile on component mount
  useEffect(() => {
    const fetchFarmerProfile = async () => {
      try {
        console.log('Fetching profile from /api/farmers/profile');
        const response = await fetch('/api/farmers/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile. Please log in again.');
        }
        const data = await response.json();
        console.log('Profile fetched:', data.farmer);
        setProfileData(data.farmer);
        setEditedData(data.farmer);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch profile. Please log in again.');
        setLoading(false);
        console.error('Profile fetch error:', err);
      }
    };

    fetchFarmerProfile();
  }, []);

  const renderFieldProgress = (field, subfield) => {
    if (field === 'farmAddress' && subfield === 'streetNo') {
      const currentValue = editedData[field]?.[subfield] || '';
      const currentLength = currentValue.length;
      return (
        <div className="absolute right-0 top-1 text-xs">
          <span className={validateStreetNo(currentValue) ? 'text-green-600' : 'text-gray-400'}>
            {currentLength}/5
          </span>
        </div>
      );
    } else if (field === 'farmAddress' && (subfield === 'city' || subfield === 'district')) {
      const currentValue = editedData[field]?.[subfield] || '';
      if (currentValue && !validateLocationName(currentValue)) {
        return (
          <div className="absolute right-0 top-1 text-xs text-red-400">
            Letters, spaces, hyphens only
          </div>
        );
      }
    }
    return null;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setValidationErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(profileData);
    setValidationErrors({});
    setActiveFields({});
  };

  const handleSave = async () => {
    console.log('Saving profile with data:', editedData);
    const errors = {};

    const sanitizedData = {
      ...editedData,
      name: sanitizeInput(editedData.name),
      phone: sanitizeInput(editedData.phone),
      nic: sanitizeInput(editedData.nic),
      farmAddress: {
        ...editedData.farmAddress,
        streetNo: sanitizeInput(editedData.farmAddress?.streetNo),
        city: sanitizeInput(editedData.farmAddress?.city),
        district: sanitizeInput(editedData.farmAddress?.district),
      },
    };

    setEditedData(sanitizedData);

    // Validate only if fields are provided
    if (sanitizedData.name && !validateName(sanitizedData.name)) {
      errors.name = 'Name should contain only letters, spaces, or hyphens';
    }
    if (sanitizedData.phone && !validatePhone(sanitizedData.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }
    if (sanitizedData.nic && !validateNIC(sanitizedData.nic)) {
      errors.nic = 'NIC must be 10 digits followed by V/v or 12 digits';
    }
    if (sanitizedData.farmAddress.streetNo && !validateStreetNo(sanitizedData.farmAddress.streetNo)) {
      errors['farmAddress.streetNo'] = 'Street number must be 1-5 digits';
    }
    if (sanitizedData.farmAddress.city && !validateLocationName(sanitizedData.farmAddress.city)) {
      errors['farmAddress.city'] = 'City should contain only letters, spaces, or hyphens';
    }
    if (sanitizedData.farmAddress.district && !validateLocationName(sanitizedData.farmAddress.district)) {
      errors['farmAddress.district'] = 'District should contain only letters, spaces, or hyphens';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      console.log('Validation errors:', errors);
      return;
    }

    try {
      const response = await fetch('/api/farmers/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sanitizedData.name,
          phone: sanitizedData.phone,
          nic: sanitizedData.nic,
          farmAddress: sanitizedData.farmAddress,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile. Please try again.');
      }
      const data = await response.json();
      console.log('Profile updated:', data.farmer);
      setProfileData(data.farmer);
      setIsEditing(false);
      setValidationErrors({});
      setActiveFields({});
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    }
  };

  const handleInputChange = (e, field, subfield = null) => {
    let value = e.target.value;

    if (field === 'phone') {
      value = value.replace(/\D/g, '').substring(0, 10);
    } else if (field === 'nic') {
      const current = value;
      const is10PlusVFormat = /^\d{0,10}[Vv]?$/.test(current);
      const is12DigitFormat = /^\d{0,12}$/.test(current) && !current.includes('V') && !current.includes('v');

      if (is10PlusVFormat) {
        if (current.length <= 10) {
          value = current.replace(/\D/g, '');
        } else if (current.length === 11) {
          const firstTen = current.substring(0, 10);
          const lastChar = current.charAt(10);
          if (/^\d{10}$/.test(firstTen)) {
            if (/^[Vv]$/.test(lastChar)) {
              value = firstTen + lastChar;
            } else {
              value = firstTen + 'V';
            }
          } else {
            value = firstTen.replace(/\D/g, '');
          }
        } else {
          value = current.substring(0, 11);
        }
      } else if (is12DigitFormat) {
        value = current.replace(/\D/g, '').substring(0, 12);
      } else {
        const digitsOnly = current.replace(/\D/g, '');
        if (current.indexOf('V') === 10 || current.indexOf('v') === 10) {
          const firstTen = digitsOnly.substring(0, 10);
          value = firstTen + (current.indexOf('V') === 10 ? 'V' : 'v');
        } else {
          value = digitsOnly.substring(0, 12);
        }
      }
    } else if (field === 'farmAddress' && subfield === 'streetNo') {
      value = value.replace(/\D/g, '').substring(0, 5);
    } else if (field === 'farmAddress' && (subfield === 'city' || subfield === 'district')) {
      value = value.replace(/[^A-Za-z\s-]/g, '');
    } else if (field === 'name') {
      value = value.replace(/[^A-Za-z\s-]/g, '');
    }

    if (validationErrors[field] || (subfield && validationErrors[`${field}.${subfield}`])) {
      const newErrors = { ...validationErrors };
      if (subfield) {
        delete newErrors[`${field}.${subfield}`];
      } else {
        delete newErrors[field];
      }
      setValidationErrors(newErrors);
    }

    if (subfield) {
      setEditedData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subfield]: value,
        },
      }));
    } else {
      setEditedData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleFocus = (field, subfield = null) => {
    const fieldKey = subfield ? `${field}.${subfield}` : field;
    setActiveFields(prev => ({
      ...prev,
      [fieldKey]: true,
    }));
  };

  const handleBlur = (field, subfield = null) => {
    const fieldKey = subfield ? `${field}.${subfield}` : field;
    const value = subfield ? editedData[field]?.[subfield] : editedData[field];

    let hasError = false;
    if (field === 'name' && value && !validateName(value)) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: 'Name should contain only letters, spaces, or hyphens',
      }));
      hasError = true;
    } else if (field === 'phone' && value && !validatePhone(value)) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: 'Phone number must be exactly 10 digits',
      }));
      hasError = true;
    } else if (field === 'nic' && value && !validateNIC(value)) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: 'NIC must be 10 digits followed by V/v or 12 digits',
      }));
      hasError = true;
    } else if (field === 'farmAddress') {
      if (subfield === 'streetNo' && value && !validateStreetNo(value)) {
        setValidationErrors(prev => ({
          ...prev,
          [`${field}.${subfield}`]: 'Street number must be 1-5 digits only',
        }));
        hasError = true;
      } else if ((subfield === 'city' || subfield === 'district') && value && !validateLocationName(value)) {
        setValidationErrors(prev => ({
          ...prev,
          [`${field}.${subfield}`]: `${subfield === 'city' ? 'City' : 'District'} should contain only letters, spaces, or hyphens`,
        }));
        hasError = true;
      }
    }

    if (!hasError) {
      setActiveFields(prev => {
        const newActiveFields = { ...prev };
        delete newActiveFields[fieldKey];
        return newActiveFields;
      });
    }
  };

  const renderField = (label, value, field, subfield = null) => {
    const fieldKey = subfield ? `${field}.${subfield}` : field;
    const errorMessage = validationErrors[fieldKey] || validationErrors[field];
    const isActive = activeFields[fieldKey];
    const isError = !!errorMessage;

    const getInputProps = () => {
      const baseProps = {
        value: subfield ? editedData[field]?.[subfield] || '' : editedData[field] || '',
        onChange: (e) => handleInputChange(e, field, subfield),
        onFocus: () => handleFocus(field, subfield),
        onBlur: () => handleBlur(field, subfield),
        className: `w-full px-2 py-1 border-b ${
          isError 
            ? 'border-red-500 focus:border-red-700' 
            : isActive
              ? 'border-blue-500 focus:border-blue-700'
              : 'border-green-200 focus:border-green-500'
        } focus:outline-none transition-colors duration-200`,
        disabled: field === 'email',
      };

      if (field === 'farmAddress' && subfield === 'streetNo') {
        return {
          ...baseProps,
          type: 'text',
          maxLength: 5,
          inputMode: 'numeric',
          placeholder: 'Up to 5 digits',
        };
      } else if (field === 'farmAddress' && (subfield === 'city' || subfield === 'district')) {
        return {
          ...baseProps,
          type: 'text',
          placeholder: 'Letters, spaces, and hyphens only',
        };
      } else if (field === 'phone') {
        return {
          ...baseProps,
          type: 'tel',
          maxLength: 10,
          inputMode: 'numeric',
          placeholder: '10 digit number',
        };
      } else if (field === 'nic') {
        return {
          ...baseProps,
          type: 'text',
          maxLength: 12,
          placeholder: '10 digits + V or 12 digits',
        };
      } else if (field === 'name') {
        return {
          ...baseProps,
          type: 'text',
          placeholder: 'Enter your full name',
        };
      }

      return {
        ...baseProps,
        type: 'text',
      };
    };

    const getFieldProgress = () => {
      if (field === 'phone') {
        const currentValue = editedData[field] || '';
        const currentLength = currentValue.length;
        return (
          <div className="absolute right-0 top-1 text-xs">
            <span className={currentLength === 10 ? 'text-green-600' : 'text-gray-400'}>
              {currentLength}/10
            </span>
          </div>
        );
      } else if (field === 'nic') {
        const currentValue = editedData[field] || '';
        const currentLength = currentValue.length;
        const isValid = /^(\d{10}[Vv]|\d{12})$/.test(currentValue);
        const has10DigitsOrLess = /^\d{1,10}$/.test(currentValue);
        const has10DigitsPlusV = /^\d{10}[Vv]$/.test(currentValue);
        const has12Digits = /^\d{1,12}$/.test(currentValue) && !currentValue.includes('V') && !currentValue.includes('v');

        if (has10DigitsPlusV) {
          return (
            <div className="absolute right-0 top-1 text-xs">
              <span className="text-green-600">Valid (10+V format)</span>
            </div>
          );
        } else if (/^\d{12}$/.test(currentValue)) {
          return (
            <div className="absolute right-0 top-1 text-xs">
              <span className="text-green-600">Valid (12-digit format)</span>
            </div>
          );
        } else if (has10DigitsOrLess) {
          return (
            <div className="absolute right-0 top-1 text-xs">
              <span className="text-gray-400">
                {currentLength}/10 digits {currentLength === 10 ? '(add V)' : ''}
              </span>
            </div>
          );
        } else if (has12Digits && currentLength < 12) {
          return (
            <div className="absolute right-0 top-1 text-xs">
              <span className="text-gray-400">{currentLength}/12 digits</span>
            </div>
          );
        }
      }
      return null;
    };

    return (
      <div className="mb-4">
        <h2 className="text-green-700 font-semibold mb-1">{label}</h2>
        {isEditing ? (
          <div className="relative">
            <input
              {...getInputProps()}
            />
            {getFieldProgress()}
            {renderFieldProgress(field, subfield)}
            {isActive && !isError && (
              <div className="absolute -bottom-5 left-0 text-blue-500 text-xs">
                {field === 'name' && 'Only letters, spaces, and hyphens allowed'}
                {field === 'phone' && 'Enter exactly 10 digits'}
                {field === 'nic' && '10 digits + V/v or 12 digits'}
                {field === 'farmAddress' && subfield === 'streetNo' && 'Enter up to 5 digits'}
                {field === 'farmAddress' && (subfield === 'city' || subfield === 'district') && 'Letters, spaces, and hyphens only'}
              </div>
            )}
            {isError && (
              <div className="absolute -bottom-5 left-0 text-red-500 text-xs">
                {errorMessage}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-800">{value || 'Not provided'}</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-green-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-green-800 flex items-center">
            <User className="mr-3 text-green-600" size={24} />
            My Profile
          </h1>
          
          {!isEditing ? (
            <button 
              onClick={handleEdit}
              className="flex items-center text-green-600 hover:text-green-800 transition-colors"
            >
              <Edit className="mr-1" size={18} /> Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button 
                onClick={handleCancel}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="mr-1" size={18} /> Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center text-green-600 hover:text-green-800 transition-colors"
              >
                <Save className="mr-1" size={18} /> Save
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
            {profileData.farmAddress && (
              <>
                {renderField('Street Number', profileData.farmAddress.streetNo, 'farmAddress', 'streetNo')}
                {renderField('City', profileData.farmAddress.city, 'farmAddress', 'city')}
                {renderField('District', profileData.farmAddress.district, 'farmAddress', 'district')}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;