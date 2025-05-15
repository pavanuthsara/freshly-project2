import { GoogleGenAI } from "@google/genai";

export const generateGooglePlan = async(req, res) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_KEY});

    const { description } = req.body;

    const prompt = `Buyer gives following as feedback related to farmer and buyer product selling website related 
                    to vegetables and fruits selling. 
                    ${description}
                    
                    generate a creative response for user below 50 words. use simple english and emojies.`;

    try{
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        res.json({response: response.text});
    } catch(error){
        console.error(`Google api error : ${error}`);
        res.status(500).json({error: 'Google generated fail'})
    }
}