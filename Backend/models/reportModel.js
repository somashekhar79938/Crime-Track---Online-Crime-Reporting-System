import mongoose from 'mongoose';

const reportSchema = mongoose.Schema({
    title: String,
    description: String,
    location: String,
    reporter: String,
    assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'Pending' },
    timestamp: { type: Date, default: Date.now }
});

const CrimeReport = mongoose.model('CrimeReport', reportSchema);
export default CrimeReport;
