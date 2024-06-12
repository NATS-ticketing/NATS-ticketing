/**
 * Test notify with websocket
*/

// Import 從 nats 換成 nats.ws
// 其他都一樣
import { connect, StringCodec } from "nats.ws"; 

import dotenv from 'dotenv';

dotenv.config({
    path: process.env.NODE_ENV === "test" ? "../.env.test" : "../.env",
});


console.log(`ws://${process.env.NATS_IP}:443`);

const nc = await connect({ servers: `ws://${process.env.NATS_IP}:443`});

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
