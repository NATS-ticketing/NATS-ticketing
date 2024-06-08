/***
 * 初始化資料庫資料用
 */
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');

async function init_test_data() {
    dotenv.config({
        path: process.env.NODE_ENV === "prod" ? ".env" : ".env.test",
    });

    const uri = process.env.MONGO_URL;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('ticketing');
        const sessionsCollection = database.collection('sessions');
        const seatsCollection = database.collection('seats');

        await sessionsCollection.drop();
        await seatsCollection.drop();
        console.log('Collections dropped');

        // Create index
        await sessionsCollection.createIndex({ session_id: 1 });
        await seatsCollection.createIndex({ session_id: 1, area_id: 1, seat: 1 });


        const n_minutes = 3; // 開始時間是現在時間的幾分鐘後
        let new_start_time = new Date(Date.now() + n_minutes * 60 * 1000);
        new_start_time.setSeconds(0);
        new_start_time.setMilliseconds(0);

        const sessionObj1 = {
            sessionId: 1,
            session_name: "大仁樓晚會",
            start_time: new_start_time,
            areas: [
                { area_id: 1, area_name: "A區", price: 3000, max_seats: 100 },
                { area_id: 2, area_name: "B區", price: 4000, max_seats: 100 },
                { area_id: 3, area_name: "C區", price: 5000, max_seats: 100 }
            ]
        };

        const sessionObj2 = {
            sessionId: 2,
            session_name: "BABYMONSTER",
            start_time: new_start_time,
            areas: [
                { area_id: 1, area_name: "A區", price: 3000, max_seats: 500 },
                { area_id: 2, area_name: "B區", price: 3500, max_seats: 500 },
                { area_id: 3, area_name: "C區", price: 4000, max_seats: 500 },
                { area_id: 4, area_name: "D區", price: 4500, max_seats: 500 },
                { area_id: 5, area_name: "E區", price: 5000, max_seats: 500 }
            ]
        };

        await insertSessionData(sessionsCollection, seatsCollection, [sessionObj1, sessionObj2]);

    } finally {
        await client.close();
    }
}

async function insertSessionData(sessionsCollection, seatsCollection, sessionObjs) {
    for (let i = 0; i < sessionObjs.length; i++) {
        const sessionId = sessionObjs[i].sessionId;
        const sessionObj = sessionObjs[i];
        const areas = sessionObj.areas;

        await sessionsCollection.insertOne({
            _id: sessionId,
            session_id: sessionId,
            session_name: sessionObj.session_name,
            start_time: new Date(),
            areas: areas
        });

        const seats = [];
        areas.forEach(area => {
            for (let i = 1; i <= area.max_seats; i++) {
                seats.push({
                    session_id: sessionId,
                    area_id: area.area_id,
                    seat: i,
                    seat_status: 0, // 0: empty
                    order: null,
                    expire: null
                });
            }
        });
        // MongoBulkWriteError: Error=16500, RetryAfterMs=10, Details='Response status code does not indicate success:
        // TooManyRequests (429); Substatus: 3200; ActivityId: 877400f0-c041-401e-8455-c33e0fa3ef93; Reason: (
        const insertPerSec = 4000;
        for (let i = 0; i < seats.length; i += insertPerSec) {

            await seatsCollection.insertMany(seats.slice(i, i + insertPerSec));
            await new Promise(r => setTimeout(r, 1000));
            console.log(`Session ${sessionObj.session_name} inserted ${Math.min(seats.length, i + insertPerSec)} seats`);
        }

        console.log(`Session ${sessionObj.session_name} inserted`);
    }
}

module.exports = init_test_data;