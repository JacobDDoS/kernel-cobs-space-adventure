import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import promptSync from "prompt-sync"
const api_model = "gpt-4o" // Makes it easier to change the api model for different level of responses

const prompt = promptSync();
//let OPENAI_API_KEY = prompt("Please enter your API Key: "); // Asks user for API key

const openai = new OpenAI({
    ///apiKey: process.env[OPENAI_API_KEY], // API Key Initialization
  });

// Starter Game Variables
let food = 100
let water = 100
let fuel = 100
let kernel = 100
let distance = 0

// Starter Game Parameters
let planet_scenario = null
let notice = null 
let warning = null


// Parse GPT Outputs
const Step = z.object({
    output: z.string(), // API output
  });

const Popup = z.object({
    header: z.string(), // User input,
    event_name: z.string(),
    desc_header: z.string(),
    desc: z.string(),
    event_rating: z.string(),
    food_adjusted: z.number(),
    water_adjusted: z.number(),
    fuel_adjusted: z.number(),
    kernel_adjusted: z.number(),
    distance_adjusted: z.number(),
    });

const mechanic_dialouge_format = z.object({
        role: z.string(),
        speech: z.string(), // API output
        fuel_adjusted: z.number(),
        kernel_adjusted: z.number(),
        distance_adjusted: z.number(),
      });

const radio_tech_dialouge_format = z.object({
        role: z.string(),
        speech: z.string(), // API output
        fuel_adjusted: z.number(),
        kernel_adjusted: z.number(),
        distance_adjusted: z.number(),
      });

const chef_dialouge_format = z.object({
        role: z.string(),
        speech: z.string(), // API output
        food_adjusted: z.number(),
        water_adjusted: z.number(),
        distance_adjusted: z.number(),
      });

const electrician_dialouge_format = z.object({
        role: z.string(),
        speech: z.string(), // API output
        fuel_adjusted: z.number(),
        distance_adjusted: z.number(),
      });

const navigator_dialouge_format = z.object({
    role: z.string(),
    speech: z.string(), // API output
    food_adjusted: z.number(),
    water_adjusted: z.number(),
    fuel_adjusted: z.number(),
    kernel_adjusted: z.number(),
    distance_adjusted: z.number(),
});

const resources_adjusted = z.object({
    food_adjusted: z.number(),
    water_adjusted: z.number(),
    fuel_adjusted: z.number(),
    kernel_adjusted: z.number(),
    distance_adjusted: z.number(),
});

const resource_hub_adjusted = z.object({
    vendor_dialogue: z.string(),
    food_adjusted: z.number(),
    water_adjusted: z.number(),
    fuel_adjusted: z.number(),
});

const options = z.object({
    option1: z.string(), 
    option1_resources: z.array(resources_adjusted),
    option2: z.string(), 
    option2_resources: z.array(resources_adjusted),
    option3: z.string(), 
    option3_resources: z.array(resources_adjusted),
    });


// Planet Environment - Done
async function Generate_Planet() {
    let user_input_planet = prompt("Describe which planet you want to travel next: "); // Asks user for what planet they want to travel to in the next stage of the game

    const completion = await openai.beta.chat.completions.parse({
    model: api_model,
    messages: [
        { role: "system", content: "You are a spaceship navigation terminal and you are guiding the user to their next location. Describe to the user their next planet environment based on their input in 3 consice sentences." },
        { role: "user", content: user_input_planet},
    ],
    response_format: zodResponseFormat(Step, "planet"),
    });

    const planet_scenario = completion.choices[0].message.parsed;
    console.log(planet_scenario)
}

// Spaceship Navigator Seat Image (1:1 Ratio); Does not take user-input - its initialized upon call - Dalle3 - Done
async function Space_Navigation_Seat_Dalle2() {
    const space_nav_seat_dalle3 = await openai.images.generate({
        model: "dall-e-3",
        prompt: "Generate the inside of a futuristic spaceship filled with technology interfaces. At the center of the image, give a cropped view of an empty navigation seat, showing only the chest and up. Focus on the upper part of the seat, highlighting the backrest, the surrounding dashboard, and any visible control panels. The perspective should emphasize a chest-up shot, without showing the seat below.",
        n: 1,
        size: "1024x1024",
      });
      
      console.log(space_nav_seat_dalle3.data[0].url);
}

