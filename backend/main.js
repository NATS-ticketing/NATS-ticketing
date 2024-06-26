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


mongoose.set('bufferCommands', false);
mongoose.set('debug', true);

console.log(process.env.MONGO_URL);


mongoose.connection.on('connected', () => console.log('Mongo connected, minPoolSize:', mongoose.connection.getClient().options.minPoolSize));
mongoose.connection.on('disconnected', () => console.log('Mongo disconnected'));
mongoose.connection.on('reconnected', () => console.log('Mongo reconnected'));
mongoose.connection.on('close', () => console.log('Mongo close'));
mongoose.connection.on('open', () => console.log('Mongo open'));
mongoose.connection.on('disconnecting', () => console.log('Mongo disconnecting'));


// const conn = mongoose.createConnection(`${process.env.MONGO_URL}`, { dbName: "ticketing" });

// conn.on('connected', () => console.log('connected'));
// conn.on('open', () => console.log('open'));
// conn.on('disconnected', () => console.log('disconnected'));
// conn.on('reconnected', () => console.log('reconnected'));
// conn.on('disconnecting', () => console.log('disconnecting'));
// conn.on('close', () => console.log('close'));

await mongoose.connect(`${process.env.MONGO_URL}`, { 
    dbName: "ticketing",
    minPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    heartbeatFrequencyMS: 2000,
    })
    .catch(err => console.log(err));

const CHECK_DB_INTERVAL = 2000;
setInterval(async() => {
    // 基於某些神奇原因，mongoose 的 heartbeatFrequencyMS 似乎沒有用
    // 所以主動用 ping 來確保連線
    const res = await mongoose.connection.db.admin().ping();
    console.log('Ping result:', res);
}, CHECK_DB_INTERVAL);

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

