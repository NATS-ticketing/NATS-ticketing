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

const sc = StringCodec(); // Used for encoding and decoding string messages

export async function requestTicketState(session) {
  try {
    const nc = await getNatsClient();
    // const subject = `ticketing.${session}.state`;

    const msg = await nc.request("ticketing.1.state", "", { timeout: 20000 });
    console.log("msg:" + JSON.stringify(msg.json(), null, 2));
    const res = JSON.stringify(msg.json(), null, 2);
    return msg.json();
  } catch (err) {
    console.error("Error in requestTicketState:", err);
    throw err;
  }
}
