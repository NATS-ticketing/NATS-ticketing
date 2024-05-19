/**
 * Justa a simplet client test our server should respond something
 */
import { connect, ServiceError } from "nats";

import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
const servers = process.env.NATS_URL;

const nc = await connect({
    servers: servers.split(","),
});

let r = await nc.request("ticketing.0.state");
console.log("reply", r.json());

let r2 = await nc.request("ticketing.99.state");
console.log("reply", r2.json());
nc.drain();