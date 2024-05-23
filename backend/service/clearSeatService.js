import Seat from '../models/seatModel.js'

export const clearSeatService = {
    clear: async (session) => {
        try {
            let seats = await Seat.find({
                "session_id": Number(session),
                "seat_status": 1
            });
            
            // TODO
            // 確認每個座位的expire是否在有效期內 
            // 期效內的移除
            // updateMany -> seat_status: 0 & expire: null & token: null
            // return 各區張數
            // e.g. {1: 10, 2: 20, 3: 30}

        } catch (err) {
            console.log(err);
            return null;
        }
    },
};
