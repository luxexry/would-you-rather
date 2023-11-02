import * as voice from "elevenlabs-node";

const apiKey = "091352c1b6af8f78ef5671bd173cae93";
const voiceID = "pNInz6obpgDQGcFmaJgB";
const fileName = "audio.mp3";
const textInput = "mozzy is cool";

export function textToSpeech(text) {
  const fileName = "AI.mp3"; // Set the filename to "AI.mp3"
  return new Promise((resolve, reject) => {
    voice
      .textToSpeech(apiKey, voiceID, fileName, text)
      .then(() => {
        resolve(fileName); // Resolve with the filename
      })
      .catch((err) => {
        reject(err);
      });
  });
}

