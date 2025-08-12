import axios from "axios";
import https from "https";

// Configure axios to ignore SSL errors (for expired certificates)
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

// Reliable translation services with proper error handling
const TRANSLATION_SERVICES = [
  {
    name: "MyMemory",
    url: "https://api.mymemory.translated.net/get",
    method: "GET",
    params: (text, sourceLang, targetLang) => ({
      q: text,
      langpair: `${sourceLang}|${targetLang}`,
    }),
    format: (data) => data.responseData?.translatedText,
  },
  {
    name: "LibreTranslate (Alternate)",
    url: "https://translate.terraprint.co/translate",
    method: "POST",
    data: (text, sourceLang, targetLang) => ({
      q: text,
      source: sourceLang,
      target: targetLang,
    }),
    format: (data) => data.translatedText,
  },
];

// Enhanced fallback translations
const FALLBACK_TRANSLATIONS = {
  "en-es": {
    hello: "hola",
    "good morning": "buenos días",
    "thank you": "gracias",
    "how are you": "cómo estás",
    goodbye: "adiós",
  },
  "es-en": {
    hola: "hello",
    "buenos días": "good morning",
    gracias: "thank you",
    "cómo estás": "how are you",
    adiós: "goodbye",
  },
  // Add more language pairs as needed
};

export const translate = async (text, sourceLang, targetLang) => {
  if (!text?.trim()) throw new Error("No text to translate");
  if (!sourceLang || !targetLang) throw new Error("Language not specified");

  const cleanText = text.trim().toLowerCase();
  const langPair = `${sourceLang}-${targetLang}`;

  // Try each translation service
  for (const service of TRANSLATION_SERVICES) {
    try {
      const response = await (service.method === "GET"
        ? axiosInstance.get(service.url, {
            params: service.params(cleanText, sourceLang, targetLang),
          })
        : axiosInstance.post(
            service.url,
            service.data(cleanText, sourceLang, targetLang)
          ));

      const translatedText = service.format(response.data);
      if (translatedText) return translatedText;
    } catch (error) {
      console.log(`Service ${service.name} failed:`, error.message);
      continue;
    }
  }

  // Fallback to local dictionary
  if (FALLBACK_TRANSLATIONS[langPair]?.[cleanText]) {
    console.log("Using fallback translation");
    return FALLBACK_TRANSLATIONS[langPair][cleanText];
  }

  throw new Error(
    "Translation services unavailable. Try common phrases like 'hello', 'thank you'"
  );
};
