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