// Spaceship Navigator Seat Image (1:1 Ratio); Does not take user-input - its initialized upon call - Dalle2 - Done
async function Space_Navigation_Seat_Dalle3() {
    const response_dalle3 = await openai.images.generate({
        model: "dall-e-2",
        prompt: "Generate the inside of a futuristic spaceship filled with technology interfaces. At the center of the image, give a cropped view of an empty navigation seat, showing only the chest and up. Focus on the upper part of the seat, highlighting the backrest, the surrounding dashboard, and any visible control panels. The perspective should emphasize a chest-up shot, without showing the seat below.",
        n: 1,
        size: "512x512",
      });
    
      console.log(response_dalle3.data[0].url);
}

// Resource Hub - Done
async function Generate_Resource_Hub() {
    const Resource_Hub = await openai.beta.chat.completions.parse({
    model: api_model,
    messages: [
        { role: "system", content: `You are a an alien vendor working at a resource hub where the player approaches you to refill their resources. Generate some dialouge as you interact with the player. 
            In addition, add or subtract inventory for the following resource attributes: food_adjusted, water_adjusted, fuel_adjusted. However, the each of the attributes should be randomly generated values with the range from 0 to the maximum of the following variables: ${food*0.5}, ${water*0.5}, ${fuel*0.5}. 
        Guidelines: Do not generate dialouge for the player. Do not ask the player questions. Keep your sentences concise and as long as 3 sentences.` }
    ],
    response_format: zodResponseFormat(resource_hub_adjusted, "Resource_Hub"),
    });

    const collected_resources = Resource_Hub.choices[0].message.parsed;
    console.log(collected_resources)
}

// Character personalities

