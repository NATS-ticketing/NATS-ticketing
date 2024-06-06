/**
 * Justa a simplet client test our server should respond something
 */
import { connect, ServiceError } from "nats";

import dotenv from 'dotenv';

dotenv.config({
    path: process.env.NODE_ENV === "prod" ? "../.env" : "../.env.test",
});

const servers = process.env.NATS_URL;

const nc = await connect({
    servers: servers.split(","),
});

let r = await nc.request("ticketing.1.state");
console.log(JSON.stringify(r.json(), null, 2));
