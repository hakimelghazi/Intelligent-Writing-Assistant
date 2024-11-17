# Intelligent Writing Assistant

An intelligent writing assistant application that combines grammar checking, autocomplete functionality, and rich text editing features. This project demonstrates a full-stack implementation using React, Node.js, and external APIs.

## Features

### 1. **Grammar Checking**
- Integrated with [LanguageTool API](https://languagetool.org/) for grammar and spelling checks.
- Provides detailed feedback on grammar errors, suggestions for corrections, and context where the error occurred.
- Errors in the text are dynamically highlighted in red, helping users identify and correct mistakes quickly.

### 2. **Autocomplete**
- Predictive text suggestions based on incomplete user input.
- Leverages OpenAI's GPT-4 model for providing short and logical sentence completions.
- Users can accept the suggestions with a single click, seamlessly integrating them into the text.

### 3. **Rich Text Editing Toolbar**
- A customizable toolbar at the top of the editor:
  - Change font size (e.g., 12px, 14px, 16px, etc.).
  - Switch font families (e.g., Arial, Georgia, Courier New, Times New Roman).
  - Toggle bold and italic styles for text.
- Changes in the toolbar dynamically affect the editor's content.

### 4. **Word Count**
- Displays a real-time word count in the tools section, updating dynamically as the user types.

### 5. **Live Feedback Display**
- A dedicated sidebar shows grammar feedback with details such as:
  - Error description.
  - Suggested replacements.
  - The context where the error occurred.

### 6. **Dynamic Highlighting**
- Errors identified by the grammar check are highlighted in the text editor using the `offset` and `length` values from the API response.

---

## Tech Stack

### Frontend
- **React**: For building the interactive user interface.
- **Tailwind CSS**: For styling components and creating a responsive design.

### Backend
- **Node.js + Express**: For building the server-side API.
- **OpenAI API**: Used for autocomplete suggestions and predictive text.
- **LanguageTool API**: Integrated for grammar and spelling checks.

---

## Installation

### Prerequisites
- **Node.js** installed on your machine.
- An **OpenAI API key** (required for autocomplete functionality).
- Access to the **LanguageTool API** (for grammar checking).

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/intelligent-writing-assistant.git
   cd intelligent-writing-assistant

