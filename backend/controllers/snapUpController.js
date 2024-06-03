import { snapUpService } from "../service/snapUpService.js";
import { errorMessage } from "../util/errorMsg.js";

export const snapUpController = {
    handle: async (err, msg) => {
        try {
            if (err) {
                console.log("Error: ", err);
                msg?.respond(errorMessage.formatResponse(err.message));
                return;
            }

            const session = msg.subject.split(".")[1];
            const area = msg.subject.split(".")[2];
            const count = JSON.parse(msg.data).count;
            const result = await snapUpService.bookSeat(session, area, count);


            if (result === false) {
                msg?.respond(JSON.stringify({
                    "status": "no_seat",
                }));
            }
            else {
                // TODO
                // 照文件格式輸出(成功)
  
                msg?.respond(JSON.stringify({
                    "status": "success",
                    "order": result.order_id,
                    "session_id": result.session_id,
                    "area_id": result.area_id,
                    "seats": result.seats,
                    "seat_status": result.seat_status
                }));
            }

        } catch (error) {
            console.log("Error: ", error);
            msg?.respond(errorMessage.formatResponse(error.message));
        }
    }
};
