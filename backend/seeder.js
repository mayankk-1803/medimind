import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Disease from './models/Disease.js';

dotenv.config();

const diseases = [
  {
    name: "Common Cold",
    symptoms: ["runny nose", "sore throat", "cough", "congestion", "slight body aches", "mild headache", "sneezing", "low-grade fever"],
    description: "A viral infection of your nose and throat (upper respiratory tract). It's usually harmless, although it might not feel that way.",
    treatment: "Rest, hydration, and over-the-counter medications to relieve symptoms. There is no cure for a cold, but it typically resolves on its own within a week or two.",
    precautions: ["Wash hands frequently", "Avoid close contact with sick people", "Cover your mouth when coughing or sneezing"],
    recommendedSpecialization: "General Physician"
  },
  {
    name: "Influenza (Flu)",
    symptoms: ["fever", "chills", "muscle aches", "cough", "congestion", "runny nose", "headaches", "fatigue"],
    description: "A viral infection that attacks your respiratory system — your nose, throat and lungs. For most people, the flu resolves on its own.",
    treatment: "Rest, plenty of fluids, and sometimes antiviral medications if prescribed early. Over-the-counter pain relievers can help with aches and fever.",
    precautions: ["Get an annual flu vaccine", "Wash hands regularly", "Avoid crowds during peak flu season"],
    recommendedSpecialization: "General Physician"
  },
  {
    name: "Type 2 Diabetes",
    symptoms: ["increased thirst", "frequent urination", "increased hunger", "unintended weight loss", "fatigue", "blurred vision", "slow-healing sores", "frequent infections"],
    description: "A chronic condition that affects the way your body metabolizes sugar (glucose) — an important source of fuel for your body.",
    treatment: "Lifestyle changes including a healthy diet and regular exercise, blood sugar monitoring, diabetes medications, or insulin therapy.",
    precautions: ["Maintain a healthy weight", "Eat a balanced diet", "Exercise regularly", "Monitor blood sugar levels"],
    recommendedSpecialization: "Endocrinologist"
  },
  {
    name: "Hypertension (High Blood Pressure)",
    symptoms: ["headaches", "shortness of breath", "nosebleeds", "dizziness", "chest pain"],
    description: "A common condition in which the long-term force of the blood against your artery walls is high enough that it may eventually cause health problems, such as heart disease.",
    treatment: "Lifestyle modifications like eating a healthier diet with less salt, exercising regularly, and taking medications to lower blood pressure.",
    precautions: ["Reduce sodium intake", "Exercise consistently", "Limit alcohol", "Manage stress", "Avoid smoking"],
    recommendedSpecialization: "Cardiologist"
  },
  {
    name: "Migraine",
    symptoms: ["throbbing pain", "pulsing pain", "nausea", "vomiting", "sensitivity to light", "sensitivity to sound"],
    description: "A neurological condition that can cause multiple symptoms. It's frequently characterized by intense, debilitating headaches.",
    treatment: "Pain-relieving medications, preventive medications, resting in a dark, quiet room, and identifying and avoiding triggers.",
    precautions: ["Identify and avoid triggers", "Establish a regular sleep schedule", "Manage stress", "Stay hydrated"],
    recommendedSpecialization: "Neurologist"
  },
  {
    name: "Asthma",
    symptoms: ["shortness of breath", "chest tightness", "wheezing when exhaling", "coughing fits"],
    description: "A condition in which your airways narrow and swell and may produce extra mucus. This can make breathing difficult and trigger coughing.",
    treatment: "Inhaled corticosteroids, quick-relief medications (inhalers), and avoiding known asthma triggers.",
    precautions: ["Identify and avoid asthma triggers", "Get vaccinated for influenza and pneumonia", "Take prescribed medication regularly"],
    recommendedSpecialization: "Pulmonologist"
  },
  {
    name: "Gastroesophageal Reflux Disease (GERD)",
    symptoms: ["heartburn", "chest pain", "difficulty swallowing", "regurgitation of food or sour liquid", "sensation of a lump in your throat"],
    description: "A digestive disorder that occurs when acidic stomach juices, or food and fluids, back up from the stomach into the esophagus.",
    treatment: "Over-the-counter antacids, H-2-receptor blockers, proton pump inhibitors, and lifestyle/dietary changes.",
    precautions: ["Eat smaller meals", "Don't lie down after eating", "Avoid foods that trigger heartburn", "Elevate the head of your bed"],
    recommendedSpecialization: "Gastroenterologist"
  },
  {
    name: "COVID-19",
    symptoms: ["fever", "chills", "cough", "shortness of breath", "fatigue", "muscle or body aches", "headache", "new loss of taste or smell", "sore throat", "congestion or runny nose", "nausea or vomiting", "diarrhea"],
    description: "An infectious disease caused by the SARS-CoV-2 virus. Most people infected with the virus will experience mild to moderate respiratory illness and recover without requiring special treatment.",
    treatment: "Rest, fluids, over-the-counter medications for symptom relief. Severe cases may require hospitalization, supplemental oxygen, or antiviral medications.",
    precautions: ["Get vaccinated and boosted", "Wear a well-fitting mask in crowded indoor areas", "Practice physical distancing", "Wash hands frequently", "Isolate if you are sick"],
    recommendedSpecialization: "General Physician"
  }
];

const importData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Disease.deleteMany();
    
    // Insert new data
    await Disease.insertMany(diseases);
    
    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
