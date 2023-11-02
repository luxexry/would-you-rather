const express = require('express');
const voice = require('elevenlabs-node');
const cors = require('cors'); // Import the 'cors' package
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());

app.post('/text-to-speech', async (req, res) => {
  try {
    const apiKey = "091352c1b6af8f78ef5671bd173cae93";
    const voiceID = "pNInz6obpgDQGcFmaJgB";
    const fileName = "AI.mp3"; // Set the filename
    const text = req.body.text; // Get the text from the client

    await voice.textToSpeech(apiKey, voiceID, fileName, text);

    // Respond with the generated audio file or data
    res.sendFile(fileName, { root: __dirname }); // Adjust the root path as needed
  } catch (error) {
    console.error('Error converting text to speech:', error);
    res.status(500).send('Error converting text to speech');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
