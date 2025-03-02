import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

// Generate a warning message - Done
async function Generate_Warning_Message(planet_scenario=null) {
    const warning_message = await openai.beta.chat.completions.parse({
        model: api_model,
        messages: [
            { role: "system", content: `You are a futuristic spaceship navigation software which informs the user of events that happen in the game. Format a warning message that says the following: 
            Your first output should be 'WARNING' with attribute header, your second output should be the name of the event that is about to happen with attribute event_name, your third output should be a 5 word description statement summary of the event with attribute desc_header, and you fourth output should be a consise 2 sentence description of the event with attribute desc, your fifth output would be a rating of the critical of the event ranging form 0-100 with 0 being not critical in player endangerment and 100 is putting the player on the spaceship in extestenial endangerment with attribute event_rating. 
            Based on ${planet_scenario}, generate dialouge to further the story. Based on dialouge, add or subtract inventory for the following resource attributes: food_adjusted, water_adjusted, fuel_adjusted, kernel_adjusted, and distance traveled during dialgoue or event that happens during dialouge (attribute distance_adjusted which can range from (-100,100) ). 
            Guidelines: The more critical the event, the more attributes should be depleted and the more distance is traveled. Only generate events with a critical rating more than or equal to 50. If planet scenario=null, do not mention any planet names. If planet scenario does not equal null, make sure to use the planet name in dialouge if previously mentioned in gameplay`},
            { role: "user", content: "Initialize the next event in a futuristic spaceship game"},
        ],
        response_format:zodResponseFormat(Popup, "Popup")
        });
        
        const warning = warning_message.choices[0].message.parsed;
        console.log(warning)

}

// Warning Event Image Generator (1:1 Ratio); Does not take user-input - its initialized in tandem with warning/notice messages - Dalle2 - Done
async function Warning_Event_Image_Generator(warning=null) {
    const warning_event_image_generation = await openai.images.generate({
        model: "dall-e-2",
        prompt: `Based on the following futuristic spaceship navigation warning event: ${warning} variable output, generate an image depicting the space event.`,
        n: 1,
        size: "512x512", //1024x1024
      });
      
      console.log(warning_event_image_generation.data[0].url);
}


// Warning Options for the player
async function Warning_Player_Options(warning=null) {
    const warning_player_options = await openai.beta.chat.completions.parse({
        model: api_model,
        messages: [
            { role: "system", content: `You are a futuristic spaceship navigation software which informs the user of events that happen in the game. Format a 3 options for the user based on the following game event warning ${warning}. For the outcome of each option, add or subtract inventory for the following resource attributes: food_adjusted, water_adjusted, fuel_adjusted, kernel_adjusted, and distance_adjusted ( distance_adjusted which can range from (-100,100)).
            Please format all information in the following output:
            option1: z.string(), 
            option1_resources: z.array(resources_adjusted),
            option2: z.string(), 
            option2_resources: z.array(resources_adjusted),
            option3: z.string(), 
            option3_resources: z.array(resources_adjusted),
        Guidelines: Do not have communicating with external entities of any kind as an option. Only keep options relating to the player on the ship as availiable choices. `},
        ],
        response_format:zodResponseFormat(options, "Options")
        });
        
        const warning_option = warning_player_options.choices[0].message.parsed;
        console.log(warning_option)
}