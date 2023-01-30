import React from "react";
import { Configuration, OpenAIApi } from "openai";

//configerqtion for the openai api
const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

//create a new instance of the openai api
const openai = new OpenAIApi(config);

//this is the api route that will be called from the client side
export default async function handler(req, res) {

    //check if the secret key is correct
    if (req.body.key !== process.env.NEXT_PUBLIC_API_SECRET_KEY) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    //get the prompt from the request
    const { prompt } = req.body;

    //create a completion
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Create a to-do list for ${prompt} \n`,//wihout numbering and - 
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    //send the response back to the client
    res.status(200).json(response.data);
}
