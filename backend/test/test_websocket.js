/**
 * Test with websocket
*/

import { connect, StringCodec } from "nats.ws"; 

import dotenv from 'dotenv';

dotenv.config({
    path: process.env.NODE_ENV === "test" ? "../.env.test" : "../.env",
});


console.log(`ws://${process.env.NATS_IP}:443`);
const nc = await connect({ servers: `ws://${process.env.NATS_IP}:443`});


// create a codec
const sc = StringCodec();
// create a simple subscriber and iterate over messages
// matching the subscription
const sub = nc.subscribe("hello");
(async () => {
  for await (const m of sub) {
    console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
  }
  console.log("subscription closed");
})();

nc.publish("hello", sc.encode("world"));
nc.publish("hello", sc.encode("again"));

// we want to insure that messages that are in flight
// get processed, so we are going to drain the
// connection. Drain is the same as close, but makes
// sure that all messages in flight get seen
// by the iterator. After calling drain on the connection
// the connection closes.
await nc.drain();