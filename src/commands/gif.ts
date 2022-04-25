import { Payload } from "../utils/Interfaces";

const run = async (payload: Payload) => {
    const { client, roomId, sender, body, event, args } = payload;

    client.sendNotice(roomId, `Cliquez sur ce lien: ${process.env.IP + ":"+process.env.PORT+"/send.html?room=" + encodeURI(roomId)}`);
}

export default run