// Mechanic - Done
async function Mechanic(notice=null, warning=null, planet_scenario=null) {
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


// Radio Tech - Done
async function Radio_Tech(notice=null, warning=null, planet_scenario=null) {
    const radio_tech_dialogue = await openai.beta.chat.completions.parse({
        model: api_model,
        messages: [
            { role: "system", content: `You are a radio tech character on a futuristic corn spaceship. 
                Your job is to report when you are approaching, docking, and leaving a planet environment in the game. Based on ${notice}, ${warning}, and ${planet_scenario}, generate dialouge to further the story. 
                Based on dialouge, add or subtract fuel for the spaceship (attribute fuel_adjusted), kernel ammo (attribute kernel_adjusted), and distance traveled during dialgoue or event that happens during dialouge (Based on attribute distance_adjusted which can range from (-100,100) ${notice}, ${warning}, and ${planet_scenario}, generate). 
                Guidelines: Structure all speech outputs to be concise 2 sentence explanations explaining the problem and what the 'role' character is going to do about the issue. If planet scenario=null, do not mention any planet names. If planet scenario does not equal null, make sure to use the planet name in dialouge if previously mentioned in gameplay`},
            { role: "user", content: "Based on game events, contribute to the plotline."},
        ],
        response_format: zodResponseFormat(radio_tech_dialouge_format, "Radio_Tech"),
        });
        
        const radio_tech = radio_tech_dialogue.choices[0].message.parsed;
        console.log(radio_tech)
}

// Chef - Done
async function Chef(notice=null, warning=null, planet_scenario=null) {
    const chef_dialogue = await openai.beta.chat.completions.parse({
        model: api_model,
        messages: [
            { role: "system", content: `You are a chef character on a futuristic corn spaceship. 
            Your job is to collect food and water from the game planet environment. Based on ${notice}, ${warning}, and ${planet_scenario}, generate dialouge to further the story. Based on dialouge, add or subtract the food and water inventory, attributes food_adjusted, water_adjusted, respectively and distance traveled during dialgoue or event that happens during dialouge (attribute distance_adjusted which can range from (-100,100) ). 
            Guidelines: Structure all speech outputs to be concise 2 sentence explanations explaining the problem and what the 'role' character is going to do about the issue. If planet scenario=null, do not mention any planet names. If planet scenario does not equal null, make sure to use the planet name in dialouge if previously mentioned in gameplay` },
            { role: "user", content: "Based on game events, contribute to the plotline. "},
        ],
        response_format: zodResponseFormat(chef_dialouge_format, "Chef"),
        });
        
        const chef = chef_dialogue.choices[0].message.parsed;
        console.log(chef)
}

// Electrician - Done
async function Electrician(notice=null, warning=null, planet_scenario=null) {
    const electrician_dialogue = await openai.beta.chat.completions.parse({
        model: api_model,
        messages: [
            { role: "system", content: `You are a electrician character on a futuristic corn spaceship. 
            Your job is to report, repair, or talk about any electrical problems that happen on the corn spaceship. Based on ${notice}, ${warning}, and ${planet_scenario}, generate dialouge to further the story. 
            Based on dialouge, add or subtract fuel for the spaceship (attribute fuel_adjusted) and distance traveled during dialgoue or event that happens during dialouge (attribute distance_adjusted which can range from (-100,100) ). 
            Guidelines: Structure all speech outputs to be concise 2 sentence explanations explaining the problem and what the 'role' character is going to do about the issue. If planet scenario=null, do not mention any planet names. If planet scenario does not equal null, make sure to use the planet name in dialouge if previously mentioned in gameplay` },
            { role: "user", content: "Based on game events, contribute to the plotline. "},
        ],
        response_format: zodResponseFormat(electrician_dialouge_format, "Electrician"),
        });
        
        const electrician = electrician_dialogue.choices[0].message.parsed;
        console.log(electrician)
}

// Navigator - Done
async function Navigator(notice=null, warning=null, planet_scenario=null) {
    const navigator_dialogue = await openai.beta.chat.completions.parse({
        model: api_model,
        messages: [
            { role: "system", content: `You are a navigator character on a futuristic corn spaceship. Your job is to report or talk about any general problems or events that happen on the corn spaceship. Based on ${notice}, ${warning}, and ${planet_scenario}, generate dialouge to further the story. 
            Based on dialouge, add or subtract inventory for the following resource attributes: food_adjusted, water_adjusted, fuel_adjusted, kernel_adjusted, and distance traveled during dialgoue or event that happens during dialouge (attribute distance_adjusted which can range from (-100,100) ). 
            Guidelines: Structure all speech outputs to be concise 2 sentence explanations explaining the problem or event and what the 'role' character is going to do about the issue. If planet scenario=null, do not mention any planet names. If planet scenario does not equal null, make sure to use the planet name in dialouge if previously mentioned in gameplay` },
            { role: "user", content: "Based on game events, contribute to the plotline. "},
        ],
        response_format: zodResponseFormat(navigator_dialouge_format, "Navigator"),
        });
        
        const navigator = navigator_dialogue.choices[0].message.parsed;
        console.log(navigator)
}

// Game Events
// Event/Popup Generator w/ Respective Image Generators
// Generate a notice message - Done
async function Generate_Notice_Message(planet_scenario=null) {
    const notice_message = await openai.beta.chat.completions.parse({
        model: api_model,
        messages: [
            { role: "system", content: `You are a futuristic spaceship navigation software which informs the user of events that happen in the game. 
                Format a notice message that says the following: Your first output should be the word 'NOTICE' with attribute header, your second output should be the name of the event that is about to happen with attribute event_name, your third output should be a 5 word description statement summary of the event with attribute desc_header, and your fourth output should be a consise 2 sentence description of the event with attribute desc, your fifth output would be a rating of the critical of the event ranging form 0-100 with 0 being not critical in player endangerment and 100 is putting the player on the spaceship in extestenial endangerment with attribute event_rating. 
                Based on ${planet_scenario}, generate dialouge to further the story. Based on dialouge, add or subtract inventory for the following resource attributes: food_adjusted, water_adjusted, fuel_adjusted, kernel_adjusted, and distance traveled during dialgoue or event that happens during dialouge (attribute distance_adjusted which can range from (-100,100) ). 
                Guidelines: Only generate events with a critical rating less than or equal to 50. The more critical the event, the more attributes should be depleted and the more distance is traveled. If planet scenario=null, do not mention any planet names. If planet scenario does not equal null, make sure to use the planet name in dialouge if previously mentioned in gameplay`},
            { role: "user", content: "Initialize the next event in a futuristic spaceship game"},
        ],
        response_format:zodResponseFormat(Popup, "Popup")
        });
        
        const notice = notice_message.choices[0].message.parsed;
        console.log(notice)    
}

// Notice Event Image Generator (1:1 Ratio); Does not take user-input - its initialized in tandem with warning/notice messages - Dalle2 - Done
async function Notice_Event_Image_Generator(notice=null) {
    const notice_event_image_generation = await openai.images.generate({
        model: "dall-e-2",
        prompt: `Based on the following futuristic spaceship navigation notice event: ${notice} output, generate an image depicting the space event.`,
        n: 1,
        size: "512x512", //1024x1024
      });
      
      console.log(notice_event_image_generation.data[0].url);    
}


// Notice Options for the player - Done
async function Notice_Player_Options(notice=null) {
    const notice_player_options = await openai.beta.chat.completions.parse({
        model: api_model,
        messages: [
            { role: "system", content: `You are a futuristic spaceship navigation software which informs the user of events that happen in the game. Format a 3 options for the user based on the following game event notice ${notice}. For the outcome of each option, add or subtract inventory for the following resource attributes: food_adjusted, water_adjusted, fuel_adjusted, kernel_adjusted and distance_adjusted ( distance_adjusted which can range from (-100,100) ).
            Guidelines: Do not have communicating with external entities of any kind as an option. Only keep options relating to the player on the ship as availiable choices. `},
        ],
        response_format:zodResponseFormat(options, "Options")
        });
        
        const notice_option = notice_player_options.choices[0].message.parsed;
        console.log(notice_option)
        return notice_option    
}


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
 
// Generate Chill Event - aka. No Danger
async function Generate_Event(planet_scenario=null) {
    const event_message = await openai.beta.chat.completions.parse({
        model: api_model,
        messages: [
            { role: "system", content: `You are a futuristic spaceship navigation software which informs the user of events that happen in the game. Format a warning message that says the following: 
            Your first output should be 'WARNING' with attribute header, your second output should be the name of the event that is about to happen with attribute event_name, your third output should be a 5 word description statement summary of the event with attribute desc_header, and you fourth output should be a consise 2 sentence description of the event with attribute desc, your fifth output would be a rating of the critical of the event ranging form 0-100 with 0 being not critical in player endangerment and 100 is putting the player on the spaceship in extestenial endangerment with attribute event_rating. 
            Based on ${planet_scenario}, generate dialouge to further the story. Based on dialouge, add or subtract inventory for the following resource attributes: food_adjusted, water_adjusted, fuel_adjusted, kernel_adjusted, and distance traveled during dialgoue or event that happens during dialouge (attribute distance_adjusted which can range from (-100,100) ). 
            Guidelines: The more critical the event, the more attributes should be depleted and the more distance is traveled. Only generate events with a critical rating less than or equal to 25. If planet scenario=null, do not mention any planet names. If planet scenario does not equal null, make sure to use the planet name in dialouge if previously mentioned in gameplay`},
        ],
        response_format:zodResponseFormat(Popup, "Event")
        });
        
        const event = event_message.choices[0].message.parsed;
        console.log(event)    
}


// main-ish
/*
const possible_characters = [ // List of characters who can generate dialogue
    function() {Mechanic(notice, warning, planet_scenario)}, 
    function() {Radio_Tech(notice, warning, planet_scenario)}, 
    function() {Chef(notice, warning, planet_scenario)}, 
    function() {Electrician(notice, warning, planet_scenario)}, 
    function() {Navigator(notice, warning, planet_scenario)}]


async function Notice_Sequence(notice, warning, planet_scenario) { // Bringing all of the associated functions together
    notice = await Generate_Notice_Message(notice, warning, planet_scenario)
    let initalize_character = Math.floor(Math.random() * 5);
    possible_characters[initalize_character]();
    options = Notice_Player_Options(notice)
    return options
}

async function Warning_Sequence(notice, warning, planet_scenario) { // Bringing all of the associated functions together
    warning = await Generate_Notice_Message(notice, warning, planet_scenario)
    let initalize_character = Math.floor(Math.random() * 5);
    possible_characters[initalize_character]();
    options = Notice_Player_Options(notice)
    return options
}

const possible_events = [ // List of events that can run
    function() {Notice_Sequence(notice, warning, planet_scenario)}, 
    function() {Warning_Sequence(notice, warning, planet_scenario)}, 
    function() {Generate_Event(notice, warning, planet_scenario)}]


for (let i = 0; i < 1; i++) {
    let planet_scenario = null
    let notice = null 
    let warning = null
    let run_event = null
    let options = null

    if (i == 0) {
        planet_scenario = await Generate_Planet()
    }

    run_event = Math.floor(Math.random() * 3);
    possible_events[run_event]();


  }
*/

const help = await Notice_Player_Options()
const parsed_help = options.parse(help)
//const z_parsed_help = options.parse(parsed_help)
console.log(parsed_help.option1_resources);

//const data = options.parse(help);


/*
const notice_option = notice_player_options.choices[0].message.parsed;
        console.log(notice_option)
        return notice_option  
*/
