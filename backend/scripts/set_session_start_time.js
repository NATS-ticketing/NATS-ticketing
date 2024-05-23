/**
 * Set session start time to n minutes later
 */


import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Session from '../models/sessionModel.js';
import { formatTime } from '../util/formatTime.js';

const n_minutes = 3; // Change this if need

dotenv.config({ path: '../.env' });

mongoose.connect(`${process.env.MONGO_URL}/ticketing`, { dbName: "ticketing" })
    .catch(err => console.log(err));

mongoose.connection.on('connected', () => console.log('Mongo connected'));
mongoose.connection.on('disconnected', () => console.log('Mogo disconnected'));

// Set all session start time to n minutes later
let new_start_time = new Date(Date.now() + n_minutes * 60 * 1000);
new_start_time.setSeconds(0);
new_start_time.setMilliseconds(0);
await Session.updateMany({},
    {
        start_time: new_start_time
    }
);

let sessions = await Session.find();
sessions.forEach(session => {
    console.log(`${session.session_name} start_time: ${session.start_time.toISOString()}`);
    console.log(` -> format_start_time :${formatTime(session.start_time)}\n`);
});

mongoose.connection.close();