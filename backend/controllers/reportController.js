import Report from '../models/Report.js';

// @desc    Get user's reports
// @route   GET /api/reports
// @access  Private
export const getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific report by ID
// @route   GET /api/reports/:id
// @access  Private
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!report) return res.status(404).json({ message: "Report not found or not authorized to delete" });
    res.json({ message: 'Report removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
