// const express = require("express");
// const { GoogleGenAI } = require("@google/genai");
// require("dotenv").config(); // Load environment variables

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // Load API key from .env
// const InsightRoutes = express.Router();

// InsightRoutes.get("/predict-insights", async (req, res) => {
//   console.log("Generating insights...", process.env.GEMINI_API_KEY);

//   try {
//     // Example hospital data
//     const hospitalData = {
//       patientData: [
//         { patientId: "P-1001", age: 45, diagnosis: "Diabetes", lastVisit: "2024-01-15", dischargeDate: "2024-01-20", readmitted: false },
//         { patientId: "P-1002", age: 60, diagnosis: "Heart Disease", lastVisit: "2024-02-01", dischargeDate: "2024-02-05", readmitted: true },
//       ],
//       medicationData: [
//         { patientId: "P-1001", drugs: ["Metformin", "Lisinopril"] },
//         { patientId: "P-1002", drugs: ["Aspirin", "Warfarin"] },
//       ],
//       staffScheduleData: [
//         { date: "2024-03-10", expectedPatientVolume: 200 },
//         { date: "2024-03-11", expectedPatientVolume: 150 },
//       ],
//     };

//     // Construct a prompt for AI analysis
//     const prompt = `
//       Given the following hospital data, generate predictions:

//       1. **Patient Readmission Risk**: Identify patients at risk of readmission.
//       Patient Data: ${JSON.stringify(hospitalData.patientData)}

//       2. **Medication Optimization**: Detect potential drug interactions.
//       Medication Data: ${JSON.stringify(hospitalData.medicationData)}

//       3. **Staff Scheduling**: Predict peak patient volume days.
//       Staff Schedule Data: ${JSON.stringify(hospitalData.staffScheduleData)}
//     `;

//     // Generate AI response using Gemini
//     const response = await ai.models.generateContent({
//       model: "gemini-1.5-flash",
//       contents: prompt,
//     });

//     const insights = response // Extract text response

//     // Return insights to frontend
//     res.json({ insights });
//   } catch (error) {
//     console.error("Error generating insights:", error);
//     res.status(500).json({ error: "Error generating insights" });
//   }
// });

// module.exports = InsightRoutes;



// const express = require("express");
// const { GoogleGenAI } = require("@google/genai");
// require("dotenv").config(); // Load environment variables

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// const InsightRoutes = express.Router();

// InsightRoutes.get("/predict-insights", async (req, res) => {
//   console.log("Generating insights...");

//   try {
//     const hospitalData = {
//       patientData: [
//         { patientId: "P-1001", age: 45, diagnosis: "Diabetes", lastVisit: "2024-01-15", dischargeDate: "2024-01-20", readmitted: false },
//         { patientId: "P-1002", age: 60, diagnosis: "Heart Disease", lastVisit: "2024-02-01", dischargeDate: "2024-02-05", readmitted: true },
//       ],
//       medicationData: [
//         { patientId: "P-1001", drugs: ["Metformin", "Lisinopril"] },
//         { patientId: "P-1002", drugs: ["Aspirin", "Warfarin"] },
//       ],
//       staffScheduleData: [
//         { date: "2024-03-10", expectedPatientVolume: 200 },
//         { date: "2024-03-11", expectedPatientVolume: 150 },
//       ],
//     };

//     const prompt = `
//       Analyze the following hospital data and provide concise predictions for:

//       1. **Patient Readmission Risk**: Identify patients at risk of readmission.
//       2. **Medication Optimization**: Detect potential drug interactions.
//       3. **Staff Scheduling**: Predict peak patient volume days.

//       Data:
//       ${JSON.stringify(hospitalData)}

//       Only return the direct insights, not explanations.
//     `;

//     const response = await ai.models.generateContent({
//       model: "gemini-1.5-flash",
//       contents: prompt,
//     });

//     // Extract text response
//     const textResponse = response.candidates[0].content.parts[0].text;

