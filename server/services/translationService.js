import axios from "axios";

// LibreTranslate API (free, no key required)
export const translate = async (text, sourceLang, targetLang) => {
  try {
    const response = await axios.post(
      "https://libretranslate.de/translate",
      {
        q: text,
        source: sourceLang,
        target: targetLang,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.data?.translatedText) {
      throw new Error("Invalid response from LibreTranslate");
    }

    return response.data.translatedText;
  } catch (error) {
    throw new Error(
      `Translation failed: ${error.response?.data?.error || error.message}`
    );
  }
};

// import axios from "axios";

// // Replace with your actual API key
// const API_KEY = process.env.API_KEY;

// export const translate = async (text, sourceLang, targetLang) => {
//   try {
//     // Example: Google Translate API
//     const response = await axios.post(
//       `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
//       {
//         q: text,
//         source: sourceLang,
//         target: targetLang,
//       }
//     );
//     return response.data.data.translations[0].translatedText;
//   } catch (error) {
//     throw new Error("Translation API failed");
//   }
// };
