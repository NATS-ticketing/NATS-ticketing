import { connect } from "nats.ws";

let nc;

async function getNatsWSClient() {
  if (!nc) {
    const natsUrl = process.env.NEXT_PUBLIC_NATS_URL;
    if (!natsUrl) {
      throw new Error("NATS_URL is not defined in environment variables");
    }
    console.log("URL:" + natsUrl);
    nc = await connect({
      servers: `ws://${process.env.NEXT_PUBLIC_NATS_IP}:443`,
    });
    console.log(`ws://${process.env.NEXT_PUBLIC_NATS_IP}:443`);
  }
  return nc;
}

export async function subscribeTicketState(subSession, subArea, callback) {
  try {
    const nc = await getNatsWSClient();
    const subject = `ticketing.${subSession}.notify.3`; //${subArea}
    console.log("Subscribing to:", subject);

    const sub = await nc.subscribe(subject, {
      callback: (err, msg) => {
        if (err) {
          console.log("subscription error:", err.message);
          alert("訂閱失敗，請稍後再試");
          return;
        }

        const response = msg.json();
        console.log("Notification response:", response);

        callback(response);
      },
    });
  } catch (err) {
    console.error("Error in subscribeTicketState:", err);
    throw err;
  }
}
