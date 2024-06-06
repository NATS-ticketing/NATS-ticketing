import { connect } from "nats";
import { stateController } from "./controllers/stateController.js";
import { snapUpController } from "./controllers/snapUpController.js";
import { confirmController } from "./controllers/confirmController.js";
import { cancelController } from "./controllers/cancelController.js";
import { createNotifyController } from "./controllers/notifyController.js";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { EventEmitter } from "events";

dotenv.config({
    path: process.env.NODE_ENV === "prod" ? ".env" : ".env.test",
});

console.log(process.env.MONGO_URL);

mongoose.connect(`${process.env.MONGO_URL}`, { dbName: "ticketing" })
    .catch(err => console.log(err));

mongoose.connection.on('connected', () => console.log('Mongo connected'));
mongoose.connection.on('disconnected', () => console.log('Mogo disconnected'));

const servers = process.env.NATS_URL;
const nc = await connect({
    servers: servers.split(","),
});

// Use NATS service API
const srv = await nc.services.add({
    name: `ticketing`,
    version: `0.0.1`,
    description: `ticketing service`,
});

srv.stopped.then((err) => {
    console.log(`service stopped ${err ? err.message : ""}`);
});

const root = srv.addGroup("ticketing");

root.addEndpoint("state", {
    handler: (err, msg) => {
        // TODO
        console.log("state request received.");
        stateController.handle(err, msg);
    },
    subject: "*.state",
    metadata: {
        schema: "Get a session's seat state",
    },
});

root.addEndpoint("snapUp", {
    handler: (err, msg) => {
        console.log("snapUp request received.");
        snapUpController.handle(err, msg);
    },
    subject: "*.*.snapUp",
    metadata: {
        schema: "Snap up a seat",
    },
});

root.addEndpoint("confirm", {
    handler: (err, msg) => {
        // TODO
        console.log("confirm request received.");
        confirmController.handle(err, msg);
    },
    subject: "*.*.*.confirm",
    metadata: {
        schema: "Confirm to buy the ticket",
    },
});

root.addEndpoint("cancel", {
    handler: (err, msg) => {
        console.log("cancel request received.");
        cancelController.handle(err, msg);
    },
    subject: "*.*.*.cancel",
    metadata: {
        schema: "Cancel to buy the ticket",
    },
});


