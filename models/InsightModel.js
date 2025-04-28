const mongoose = require("mongoose");

const InsightSchema = new mongoose.Schema({
  insights: {
    patientReadmissionRisk: String,
    medicationOptimization: String,
    staffScheduling: String,
    emergencyCaseTrends: String,
    bedOccupancyRate: String,
    doctorPatientRatio: String,
    appointmentTrends: String,
    financialImpact: String,
  },
  lastUpdated: { type: Date, default: Date.now },
});

const InsightModel = mongoose.model("Insight", InsightSchema);

module.exports = InsightModel;
