const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const getPrompt = (text, mode) => {
  if (mode === "short") {
    return `Summarize this in ONE short and sharp sentence:\n${text}`;
  }

  if (mode === "bullet") {
    return `Summarize this into 3-5 bullet points:\n${text}`;
  }

  if (mode === "detailed") {
    return `Provide a detailed and clear summary of this text:\n${text}`;
  }

  if (mode === "exam") {
    return `Convert this into clean exam-ready notes.

Rules:
- Use headings
- Use bullet points
- Keep formatting simple (no excessive symbols)
- Use clean spacing

Text:
${text}`;
  }

  return `Summarize:\n${text}`;
};

const summarizeText = async (text, mode = "short") => {
  try {
    const prompt = getPrompt(text, mode);

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    return response.choices[0]?.message?.content || "Summary not available";
  } catch (error) {
    console.log("AI Error:", error.message);
    return "Summary not available";
  }
};

module.exports = summarizeText;