import { useState } from "react";
import axios from "../Api/axios";
import "./TranslationForm.css";

export default function TranslationForm() {
  const [text, setText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [translatedText, setTranslatedText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError("Please enter text to translate");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setTranslatedText("");
      setIsFallback(false);

      const response = await axios.post(
        "/api/translate",
        {
          text: text.trim(),
          sourceLang,
          targetLang,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      if (response.data.success) {
        setTranslatedText(response.data.translatedText);
        setIsFallback(response.data.isFallback);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      let errorMessage = "Translation failed";

      if (error.response) {
        errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          `Error: ${error.response.status}`;
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="translation-container">
      <h1>Language Translator</h1>

      <div className="input-section">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to translate..."
          disabled={isLoading}
        />
      </div>

      <div className="language-selectors">
        <div className="language-selector">
          <label>From:</label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            disabled={isLoading}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="ar">Arabic</option>
            <option value="am">Amharic</option>
          </select>
        </div>

        <div className="language-selector">
          <label>To:</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            disabled={isLoading}
          >
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="am">Amharic</option>
          </select>
        </div>
      </div>

      <button onClick={handleTranslate} disabled={isLoading || !text.trim()}>
        {isLoading ? "Translating..." : "Translate"}
      </button>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={handleTranslate} className="retry-button">
            Try Again
          </button>
        </div>
      )}

      {translatedText && (
        <div className="result-section">
          <h3>Translation Result:</h3>
          <div className="translated-text">
            {translatedText}
            {isFallback && (
              <div className="fallback-notice">
                (Using limited offline translation)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
