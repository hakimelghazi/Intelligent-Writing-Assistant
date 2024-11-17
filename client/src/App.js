import React, { useState } from "react";

function App() {
  const [text, setText] = useState(""); // User's input
  const [suggestion, setSuggestion] = useState(""); // Autocomplete suggestion
  const [isAutocompleteEnabled, setIsAutocompleteEnabled] = useState(true); // Toggle for autocomplete
  const [errors, setErrors] = useState([]); // Grammar errors

  // Toolbar state
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  // Dynamic editor styles
  const editorStyles = {
    fontSize: `${fontSize}px`,
    fontFamily: fontFamily,
    fontWeight: isBold ? "bold" : "normal",
    fontStyle: isItalic ? "italic" : "normal",
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const userInput = e.target.value;
    setText(userInput);

    if (isAutocompleteEnabled && userInput.trim()) {
      fetchSuggestion(userInput);
    } else {
      setSuggestion(""); // Clear suggestion if autocomplete is disabled
    }
  };

  // Fetch autocomplete suggestions
  const fetchSuggestion = async (input) => {
    try {
      const response = await fetch("http://localhost:5001/autocomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await response.json();
      setSuggestion(data.suggestion || "");
    } catch (error) {
      console.error("Error fetching suggestion:", error);
    }
  };

  // Handle grammar check
  const handleGrammarCheck = async () => {
    try {
      const response = await fetch("http://localhost:5001/check-grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      const grammarErrors = data.matches.map((match) => ({
        message: match.message,
        replacements: match.replacements.map((rep) => rep.value),
        context: match.context.text,
        offset: match.offset,
        length: match.length,
      }));

      setErrors(grammarErrors);
    } catch (error) {
      console.error("Error checking grammar:", error);
    }
  };

  // Render text with highlights
  const renderHighlightedText = () => {
    let highlightedText = [];
    let lastIndex = 0;

    errors.forEach((error, index) => {
      const { offset, length } = error;

      // Add text before the error
      highlightedText.push(
        <span key={`text-${index}`}>
          {text.slice(lastIndex, offset)}
        </span>
      );

      // Add the error span
      highlightedText.push(
        <span
          key={`error-${index}`}
          className="bg-red-200 text-red-700 underline"
        >
          {text.slice(offset, offset + length)}
        </span>
      );

      lastIndex = offset + length;
    });

    // Add remaining text after the last error
    highlightedText.push(
      <span key="end">{text.slice(lastIndex)}</span>
    );

    return highlightedText;
  };

  // Word count logic
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Intelligent Writing Assistant</h1>
        <div className="flex items-center space-x-4">
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[12, 14, 16, 18, 20, 24, 28].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsBold((prev) => !prev)}
            className={`px-4 py-2 border rounded ${
              isBold ? "bg-gray-300 font-bold" : ""
            }`}
          >
            B
          </button>
          <button
            onClick={() => setIsItalic((prev) => !prev)}
            className={`px-4 py-2 border rounded ${
              isItalic ? "bg-gray-300 italic" : ""
            }`}
          >
            I
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Writing Area */}
        <div className="flex-grow p-6">
          <div className="relative w-full h-full border rounded-lg bg-white p-4 shadow-lg">
            {/* Highlighted Text */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={editorStyles}
            >
              {renderHighlightedText()}
            </div>
            <textarea
              className="w-full h-full text-transparent caret-black focus:outline-none resize-none"
              value={text}
              onChange={handleInputChange}
              placeholder="Start typing here..."
              style={{
                ...editorStyles,
                lineHeight: 1.5,
              }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 p-6 bg-white border-l shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Tools</h2>

          {/* Enable Autocomplete */}
          <div className="flex items-center justify-between mb-4">
            <label className="text-gray-700 font-medium">Enable Autocomplete</label>
            <input
              type="checkbox"
              checked={isAutocompleteEnabled}
              onChange={() => setIsAutocompleteEnabled((prev) => !prev)}
              className="w-5 h-5"
            />
          </div>

          {/* Word Count */}
          <div className="mb-4">
            <p className="text-gray-700 font-medium">Word Count</p>
            <p className="text-gray-800 text-lg">{wordCount}</p>
          </div>

          {/* Grammar Check Button */}
          <button
            onClick={handleGrammarCheck}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Check Grammar
          </button>

          {/* Grammar Feedback */}
          {errors.length > 0 && (
            <div className="mt-6">
              <h3 className="text-gray-800 font-bold mb-2">Grammar Feedback:</h3>
              <ul className="space-y-2">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    <p>{error.message}</p>
                    {error.replacements.length > 0 && (
                      <p className="text-green-600">
                        Suggestions: {error.replacements.join(", ")}
                      </p>
                    )}
                    <p className="text-gray-500 italic">
                      Context: {error.context}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Accept Suggestion Button */}
          {suggestion && (
            <button
              onClick={() => setText((prev) => prev + suggestion)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 mt-4"
            >
              Accept Suggestions
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

