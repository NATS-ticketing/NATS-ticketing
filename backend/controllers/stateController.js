import { stateService } from "../service/stateService.js";
import { errorMessage } from "../util/errorMsg.js";

export const stateController = {
    handle: async (err, msg) => {
        try {
            if (err) {
                console.log("Error: ", err);
                msg?.respond(errorMessage.formatResponse(err.message));
                return;
            }

            const session = msg.subject.split(".")[1];
            const state = await stateService.getSeatState(session);

            if (!state) {
                msg?.respond(errorMessage.formatResponse("Session not found"));
            }

            msg?.respond(JSON.stringify({
                session: session,
                state: state
            }));

        } catch (error) {
            console.log("Error: ", error);
            msg?.respond(errorMessage.formatResponse(error.message));
        }
    }
};
