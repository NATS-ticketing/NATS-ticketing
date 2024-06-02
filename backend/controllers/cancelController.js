import { orderService } from "../service/orderService.js";
import { errorMessage } from "../util/errorMsg.js";

export const cancelController = {
    handle: async (err, msg) => {
        try {
            if (err) {
                console.log("Error: ", err);
                msg?.respond(errorMessage.formatResponse(err.message));
                return;
            }

            const session = msg.subject.split(".")[1];
            const area = msg.subject.split(".")[2];
            const order = msg.subject.split(".")[3];
            const seats = JSON.parse(msg.data).seats;

            const result = await orderService.cancelOrder(session, area, order, seats);

            if(result === false){
                msg?.respond(JSON.stringify({
                    "status": "error",
                    "message": "cancel failed"
                }));

            }else{
                msg?.respond(JSON.stringify({
                    "status": "success",
                    "session_id": session,
                    "area_id": area,
                    "seats": seats,
                    "seat_status": 0,
                }));
            }


        } catch (error) {
            console.log("Error: ", error);
            msg?.respond(errorMessage.formatResponse(error.message));
        }
    }
};
