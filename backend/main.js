import { connect } from "nats";
import { stateController } from "./controllers/stateController.js";
import { snapUpController } from "./controllers/snapUpController.js";
import { confirmController } from "./controllers/confirmController.js";
import { cancelController } from "./controllers/cancelController.js";
import { createNotifyController } from "./controllers/notifyController.js";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { EventEmitter } from "events";

dotenv.config();

mongoose.connect(`${process.env.MONGO_URL}/ticketing`, { dbName: "ticketing" })
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
        stateController.handle(err, msg);
    },
    subject: "*.state",
    metadata: {
        schema: "Get a session's seat state",
    },
});

root.addEndpoint("snapUp", {
    handler: (err, msg) => {
        // TODO
        snapUpController.handle(err, msg);
    },
    subject: "*.*.snapUp",
    metadata: {
        schema: "Snap up a seat",
    },
});


// TODO: 這裡要 發布通知 可能不是直接加入 endpoint
// root.addEndpoint("notify", {
//     handler: (err, msg) => {
//         // TODO

//     },
//     subject: "*.notify.*",
//     metadata: {
//         schema: "Notify a session is going to sell tickets",
//     },
// });

let emitter = new EventEmitter();
emitter.on("clear", function (session, area, num) {
    // TODO
    // publish to subject: "$(session).notify.$(area)"
    // payload {
    //     "empty": $(num)
    // }
});
emitter.on("start", function (session) {
    // TODO
    // publish to subject: "$(session).notify.*",
});
let notifyController = await createNotifyController(emitter);

root.addEndpoint("confirm", {
    handler: (err, msg) => {
        // TODO
        confirmController.handle(err, msg);
    },
    subject: "*.*.*.confirm",
    metadata: {
        schema: "Confirm to buy the ticket",
    },
});

root.addEndpoint("cancel", {
    handler: (err, msg) => {
        // TODO
        cancelController.handle(err, msg);
    },
    subject: "*.*.*.cancel",
    metadata: {
        schema: "Cancel to buy the ticket",
    },
});


