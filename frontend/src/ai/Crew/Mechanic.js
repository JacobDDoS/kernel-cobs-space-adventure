import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";


const mechanic_dialouge_format = z.object({
    role: z.string(),
    speech: z.string(), // API output
    fuel_adjusted: z.number(),
    kernel_adjusted: z.number(),
    distance_adjusted: z.number(),
  });

// Mechanic - Done
async function Mechanic(state, notice=null, warning=null, planet_scenario=null) {
    const mechanic_dialogue = await openai.beta.chat.completions.parse({
        model: api_model,
        messages: [
            { role: "system", content: `You are a mechanic character on a futuristic corn spaceship. 
            Your job is to report, repair, or talk about any mechanical and structural problems only that happen on the corn spaceship. Based on ${notice}, ${warning}, and ${planet_scenario}, generate dialouge to further the story. 
            Based on dialouge, add or subtract fuel for the spaceship (attribute fuel_adjusted), kernel ammo (attribute kernel_adjusted), and distance traveled during dialgoue or event that happens during dialouge (attribute distance_adjusted which can range from (-100,100) ). 
            Guidelines: Structure all speech outputs to be concise 2 sentence explanations explaining the problem and what the 'role' character is going to do about the issue. If planet scenario=null, do not mention any planet names. If planet scenario does not equal null, make sure to use the planet name in dialouge if previously mentioned in gameplay`},
            { role: "user", content: "Based on game events, contribute to the plotline. "},
        ],
        response_format: zodResponseFormat(mechanic_dialouge_format, "Mechanic"),
        });
        
        const mechanic = mechanic_dialogue.choices[0].message.parsed;
        console.log(mechanic)
}


