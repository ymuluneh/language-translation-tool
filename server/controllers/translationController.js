import { translate } from "../services/translationService.js";

export const translateText = async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    const translatedText = await translate(text, sourceLang, targetLang);
    res.json({ translatedText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