//     // Extract insights using regex or parsing
//     const insights = {
//       patientReadmissionRisk: textResponse.match(/\*\*Patient Readmission Risk:\*\*\s*(.*)/)?.[1] || "No prediction available",
//       medicationOptimization: textResponse.match(/\*\*Medication Optimization:\*\*\s*(.*)/)?.[1] || "No prediction available",
//       staffScheduling: textResponse.match(/\*\*Staff Scheduling:\*\*\s*(.*)/)?.[1] || "No prediction available",
//     };

//     res.json({ insights });
//   } catch (error) {
//     console.error("Error generating insights:", error);
//     res.status(500).json({ error: "Error generating insights" });
//   }
// });

// module.exports = InsightRoutes;


const express = require("express");
const cron = require("node-cron");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");
const InsightModel = require("../models/InsightModel");
const { getUserFromToken } = require("../utils/auth");
const Patients = require("../models/Patients");
const Shifts = require("../models/Shifts");
const Schedule = require("../models/Schedule");
const Appointment = require("../models/Appointment");

dotenv.config();
const InsightRoutes = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Function to generate insights
// async function generateInsights() {
//     console.log("Generating insights.......................................................................");
//     try {
//         let { org_id, isSuperAdmin } = await getUserFromToken(req);
//         const filter = isSuperAdmin ? {} : { org_id };

//         const patients = await Patients.find(filter)
//             .populate("doctorAssigned")
//             .populate("room")
//             .populate("appointments")
//             .populate({
//                 path: "prescriptions.prescriptionId",
//                 model: "Prescription",
//             });



//         const shifts = await Shifts.find({ org_id }).populate("staffId org_id");
//         let schedules;

//         // If the user is a super admin, return all schedules from all organizations
//         if (isSuperAdmin) {
//             schedules = await Schedule.find().populate("doctorId");
//         } else {
//             // If the user is part of an organization, only return schedules for that organization
//             schedules = await Schedule.find({ org_id }).populate("doctorId");
//         }
//         if (!isSuperAdmin) {

//                     const appointment = await Appointment.findById(req.params.id, { org_id }).populate("patientId doctorId");


//                 }
//                 else {
//                     const appointment = await Appointment.findById(req.params.id).populate("patientId doctorId");


//                 }



//         // Calculate the number of slots and available slots for each schedule
//         const schedulesWithSlotCount = schedules.map(schedule => {
//             const totalSlots = schedule.slots.length;
//             const availableSlots = schedule.slots.filter(slot => slot.status === 'available').length;
//             const filledSlots = totalSlots - availableSlots;

//             return {
//                 ...schedule.toObject(),
//                 totalSlots,
//                 availableSlots,
//                 filledSlots
//             };
//         });

//             const hospitalData = {
//                 patientData: patients.map((patient) => ({
//                     patientId: patient._id,
//                     age: patient.age,
//                     diagnosis: patient.diagnosis,
//                     lastVisit: patient.lastVisit,
//                     dischargeDate: patient.dischargeDate,
//                     readmitted: patient.readmitted,
//                 })),
//                 medicationData: patients.map((patient) => ({
//                     patientId: patient._id,
//                     drugs: patient.prescriptions?.map((prescription) => ({
//                         prescriptionId: prescription.prescriptionId?._id,
//                         medicines: prescription.prescriptionId?.prescription.map((med) => ({
//                             medicineName: med.medicineName,
//                             dosage: med.dosage,
//                             duration: med.duration,
//                             instructions: med.instructions,
//                         })),
//                         diagnosis: prescription.prescriptionId?.diagnosis,
//                         consultationDate: prescription.prescriptionId?.consultationDate,
//                         doctor: prescription.prescriptionId?.doctor,
//                         filled: prescription.prescriptionId?.filled,
//                     })) || [],
//                 })),
//                 staffScheduleData: [
//                     { date: "2024-03-10", expectedPatientVolume: 200 },
//                     { date: "2024-03-11", expectedPatientVolume: 150 },
//                 ],
//             };

