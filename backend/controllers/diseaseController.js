import Disease from '../models/Disease.js';
import Report from '../models/Report.js';
import Groq from "groq-sdk";

let groq = null;

// @desc    Check Symptoms and Predict Disease
// @route   POST /api/diseases/check
// @access  Private
export const checkSymptoms = async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || symptoms.length === 0) {
    return res.status(400).json({ message: "Please provide symptoms" });
  }

  if (!groq && process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  if (!groq) {
    return res.status(500).json({ message: "Groq API key is not configured on the server." });
  }

  try {
    const prompt = `Based on the following symptoms: ${symptoms.join(', ')}. 
    Analyze and predict possible diseases.
    You must respond ONLY with a valid JSON array of objects.
    Each object must have the following exact schema:
    {
      "disease": "Name of the disease",
      "probability": 85, // number from 0 to 100
      "severity": "Mild", // strictly one of: "Mild", "Moderate", "Critical"
      "precautions": ["precaution 1", "precaution 2"],
      "recommendedSpecialization": "Cardiologist"
    }
    Determine if this is a "Critical" situation. If "Critical", it could be an emergency.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" } // Using standard JSON formatting. We ask for an array, but we can instruct to wrap in an object to ensure validity if needed, but array is fine if parsing. Note: to be safe, we ask for { "predictions": [...] }
    });
    
    // Safety prompt update to wrap in object:
    const safePrompt = `Based on the following symptoms: ${symptoms.join(', ')}. 
    Analyze and predict possible diseases.
    You must respond ONLY with a valid JSON object matching this schema exactly:
    {
      "predictions": [
        {
          "disease": "string",
          "probability": number,
          "severity": "Mild" | "Moderate" | "Critical",
          "precautions": ["string"],
          "recommendedSpecialization": "string"
        }
      ]
    }`;

    const completionResponse = await groq.chat.completions.create({
      messages: [{ role: "user", content: safePrompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
    });

    const aiResponse = completionResponse.choices[0]?.message?.content;
    const parsedData = JSON.parse(aiResponse);
    const predictions = parsedData.predictions || [];

    const isEmergency = predictions.some(p => p.severity === 'Critical');

    // Generate a report
    let allPrecautions = new Set();
    let allDoctors = new Set();
    predictions.forEach(p => {
        if(p.precautions) p.precautions.forEach(prec => allPrecautions.add(prec));
        if(p.recommendedSpecialization) allDoctors.add(p.recommendedSpecialization);
    });

    const report = await Report.create({
        user: req.user._id,
        symptoms,
        predictedDiseases: predictions,
        emergencyDetected: isEmergency,
        precautions: Array.from(allPrecautions),
        recommendedDoctors: Array.from(allDoctors)
    });

    res.json(report);

  } catch (error) {
    console.error("Prediction Error:", error);
    res.status(500).json({ message: "Error predicting diseases. Ensure your symptoms are clear." });
  }
};

// @desc    Search/Get Diseases from DB
// @route   GET /api/diseases
// @access  Public
export const getDiseases = async (req, res) => {
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {};

    try {
        const diseases = await Disease.find({ ...keyword });
        res.json(diseases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
