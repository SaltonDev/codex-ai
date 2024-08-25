import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

import axios from 'axios';

dotenv.config();







const app = express();

app.use(cors());

app.use(express.json());
app.use(express.text());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})



app.post('/', async (req, res) => { 
       
/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */



const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
    ],
  });

  const result = await chatSession.sendMessage(`${req.body.prompt}`);
  res.status(200).json({ bot:result.response.text()})
  console.log(result.response.text());
}

run();    
  
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))