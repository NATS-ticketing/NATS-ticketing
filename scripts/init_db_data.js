/***
 * 初始化資料庫資料用
 */
import { MongoClient } from 'mongodb';


async function run() {
    const uri = "mongodb://localhost:27017/"; // CHANGE THIS
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('ticketing');
        const sessionsCollection = database.collection('sessions');
        const seatsCollection = database.collection('seats');

        await sessionsCollection.deleteMany({});
        await seatsCollection.deleteMany({});

        // Create index
        await sessionsCollection.createIndex({ session_id: 1 });
        await seatsCollection.createIndex({ session_id: 1, area_id: 1, seat: 1 });

        const sessionObj1 = {
            sessionId: 1,
            session_name: "大仁樓晚會",
            areas: [
                { area_id: 1, area_name: "A區", price: 3000, max_seats: 100 },
                { area_id: 2, area_name: "B區", price: 4000, max_seats: 100 },
                { area_id: 3, area_name: "C區", price: 5000, max_seats: 100 }
            ]
        };

        const sessionObj2 = {
            sessionId: 2,
            session_name: "BABYMONSTER",
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
                    token: null,
                    expire: null
                });
            }
        });

        await seatsCollection.insertMany(seats);
        console.log(`Session ${sessionObj.session_name} inserted`);
    }
}


run().catch(console.dir);
