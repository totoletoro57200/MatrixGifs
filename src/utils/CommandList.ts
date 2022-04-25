import Ping from '../commands/ping';
import Gif from "../commands/gif"

export default {
    commands: ["ping", "gif"],
    classes: [
        {
            name: "Ping",
            description: "Pong",
            args: [],
            run: Ping
        },
        {
            name: "Gif",
            description: "Gif",
            args: ["Gif Name"],
            run: Gif
        }
    ]
}