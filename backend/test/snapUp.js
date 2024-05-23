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

let r = await nc.request("ticketing.1.1.snapUp", JSON.stringify({"count":2}));
console.log("reply", r.json());

nc.drain();