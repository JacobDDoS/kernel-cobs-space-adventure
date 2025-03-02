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



const resource_hub_adjusted = z.object({
    vendor_dialogue: z.string(),
    food_adjusted: z.number(),
    water_adjusted: z.number(),
    fuel_adjusted: z.number(),
});
