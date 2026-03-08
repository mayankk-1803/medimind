import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symptoms: [{ type: String }],
  predictedDiseases: [{
    disease: String,
    probability: Number,
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Critical', 'Low', 'High']
    }
  }],
  emergencyDetected: { type: Boolean, default: false },
  precautions: [{ type: String }],
  recommendedDoctors: [{ type: String }],
  notes: { type: String }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
export default Report;
