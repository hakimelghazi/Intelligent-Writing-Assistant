import React, { useState } from "react";
import { Editor, EditorState, ContentState, Modifier } from "draft-js";
import "draft-js/dist/Draft.css";

function App() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty()); // Draft.js editor state
  const [suggestion, setSuggestion] = useState(""); // Autocomplete suggestion
  const [isAutocompleteEnabled, setIsAutocompleteEnabled] = useState(true); // Toggle for autocomplete
  const [wordCount, setWordCount] = useState(0); // Word count
  const [errors, setErrors] = useState([]); // Grammar errors

  // Handle editor changes
  const handleEditorChange = (newState) => {
    setEditorState(newState);

    const content = newState.getCurrentContent().getPlainText();
    setWordCount(content.trim().split(/\s+/).filter(Boolean).length); // Update word count

    if (isAutocompleteEnabled && content.trim()) {
      fetchSuggestion(content);
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

  // Handle accepting the suggestion
  const handleAcceptSuggestion = () => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    const newContent = Modifier.insertText(
      currentContent,
      selection,
      suggestion
    );

    setEditorState(EditorState.push(editorState, newContent, "insert-characters"));
    setSuggestion(""); // Clear suggestion
  };

  // Handle toggle for autocomplete
  const handleToggleAutocomplete = () => {
    setIsAutocompleteEnabled((prev) => !prev);
    setSuggestion(""); // Clear any existing suggestions
  };

  // Grammar check placeholder (not yet fully functional)
  const handleGrammarCheck = async () => {
    const text = editorState.getCurrentContent().getPlainText();

    try {
      const response = await fetch("http://localhost:5001/check-grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      const grammarErrors = data.matches.map((match) => ({
        offset: match.offset,
        length: match.length,
        message: match.message,
      }));

      setErrors(grammarErrors); // Save errors for highlighting
    } catch (error) {
      console.error("Error checking grammar:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Writing Area */}
      <div className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Smart Compose Assistant</h1>
        <div className="relative w-full h-full border rounded-lg bg-white p-4 shadow-lg">
          {/* Draft.js Editor */}
          <Editor
            editorState={editorState}
            onChange={handleEditorChange}
            placeholder="Start typing here..."
          />
          {/* Autocomplete suggestion */}
          {suggestion && (
            <div className="absolute bottom-0 left-0 text-gray-400 mt-2">
              {suggestion}
            </div>
          )}
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
            onChange={handleToggleAutocomplete}
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

        {/* Accept Suggestion Button */}
        {suggestion && (
          <button
            onClick={handleAcceptSuggestion}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 mt-4"
          >
            Accept Suggestion
          </button>
        )}

        {/* Placeholder for future features */}
        <div className="mt-6">
          <p className="text-gray-500 italic">More features coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default App;
