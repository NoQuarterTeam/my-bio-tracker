// This is a mock implementation of the Jina.ai PDF extraction
// In a real application, you would use the Jina.ai API

export async function extractDataFromPdf(pdfBuffer: ArrayBuffer) {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock extracted data
  return {
    testDate: new Date().toISOString(),
    patientInfo: {
      name: "John Doe",
      dob: "1985-05-15",
      gender: "Male",
    },
    markers: [
      {
        id: "cholesterol",
        name: "Total Cholesterol",
        value: 185,
        unit: "mg/dL",
        range: { min: 125, max: 200 },
        category: "lipids",
      },
      {
        id: "hdl",
        name: "HDL Cholesterol",
        value: 62,
        unit: "mg/dL",
        range: { min: 40, max: 60 },
        category: "lipids",
      },
      {
        id: "ldl",
        name: "LDL Cholesterol",
        value: 110,
        unit: "mg/dL",
        range: { min: 0, max: 100 },
        category: "lipids",
      },
      {
        id: "triglycerides",
        name: "Triglycerides",
        value: 120,
        unit: "mg/dL",
        range: { min: 0, max: 150 },
        category: "lipids",
      },
      {
        id: "glucose",
        name: "Glucose",
        value: 95,
        unit: "mg/dL",
        range: { min: 70, max: 99 },
        category: "metabolic",
      },
      {
        id: "hba1c",
        name: "HbA1c",
        value: 5.4,
        unit: "%",
        range: { min: 4.0, max: 5.6 },
        category: "metabolic",
      },
      {
        id: "iron",
        name: "Iron",
        value: 95,
        unit: "μg/dL",
        range: { min: 60, max: 170 },
        category: "blood",
      },
      {
        id: "vitaminD",
        name: "Vitamin D",
        value: 28,
        unit: "ng/mL",
        range: { min: 30, max: 100 },
        category: "vitamins",
      },
      {
        id: "tsh",
        name: "TSH",
        value: 2.5,
        unit: "mIU/L",
        range: { min: 0.4, max: 4.0 },
        category: "hormones",
      },
    ],
  }
}

