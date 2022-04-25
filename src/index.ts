require("dotenv").config();

import { Application } from "express";
import {
    MatrixClient,
    SimpleFsStorageProvider,
    AutojoinRoomsMixin
} from "matrix-bot-sdk"
import fetch from "node-fetch";

import CommandList from "./utils/CommandList";

const express = require("express");
const app: Application = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser")

app.use(bodyParser.json());

const homeserverUrl = process.env.HOMESERVER_URL ?? "https://matrix.org"
const accessToken = process.env.ACCESS_TOKEN ?? "NO_TOKEN_SPECIFIED"

const storage = new SimpleFsStorageProvider("bot.json")

const client = new MatrixClient(homeserverUrl, accessToken, storage)
AutojoinRoomsMixin.setupOnClient(client)

client.on("room.message", (roomId, event) => {
    if (!event["content"]) return
    // console.log(event)
    const sender = event["sender"];
    const body = event["content"]["body"];

    if (body.startsWith(process.env.PREFIX ?? ";")) {
        const command = body.split(" ")[0].replace(process.env.PREFIX ?? ";", "")
        const args = body.split(" ").slice(1)
        CommandList.commands.forEach((v,k) => {
            if (v.toLocaleLowerCase() == command.toLocaleLowerCase()) {
                CommandList.classes[k].run({
                    client,
                    roomId,
                    sender,
                    body,
                    event,
                    args
                })
            }
        });
    }
})

app.use(express.static("public"));

app.post("/api/send", (req, res) => {
    // console.log(req.body)
    fetch(req.body.url.gif.url)
        .then((res: any) => res.arrayBuffer())
        .then((buffer: ArrayBuffer) => {
            //console.log(toBuffer(buffer))
            client.uploadContent(toBuffer(buffer)).then(url => {
                console.log(url)
                client.sendMessage(req.body.roomId, {
                    "msgtype": "m.image",
                    "body": "tenor.gif",
                    "info": {
                        "h": req.body.url.gif.dims[1],
                        "mimetype": "image/gif",
                        "size": req.body.url.gif.size,
                        "w": req.body.url.gif.dims[0]
                    },
                    "url": url
                });
            })
        })
    
    res.json({"message": "ok"})
})

app.listen(port, () => {console.log("WEB SERVER STARTED")})

client.start().then(() => console.log("Client started!"))
function toBuffer(ab: ArrayBuffer) {
    const buf = Buffer.alloc(ab.byteLength);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}