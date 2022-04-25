import { Payload } from "../utils/Interfaces";

const run = async (payload: Payload) => {
    const { client, roomId, sender, body, event, args } = payload;

    client.sendText(roomId, `${sender} Pong!`);
    console.log(roomId)
}

export default run