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
        prompt: `${prompt} ?`,
        temperature: 0.3,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    res.status(200).json(response.data);
}
