import { connect } from "nats";
import { stateController } from "./controllers/stateController.js";
import { snapUpController } from "./controllers/snapUpController.js";
import { confirmController } from "./controllers/confirmController.js";
import { cancelController } from "./controllers/cancelController.js";
import { initAreaInfoService } from "./service/areaInfoService.js";
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({
    path: process.env.NODE_ENV === "prod" ? ".env" : ".env.test",
});

console.log(process.env.MONGO_URL);
await mongoose.connect(`${process.env.MONGO_URL}`, { 
    dbName: "ticketing",
    minPoolSize: 10,
    })
    .catch(err => console.log(err));

mongoose.set('bufferCommands', false);
mongoose.connection.on('connected', () => console.log('Mongo connected, minPoolSize:', mongoose.connection.getClient().options.minPoolSize));
mongoose.connection.on('disconnected', () => console.log('Mogo disconnected'));

// const conn = mongoose.createConnection(`${process.env.MONGO_URL}`, { dbName: "ticketing" });

// conn.on('connected', () => console.log('connected'));
// conn.on('open', () => console.log('open'));
// conn.on('disconnected', () => console.log('disconnected'));
// conn.on('reconnected', () => console.log('reconnected'));
// conn.on('disconnecting', () => console.log('disconnecting'));
// conn.on('close', () => console.log('close'));

const servers = process.env.NATS_URL;
const nc = await connect({
    servers: servers.split(","),
    debug: true,
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

await initAreaInfoService();

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


