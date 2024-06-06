/**
 * Test notify
 * Usage (type in terminal, in the same directory as this file):
 * NODE_ENV=prod node test_notify.js // connect to our nats
 * node test_notify.js // connect to local nats (.env.test)
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
await nc.subscribe("ticketing.1.notify.1", {
    callback: (err, msg) => {
        if(err) {
            console.log(err);
        }
        console.log("got notify", msg.json());
    }
});

await nc.subscribe("ticketing.1.notify.2", {
    callback: (err, msg) => {
        if(err) {
            console.log(err);
        }
        console.log("got notify", msg.json());
    }
});
