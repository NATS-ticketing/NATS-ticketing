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

const order = "ab706c55-f70c-44a7-863e-d7ec2b673cb5";
let r = await nc.request(`ticketing.1.1.${order}.confirm`, JSON.stringify({
    "seats": [1, 2] 
}));

console.log("reply", r.json());

nc.drain();