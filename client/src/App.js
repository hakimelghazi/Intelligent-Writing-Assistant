import React, { useState } from 'react';

function App() {
  const [text, setText] = useState('');
  const [suggestion, setSuggestion] = useState('');

  // Calculate word count
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleGrammarCheck = async () => {
    try {
      const response = await fetch('http://localhost:5001/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setSuggestion(data.suggestion);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          Grammar Check Assistant
        </h1>
        <textarea
          className="w-full p-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="5"
          placeholder="Type your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button
          className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={handleGrammarCheck}
        >
          Check Grammar
        </button>
        {suggestion && (
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-700">Suggestion:</h2>
            <p className="mt-2 p-3 bg-gray-50 border rounded-lg text-gray-800">
              {suggestion}
            </p>
          </div>
        )}
      </div>

      {/* Word Count */}
      <div className="absolute bottom-4 left-4 text-gray-600 text-sm">
        Word Count: {wordCount}
      </div>
    </div>
  );
}

export default App;

