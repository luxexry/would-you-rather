const express = require('express');
const path = require('path');
const voice = require('elevenlabs-node');
const cors = require('cors');
// const PlayHT = require('playht');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// PlayHT.init({
//   apiKey: '1d6e63c01f024effb630ec799107f507',
//   userId: '5FxRvCJtjdWcdFxCXonl1Tmlmuy2',
//   defaultVoiceId: 's3://peregrine-voices/oliver_narrative2_parrot_saad/manifest.json',
//   defaultVoiceEngine: 'PlayHT2.0',
// });

// YT VID
// To watch https://www.youtube.com/watch?v=l3TLQuwr4G0
// ^^^^^^^^^^^^^^^^
// ^^^^^^^^^^^^^^^^
// ^^^^^^^^^^^^^^^^
// ^^^^^^^^^^^^^^^^

app.post('/text-to-speech', async (req, res) => {
  try {
    const apiKey = "f0c3f8e88568bd82878f3a9c150f961c";
    const voiceID = "pNInz6obpgDQGcFmaJgB";
    const fileName = "AI.mp3"; // Set the filename
    const targetDirectory = path.join(__dirname, '..'); // Go up one level to the 'Wouldyourather' folder
    const absoluteFilePath = path.join(targetDirectory, fileName); // Set the absolute file path within 'Wouldyourather'
    const text = req.body.text; // Get the text from the client

    // const generated = await PlayHT.generate(text);
    // const { audioUrl } = generated;


    await voice.textToSpeech(apiKey, voiceID, absoluteFilePath, text);

    // Respond with the generated audio file or data
    res.sendFile(absoluteFilePath); // Adjust the root path as needed
    // res.redirect(audioUrl); 
  } catch (error) {
    console.error('Error converting text to speech:', error);
    res.status(500).send('Error converting text to speech');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});