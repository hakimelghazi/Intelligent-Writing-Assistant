import React from "react";
import TextSuggestion from "./TextSuggestion"; // Import the TextSuggestion component
import './App.css'; // Keep your existing CSS if any

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Intelligent Writing Assistant</h1>
        <TextSuggestion /> {/* Add the TextSuggestion component */}
      </header>
    </div>
  );
}

export default App;

