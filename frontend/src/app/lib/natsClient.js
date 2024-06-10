"use server";
import { connect, StringCodec } from "nats";

let nc;

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

export async function subscribeTicketState(subSession, subArea) {
  try {
    const nc = await getNatsClient();
    const subject = `ticketing.${subSession}.notify.${subArea}`;
    console.log("Subscribing to:", subject);

    const sub = nc.subscribe(subject, {
      callback: (err, msg) => {
        if (err) {
          console.log("subscription error:", err.message);
          alert("訂閱失敗，請稍後再試");
          return;
        }

        const data = msg.data;
        console.log("Notification:", data);
        new Notification(
          `釋放票區通知: $(data.area_name) 有 $(data.empty) 個空位`
        );
      },
    });
  } catch (err) {
    console.error("Error in subscribeTicketState:", err);
    throw err;
  }
}
