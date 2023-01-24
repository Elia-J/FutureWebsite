import React from "react";
import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export default async function handler(req, res) {

    if (req.body.key !== process.env.NEXT_PUBLIC_API_SECRET_KEY) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { prompt } = req.body;

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Create a to-do list that does not include numbering and -: ${prompt} \n`,//wihout numbering and - 
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    res.status(200).json(response.data);
}
