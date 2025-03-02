import Chef from "./Crew/Chef";
import Electrician from "./Crew/Electrician";
import Mechanic from "./Crew/Mechanic";
import Navigator from "./Crew/Navigator";
import Radio_Tech from "./Crew/RadioTech";

function randomDialogue(state) {
    let selectedCrew = Math.floor(Math.random() * 6);

    switch(selectedCrew) {
        case 1:
            Chef(state, true);
            break;
        case 2:
            Electrician(state, true);
            break;
        case 3:
            Mechanic(state, true);
            break;
        case 4:
            Navigator(state, true);
            break;
        case 5:
            Radio_Tech(state, true);
            break;
    }
}

export default randomDialogue;