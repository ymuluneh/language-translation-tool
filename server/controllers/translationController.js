import { translate } from "../services/translationService.js";

export const translateText = async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please enter text to translate",
      });
    }

    if (!sourceLang || !targetLang) {
      return res.status(400).json({
        success: false,
        error: "Please select both languages",
      });
    }

    const translatedText = await translate(text, sourceLang, targetLang);

    return res.json({
      success: true,
      translatedText,
      sourceLang,
      targetLang,
      isFallback: translatedText === text.toLowerCase(), // Indicate if fallback was used
    });
  } catch (error) {
    console.error("Translation error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      suggestion: "Try shorter text or different languages",
    });
  }
};
