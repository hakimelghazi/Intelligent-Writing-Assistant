import React, { useState } from "react";
import axios from "axios";

const TextSuggestion = () => {
  const [text, setText] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5001/suggestions", {
        text,
      });
      setSuggestion(response.data.suggestion);
    } catch (error) {
      console.error("Error fetching suggestion:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Text Suggestion</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Type your text here..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Suggestion"}
        </button>
      </form>
      {suggestion && (
        <div>
          <h3>Suggested Text:</h3>
          <p>{suggestion}</p>
        </div>
      )}
    </div>
  );
};

export default TextSuggestion;
