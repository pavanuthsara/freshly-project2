import { GoogleGenAI } from "@google/genai";

export const generateFarmerPlan = async(req, res) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_KEY});

    const { cropName, location, landSize, soilType, waterAvailability, budgetRange } = req.body;

    const prompt = `A srilankan farmer lives in ${location} need to grow ${cropName}.
                    Farmer has ${landSize} to grow. The soil type is ${soilType} and water
                    availability is ${waterAvailability}, farmer's budget range is ${budgetRange}.
                    
                    give simple description about 1 sentence and give 5 tips (should be simple) to farmer
                    to grow above crop. give output in English language and translate it into sinhala
                    langue also. use only 40-50 words.`;

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