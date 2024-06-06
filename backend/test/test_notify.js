/**
 * Justa a simplet client test our server should respond something
 */
import { connect, StringCodec } from "nats";

import dotenv from 'dotenv';

dotenv.config({
    path: process.env.NODE_ENV === "prod" ? "../.env" : "../.env.test",
});

console.log(process.env.NATS_URL);
const nc = await connect({ servers: process.env.NATS_URL});

const sc = StringCodec();

// Snap seats and wait for timeout
const res = await nc.request(`ticketing.1.2.snapUp`,
    sc.encode(JSON.stringify({
        "count": 2
    }))
);
console.log(JSON.stringify(res.json(), null, 2));


// Subscribe to notify
await nc.subscribe("ticketing.1.notify.2", {
    callback: (err, msg) => {
        if(err) {
            console.log(err);
        }
        console.log("got notify", msg.json());
    }
});
