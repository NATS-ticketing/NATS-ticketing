import { clearSeatService } from "../service/clearSeatService.js";
import { stateService } from "../service/stateService.js";
import { errorMessage } from "../util/errorMsg.js";

const freq = 5 * 60 * 1000; // 5 minutes

let startedSessions = [];  // [$(session_name)]
class NotifyController {
    constructor(emitter) {
        this.emitter = emitter;
    }

    async init() {
        let sessions = await stateService.getSession();

        sessions.forEach(session => {
            // TODO
            // 計算還要多少(ms)開始售票存進delay (start_time - Date.now() : 0)

            // Calculate the delay until the session starts
            const delay = Math.max(new Date(session.start_time).getTime() - Date.now(), 0);
            setTimeout(() => {
                startedSessions.push(session.session_id);
                this.emitter.emit('start', session.session_id);
            }, delay);
            
        });

        this.startClearingInterval()

        //     const delay = 0;
        //     setTimeout(() => {
        //         startedSessions.push(session.session_id);
        //         this.emitter.emit('start');
        //     }, delay);
        // });

        // this.startClearingInterval();
    }

    startClearingInterval() {
        setInterval(() => {
            startedSessions.forEach(session => {
                let result = clearSeatService.clear(session);
                // TODO
                // emit"各區"結果
                
                this.emitter.emit("clear", session, area, result[area]);
                // this.emitter.emit("clear", session, area, num);

            });

        }, freq);
    }
};

export const createNotifyController = async (emitter) => {
    /**
     * Since we need to await the init function,
     * so wrap the creation of the controller into a function
     */
    const notifyController = new NotifyController(emitter);
    await notifyController.init();
    return notifyController;
}