const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();  // Load environment variables from .env file

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse incoming JSON

// test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Listen on port 5001
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



// Example text prediction route
app.post('/predict', (req, res) => {
    const inputText = req.body.text;  // Text sent from frontend
  
    // Simple example: return reversed text as "prediction"
    const prediction = inputText.split('').reverse().join('');
  
    // Send response back to frontend
    res.json({ prediction });
  });

  app.post('/check-grammar', async (req, res) => {
    const { text } = req.body;
    try {
        const response = await axios.post('https://api.languagetoolplus.com/v2/check', {
            text: text,
            language: 'en-US'
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error checking grammar:', error);
        res.status(500).json({ message: 'Error checking grammar' });
    }
});  
  


const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

app.post('/suggestions', async (req, res) => {
    const { text } = req.body;
    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Please improve this sentence: "${text}"`,
            max_tokens: 50,
        });
        const suggestion = response.data.choices[0].text.trim();
        res.json({ suggestion });
    } catch (error) {
        console.error('Error generating suggestions:', error);
        res.status(500).json({ message: 'Error generating suggestions' });
    }
});
