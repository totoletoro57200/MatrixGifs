import { MatrixClient } from "matrix-bot-sdk";
import { EventEmitter } from "stream";

export interface Payload {
    client: MatrixClient;
    roomId: string;
    sender: string;
    body: string;
    event: EventEmitter;
    args: string[];
}