import React from "react";
import { Configuration, OpenAIApi } from "openai";

//configuration for the openai api
const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

//create a new instance of the openai api
const openai = new OpenAIApi(config);

export default async function handler(req, res) {

    //check if the secret key is correct
    if (req.body.key !== process.env.NEXT_PUBLIC_API_SECRET_KEY) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { prompt } = req.body;

    //create a completion
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${prompt} ?`,
        temperature: 0.3,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    //send the response
    res.status(200).json(response.data);
}
