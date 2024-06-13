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

const order = "1d8f90dd-d570-4414-8ff5-81f44970c073";
let r = await nc.request(`ticketing.1.1.${order}.cancel`, JSON.stringify({
    "seats": "23, 24" 
}), {timeout:5000});

console.log("reply", r.json());

nc.drain();