import Complaint1 from '../models/complaint1.model.js';

const addComplaint = async(req, res) => {
  try {
    console.log('Received complaint data:', req.body);
    console.log('User ID:', req.user._id);

    // Add the user ID from the authenticated user
    const complaintData = {
      ...req.body,
      user: req.user._id
    };
    
    console.log('Creating complaint with data:', complaintData);
    const newComplaint = new Complaint1(complaintData);
    await newComplaint.save();
    
    console.log('Complaint created successfully:', newComplaint);
    res.status(201).json(newComplaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ 
      message: 'Failed to create complaint',
      error: error.message 
    });
  }
};

const showAllComplaints = async(req, res) => {
  try {
    const complaints = await Complaint1.find({ user: req.user._id });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ 
      message: 'Failed to fetch complaints',
      error: error.message 
    });
  }
};

const getComplaintById = async(req, res) => {
  try {
    const complaint = await Complaint1.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    res.status(200).json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ 
      message: 'Failed to fetch complaint',
      error: error.message 
    });
  }
};

const updateComplaint = async(req, res) => {
  try {
    const updateComplaint = await Complaint1.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!updateComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    res.status(200).json(updateComplaint);
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ 
      message: 'Failed to update complaint',
      error: error.message 
    });
  }
};

const deleteComplaint = async(req, res) => {
  try {
    const complaint = await Complaint1.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ 
      message: 'Failed to delete complaint',
      error: error.message 
    });
  }
};

export {
  addComplaint,
  showAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint
}; 