// backend/src/utils/geminiClient.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeFileWithGemini(fileUrl) {
  try {
    // Use whichever model your key supports
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    // For AI Studio key use: "gemini-1.5-flash-latest"

    const prompt = `
      You are an expert medical assistant fluent in English and Roman Urdu.

      Analyze the medical report at this link: ${fileUrl}

      Please respond strictly in **valid JSON** with the following structure:
      {
        "summary": "A short English summary (3-5 sentences)",
        "romanUrduSummary": "The same summary translated in Roman Urdu (3-5 sentences)",
        "questions": [
          "Three thoughtful questions a patient might ask their doctor."
        ]
      }

      Keep your answer short, clear, and use Roman Urdu (not Urdu script) for romanUrduSummary.
      Example Roman Urdu: "Yeh report batati hai ke patient ka blood pressure high hai..."
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // ✅ Remove markdown code fences if present
    text = text
      .replace(/^```json/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    // ✅ Parse safely
    try {
      return JSON.parse(text);
    } catch (err) {
      console.warn("⚠️ Failed to parse JSON. Returning raw text instead.");
      return { summary: text, romanUrduSummary: "", questions: [] };
    }

  } catch (err) {
    console.error("Gemini API error:", err.message || err);
    throw new Error("Gemini AI analysis failed");
  }
}

module.exports = { analyzeFileWithGemini };
