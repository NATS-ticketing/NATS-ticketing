"use server";
import { connect, StringCodec } from "nats";

let nc;
const sc = StringCodec();

export async function getNatsClient() {
  if (!nc) {
    const natsUrl = process.env.NEXT_PUBLIC_NATS_URL;
    if (!natsUrl) {
      throw new Error("NATS_URL is not defined in environment variables");
    }
    console.log("URL:" + natsUrl);
    nc = await connect({ servers: natsUrl.split(",") });
  }
  return nc;
}

export async function requestTicketState(session) {
  try {
    const nc = await getNatsClient();
    const subject = `ticketing.${session}.state`;

    const msg = await nc.request(subject, "", { timeout: 20000 });
    console.log("msg:" + JSON.stringify(msg.json(), null, 2));
    return msg.json();
  } catch (err) {
    console.error("Error in requestTicketState:", err);
    throw err;
  }
}

// export async function subscribeTicketState(subSession, subArea) {
//   try {
//     const nc = await getNatsClient();
//     const subject = `ticketing.${subSession}.notify.3`; //${subArea}
//     console.log("Subscribing to:", subject);

//     const sub = await nc.subscribe(subject, {
//       callback: (err, msg) => {
//         if (err) {
//           console.log("subscription error:", err.message);
//           alert("訂閱失敗，請稍後再試");
//           return;
//         }

//         // const data = sc.decode(msg.data);
//         // const jsonData = JSON.parse(data);
//         // console.log("Notification jsonData:", jsonData);
//         const response = msg.json();
//         console.log("Notification response:", response);

//         callback(response);
//       },
//     });
//   } catch (err) {
//     console.error("Error in subscribeTicketState:", err);
//     throw err;
//   }
// }

export async function requestSnapUp(session, area, count) {
  try {
    const nc = await getNatsClient();
    const subject = `ticketing.${session}.${area}.snapUp`;

    const msg = await nc.request(
      subject,
      sc.encode(
        JSON.stringify({
          count: count,
        })
      ),
      { timeout: 20000 }
    );

    const response = JSON.parse(sc.decode(msg.data));

    console.log("msg:" + JSON.stringify(response, null, 2));
    return response;
  } catch (err) {
    console.error("Error in requestSnapUp:", err);
    throw err;
  }
}

export async function requestConfirm(session, area, order, seats) {
  try {
    const nc = await getNatsClient();
    const subject = `ticketing.${session}.${area}.${order}.confirm`;

    const msg = await nc.request(
      subject,
      sc.encode(JSON.stringify({ seats: seats })),
      { timeout: 20000 }
    );

    const response = JSON.parse(sc.decode(msg.data));

    console.log("msg:" + JSON.stringify(response, null, 2));
    return response;
  } catch (err) {
    console.error("Error in requestConfirm:", err);
    throw err;
  }
}

export async function requestCancel(session, area, order, seats) {
  try {
    const nc = await getNatsClient();
    const subject = `ticketing.${session}.${area}.${order}.cancel`;

    const msg = await nc.request(
      subject,
      sc.encode(JSON.stringify({ seats: seats })),
      { timeout: 20000 }
    );

    const response = JSON.parse(sc.decode(msg.data));
    console.log("msg:" + JSON.stringify(response, null, 2));
    return response;
  } catch (err) {
    console.error("Error in requestCancel:", err);
    throw err;
  }
}