//             const prompt = `
//       Analyze the following hospital data and provide concise, bullet-point insights for:
//       1. Patient Readmission Risk (e.g., "3 patients have high readmission risk.")
//       2. Medication Optimization (e.g., "Potential drug interaction detected.")
//       3. Staff Scheduling (e.g., "High patient volume predicted next Tuesday.")

//       Data:
//       ${JSON.stringify(hospitalData)}

//       Only return three lines, one for each insight.
//     `;

//             const response = await ai.models.generateContent({
//                 model: "gemini-1.5-flash",
//                 contents: prompt,
//             });

//             const textResponse = response.candidates[0].content.parts[0].text;
//             const lines = textResponse.split("\n").filter(line => line.trim() !== "");

//             const newInsights = {
//                 patientReadmissionRisk: lines[0] || "No prediction available",
//                 medicationOptimization: lines[1] || "No prediction available",
//                 staffScheduling: lines[2] || "No prediction available",
//             };

//             // Store in MongoDB (replace the old entry)
//             await InsightModel.findOneAndUpdate({}, { insights: newInsights, lastUpdated: new Date() }, { upsert: true });

//             console.log("✅ Insights updated:", newInsights);
//         } catch (error) {
//             console.error("❌ Error generating insights:", error);
//         }
//     }
async function generateInsights(req) {
    // console.log("🔍 Generating hospital insights...");

    try {
        // ✅ Extract user details from token
        let { org_id, isSuperAdmin } = await getUserFromToken(req);
        const filter = isSuperAdmin ? {} : { org_id };

        // ✅ Fetch Patient Data
        const patients = await Patients.find(filter)
            .populate("doctorAssigned")
            .populate("room")
            .populate("appointments")
            .populate({
                path: "prescriptions.prescriptionId",
                model: "Prescription",
            });

        // ✅ Fetch Staff Shift Data
        const shifts = await Shifts.find({ org_id }).populate("staffId org_id");

        // ✅ Fetch Appointment & Schedule Data
        let schedules = isSuperAdmin
            ? await Schedule.find().populate("doctorId")
            : await Schedule.find({ org_id }).populate("doctorId");

        const appointments = await Appointment.find(filter).populate("patientId doctorId");

        // ✅ Calculate Available & Filled Slots in Schedules
        const schedulesWithSlotCount = schedules.map(schedule => {
            const totalSlots = schedule.slots.length;
            const availableSlots = schedule.slots.filter(slot => slot.status === 'available').length;
            return {
                ...schedule.toObject(),
                totalSlots,
                availableSlots,
                filledSlots: totalSlots - availableSlots
            };
        });

        // ✅ Emergency Cases
        const emergencyCases = appointments.filter(app => app.isEmergency).length;

        // ✅ Calculate Bed Occupancy Rate
        const occupiedBeds = patients.filter(p => p.room !== null).length;
        const totalBeds = 500; // Example total bed count (adjust as needed)
        const bedOccupancyRate = ((occupiedBeds / totalBeds) * 100).toFixed(2) + "%";

        // ✅ Doctor-Patient Ratio
        const uniqueDoctors = new Set(patients.map(p => p.doctorAssigned?._id)).size;
        const doctorPatientRatio = uniqueDoctors > 0 ? (patients.length / uniqueDoctors).toFixed(2) : "N/A";

        // ✅ Financial Impact of Readmissions (Assumption: Each readmission costs $2,000)
        const readmissionCount = patients.filter(p => p.readmitted).length;
        const financialImpact = `$${(readmissionCount * 2000).toLocaleString()}`;
        

        // ✅ Hospital Data Object
        const hospitalData = {
            patientData: patients.map(patient => ({
                patientId: patient.id,
                age: patient.age,
                diagnosis: patient.diagnosis,
                lastVisit: patient.lastVisit,
                dischargeDate: patient.dischargeDate,
                readmitted: (patient.admitDetails?.length > 0 
                    ? patient.admitDetails[patient.admitDetails.length - 1] 
                    : null)?.discharge || false
            })),
            medicationData: patients.map(patient => ({
                patientId: patient.id,
                drugs: patient.prescriptions?.map(prescription => ({
                    prescriptionId: prescription.prescriptionId?._id,
                    medicines: prescription.prescriptionId?.prescription.map(med => ({
                        medicineName: med.medicineName,
                        dosage: med.dosage,
                        duration: med.duration,
                        instructions: med.instructions,
                    })),
                    diagnosis: prescription.prescriptionId?.diagnosis,
                    consultationDate: prescription.prescriptionId?.consultationDate,
                    doctor: prescription.prescriptionId?.doctor,
                    filled: prescription.prescriptionId?.filled,
                })) || [],
            })),
            staffScheduleData: shifts.map(shift => ({
                date: shift.date,
                staffCount: shift.staffId.length,
            })),
            schedulesWithSlotCount,
            emergencyCases,
            bedOccupancyRate,
            doctorPatientRatio,
            financialImpact,
        };

        // ✅ AI Prompt for Insights
        const prompt = `
Analyze the following hospital data and generate short, one-line insights for:

**Patient Readmission Risk** (e.g., "3 patients have a high readmission risk.")  
**Medication Optimization** (e.g., "Potential drug interaction detected.")  
**Staff Scheduling** (e.g., "High patient volume predicted next Tuesday.")  
**Emergency Case Trends** (e.g., "Spike in emergency cases last weekend.")  
**Bed Occupancy Rate** (e.g., "Hospital beds at 85% capacity.")  
**Doctor-Patient Ratio** (e.g., "Current doctor-to-patient ratio is 1:15.")  
**Appointment Trends** (e.g., "40% increase in appointments this week.")  
**Financial Impact** (e.g., "Readmission costs estimated at $10,000 this month.")  

Only return eight lines, one for each insight.

Data: ${JSON.stringify(hospitalData)}
`;

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
        });
        // console.log("✅ Insights generated:", response);

        const textResponse = response.candidates[0].content.parts[0].text;
        const lines = textResponse.split("\n").filter(line => line.trim() !== "");

        const newInsights = {
            patientReadmissionRisk: lines[0] || "No prediction available",
            medicationOptimization: lines[1] || "No prediction available",
            staffScheduling: lines[2] || "No prediction available",
            emergencyCaseTrends: lines[3] || "No prediction available",
            bedOccupancyRate: lines[4] || "No prediction available",
            doctorPatientRatio: lines[5] || "No prediction available",
            appointmentTrends: lines[6] || "No prediction available",
            financialImpact: lines[7] || "No prediction available",
        };

        await InsightModel.findOneAndUpdate({}, { insights: newInsights, lastUpdated: new Date() }, { upsert: true });

        // console.log("✅ Insights updated:", newInsights);
    } catch (error) {
        // console.error("❌ Error generating insights:", error);
    }
}


cron.schedule("0 0 * * *", () => {
    // console.log("🔄 Running daily insight update...");
    generateInsights(req);
});

InsightRoutes.get("/predict-onces", async (req, res) => {
    try {
        await generateInsights(req);
        res.status(200).json({ message: "Insights updated successfully" });
    } catch (error) {
        // console.error("Error fetching insights:", error);
        res.status(500).json({ error: "Error fetching insights" });
    }
})
// **Run once at startup in case the server was down at midnight**
// generateInsights();

// Route to get the latest stored insights
InsightRoutes.get("/predict-insights", async (req, res) => {
    try {
        const storedInsights = await InsightModel.findOne();
        if (storedInsights) {
            return res.json({ insights: storedInsights.insights });
        }
        res.status(404).json({ error: "No insights available" });
    } catch (error) {
        // console.error("Error fetching insights:", error);
        res.status(500).json({ error: "Error fetching insights" });
    }
});

module.exports = InsightRoutes;