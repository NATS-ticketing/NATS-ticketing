/**
 * Clear service main process
 */
import { connect } from "nats";
import { createNotifyController } from "./controllers/notifyController.js";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { EventEmitter } from "events";

dotenv.config({
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

console.log(process.env.MONGO_URL);

mongoose.connect(`${process.env.MONGO_URL}`, { dbName: "ticketing" })
    .catch(err => console.log(err));

mongoose.connection.on('connected', () => console.log('Mongo connected'));
mongoose.connection.on('disconnected', () => console.log('Mogo disconnected'));

const servers = process.env.NATS_URL;
const nc = await connect({
    servers: servers.split(","),
    // debug: true,
});

let emitter = new EventEmitter();

emitter.on("clear", function (session, area, num) {
    // console.log("receive clear event", session, area, num);
    const subject = `ticketing.${session}.notify.${area}`;
    const payload = { "empty": num };
    nc.publish(subject, JSON.stringify(payload));
});

emitter.on("start", function (session) {
    console.log("receive start event", session,);
    const subject = `ticketing.${session}.notify.*`;
    const payload = { "message": "Session is starting ticket sales." };
    nc.publish(subject, JSON.stringify(payload));
});

await createNotifyController(emitter);
console.log("clear service started");