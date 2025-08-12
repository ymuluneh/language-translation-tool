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

  // Supported languages with labels
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "bn", name: "Bengali" },
    { code: "pa", name: "Punjabi" },
    { code: "tr", name: "Turkish" },
    { code: "nl", name: "Dutch" },
    { code: "sv", name: "Swedish" },
    { code: "fi", name: "Finnish" },
    { code: "pl", name: "Polish" },
    { code: "uk", name: "Ukrainian" },
    { code: "am", name: "Amharic" },
    { code: "sw", name: "Swahili" },
    { code: "zu", name: "Zulu" },
    { code: "xh", name: "Xhosa" },
  ];

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

  // Swap source and target languages
  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
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

      <div className="language-controls">
        <div className="language-selector">
          <label>From:</label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            disabled={isLoading}
          >
            {languages.map((lang) => (
              <option key={`source-${lang.code}`} value={lang.code}>
                {lang.name} ({lang.code})
              </option>
            ))}
          </select>
        </div>

        <button
          className="swap-button"
          onClick={swapLanguages}
          disabled={isLoading}
          title="Swap languages"
        >
          ⇄
        </button>

        <div className="language-selector">
          <label>To:</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            disabled={isLoading}
          >
            {languages.map((lang) => (
              <option key={`target-${lang.code}`} value={lang.code}>
                {lang.name} ({lang.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="action-buttons">
        <button
          onClick={handleTranslate}
          disabled={isLoading || !text.trim()}
          className="translate-button"
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Translating...
            </>
          ) : (
            "Translate"
          )}
        </button>
        <button
          onClick={() => {
            setText("");
            setTranslatedText("");
            setError("");
          }}
          disabled={isLoading}
          className="clear-button"
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={handleTranslate} className="retry-button">
            Try Again
          </button>
        </div>
      )}

      {translatedText && (
        <div className={`result-section ${isFallback ? "fallback" : ""}`}>
          <h3>Translation Result:</h3>
          <div className="translated-text">
            {translatedText}
            {isFallback && (
              <div className="fallback-notice">
                (Using limited offline translation)
              </div>
            )}
          </div>
          <div className="translation-meta">
            <span className="language-info">
              {languages.find((l) => l.code === sourceLang)?.name} →{" "}
              {languages.find((l) => l.code === targetLang)?.name}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(translatedText)}
              className="copy-button"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
