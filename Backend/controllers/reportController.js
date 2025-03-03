import CrimeReport from '../models/reportModel.js';
import User from '../models/userModel.js';
// Delete a report
export const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    // Step 1: Validate the reportId
    if (!mongoose.isValidObjectId(reportId)) {
      return res.status(400).json({ error: 'Invalid report ID.' });
    }

    // Step 2: Find the report
    const report = await CrimeReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    // Step 3: Delete the report
    await CrimeReport.findByIdAndDelete(reportId);

    // Step 4: Respond with success
    res.json({ message: 'Report deleted successfully.' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Create a new crime report
export const reportCrime = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    const reporter = req.user.userId;

    const newReport = new CrimeReport({
      title,
      description,
      location,
      reporter,
    });

    await newReport.save();
    res.status(201).json({ message: 'Crime report created successfully.', report: newReport });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get all reports
export const getReports = async (req, res) => {
  try {
    const reports = await CrimeReport.find().populate('assignedOfficer', 'username');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Update the status of a report
export const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const report = await CrimeReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    report.status = status;
    await report.save();
    res.json({ message: 'Report status updated successfully.', report });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Assign an officer to a report
import mongoose from 'mongoose';

export const assignOfficer = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { officerId } = req.body;

    if (!mongoose.isValidObjectId(officerId)) {
      return res.status(400).json({ error: 'Invalid officer ID.' });
    }

    const report = await CrimeReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    const officer = await User.findById(officerId);
    if (!officer) {
      return res.status(404).json({ error: 'Officer not found.' });
    }

    report.assignedOfficer = officerId;
    await report.save();
    res.json({ message: 'Officer assigned successfully.', report });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error.' });
  }
};


// Search for reports
export const searchReports = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required.' });
    }

    const reports = await CrimeReport.find({
      location: { $regex: location, $options: 'i' },
    }).populate('assignedOfficer', 'username');

    if (reports.length === 0) {
      return res.status(404).json({ error: 'No reports found matching the location.' });
    }

    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get report statistics
export const getReportStats = async (req, res) => {
  try {
    const totalReports = await CrimeReport.countDocuments();
    const pendingReports = await CrimeReport.countDocuments({ status: 'Pending' });
    const resolvedReports = await CrimeReport.countDocuments({ status: 'Resolved' });

    res.json({ totalReports, pendingReports, resolvedReports });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get reports assigned to a specific officer
export const getOfficerReports = async (req, res) => {
  try {
    const { id } = req.params;
    const reports = await CrimeReport.find({ assignedOfficer: id }).populate('assignedOfficer', 'username');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};
