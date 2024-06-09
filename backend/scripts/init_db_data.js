/***
 * 初始化資料庫資料用
 */
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

async function run() {
  const uri = process.env.MONGO_URL;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("ticketing");
    const sessionsCollection = database.collection("sessions");
    const seatsCollection = database.collection("seats");

    await sessionsCollection.drop();
    await seatsCollection.drop();
    console.log("Collections dropped");

    // Create index
    await sessionsCollection.createIndex({ session_id: 1 });
    await seatsCollection.createIndex({ session_id: 1, area_id: 1, seat: 1 });

    const n_minutes = 3; // 開始時間是現在時間的幾分鐘後
    let new_start_time = new Date(Date.now() + n_minutes * 60 * 1000);
    new_start_time.setSeconds(0);
    new_start_time.setMilliseconds(0);

    const sessionObj1 = {
      sessionId: 1,
      session_name: "aespa LIVE TOUR",
      start_time: new_start_time,
      areas: [
        { area_id: 1, area_name: "VIP 1", price: 6888, max_seats: 100 },
        { area_id: 2, area_name: "VIP 2", price: 6888, max_seats: 120 },
        { area_id: 3, area_name: "特A區", price: 6600, max_seats: 130 },
        { area_id: 4, area_name: "特B區", price: 6600, max_seats: 140 },
        { area_id: 5, area_name: "藍1A-1", price: 5800, max_seats: 150 },
        { area_id: 6, area_name: "藍1A-2", price: 5800, max_seats: 105 },
        { area_id: 7, area_name: "藍2A-1", price: 5800, max_seats: 110 },
        { area_id: 8, area_name: "藍2A-2", price: 5800, max_seats: 100 },
        { area_id: 9, area_name: "藍4A-1", price: 5800, max_seats: 100 },
        { area_id: 10, area_name: "藍4A-2", price: 5800, max_seats: 100 },
        { area_id: 11, area_name: "藍5A-1", price: 5800, max_seats: 100 },
        { area_id: 12, area_name: "藍5A-3", price: 5800, max_seats: 100 },
        { area_id: 13, area_name: "藍3A-1", price: 4800, max_seats: 100 },
        { area_id: 14, area_name: "藍3A-2", price: 4800, max_seats: 100 },
        { area_id: 15, area_name: "藍4B-1", price: 4800, max_seats: 100 },
        { area_id: 16, area_name: "藍4B-2", price: 4800, max_seats: 100 },
        { area_id: 17, area_name: "黃1B-1", price: 5200, max_seats: 100 },
        { area_id: 18, area_name: "黃1B-2", price: 5200, max_seats: 100 },
        { area_id: 19, area_name: "黃2B-1", price: 5200, max_seats: 100 },
        { area_id: 20, area_name: "黃2B-2", price: 5200, max_seats: 100 },
        { area_id: 21, area_name: "黃4B-1", price: 5200, max_seats: 100 },
        { area_id: 22, area_name: "黃4B-2", price: 5200, max_seats: 100 },
        { area_id: 23, area_name: "黃5B-1", price: 5200, max_seats: 100 },
        { area_id: 24, area_name: "黃5B-2", price: 5200, max_seats: 100 },
        { area_id: 25, area_name: "藍2B-1", price: 3800, max_seats: 100 },
        { area_id: 26, area_name: "藍2B-2", price: 3800, max_seats: 100 },
      ],
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
        { area_id: 5, area_name: "E區", price: 5000, max_seats: 500 },
      ],
    };

    const sessionObj3 = {
      sessionId: 3,
      session_name: "大仁樓晚會",
      start_time: new_start_time,
      areas: [
        { area_id: 1, area_name: "A區", price: 3000, max_seats: 100 },
        { area_id: 2, area_name: "B區", price: 4000, max_seats: 100 },
        { area_id: 3, area_name: "C區", price: 5000, max_seats: 100 },
      ],
    };

    await insertSessionData(sessionsCollection, seatsCollection, [
      sessionObj1,
      sessionObj2,
      sessionObj3,
    ]);
  } finally {
    await client.close();
  }
}

async function insertSessionData(
  sessionsCollection,
  seatsCollection,
  sessionObjs
) {
  for (let i = 0; i < sessionObjs.length; i++) {
    const sessionId = sessionObjs[i].sessionId;
    const sessionObj = sessionObjs[i];
    const areas = sessionObj.areas;

    await sessionsCollection.insertOne({
      _id: sessionId,
      session_id: sessionId,
      session_name: sessionObj.session_name,
      start_time: new Date(),
      areas: areas,
    });

    const seats = [];
    areas.forEach((area) => {
      for (let i = 1; i <= area.max_seats; i++) {
        seats.push({
          session_id: sessionId,
          area_id: area.area_id,
          seat: i,
          seat_status: 0, // 0: empty
          order: null,
          expire: null,
        });
      }
    });
    // MongoBulkWriteError: Error=16500, RetryAfterMs=10, Details='Response status code does not indicate success:
    // TooManyRequests (429); Substatus: 3200; ActivityId: 877400f0-c041-401e-8455-c33e0fa3ef93; Reason: (
    const insertPerSec = 4000;
    for (let i = 0; i < seats.length; i += insertPerSec) {
      await seatsCollection.insertMany(seats.slice(i, i + insertPerSec));
      await new Promise((r) => setTimeout(r, 1000));
      console.log(
        `Session ${sessionObj.session_name} inserted ${Math.min(
          seats.length,
          i + insertPerSec
        )} seats`
      );
    }

    console.log(`Session ${sessionObj.session_name} inserted`);
  }
}

run().catch(console.dir);
