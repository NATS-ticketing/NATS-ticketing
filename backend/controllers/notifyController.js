import { clearSeatService } from "../service/clearSeatService.js";
import { stateService } from "../service/stateService.js";
import { errorMessage } from "../util/errorMsg.js";

const freq = 5 * 60 * 1000; // 5 minutes

let startedSessions = [];  // [$(session_name)]
export const notifyController = {
    constructor(emitter) {
        this.emitter = emitter;
        let sessions = stateService.getSession();

        sessions.forEach(session => {
            // TODO
            // 計算還要多少(ms)開始售票存進delay (start_time - Date.now() : 0)
            setTimeout(() => {
                startedSessions.push(session.session_id);
                this.emitter.emit('start');
            }, delay);
        });

        this.startClearingInterval();

    },
    startClearingInterval: function () {
        setInterval(() => {
            startedSessions.forEach(session => {
                let result = clearSeatService.clear(session);
                // TODO
                // emit"各區"結果
                // this.emitter.emit("clear", session, area, num);
            });

        }, freq);
    }
};
