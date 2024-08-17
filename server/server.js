import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

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
       
const options = {
    method: 'POST',
    url: 'https://chatgpt-42.p.rapidapi.com/conversationgpt4-2',
    headers: {
      'x-rapidapi-key': process.env.x-rapid-api-key,
      'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      messages: [
        {
          role: 'user',
          content: `${req.body.prompt}`
        }
      ],
      system_prompt: '',
      temperature: 0.9,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 256,
      web_access: false
    }
  };
    
    try {
        const response = await axios.request(options);
        res.status(200).send({
            bot: response.data.result
          });        
         
       
    } catch (error) {
        res.status(500).json({ msg:"failed to fetch"})
    }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))