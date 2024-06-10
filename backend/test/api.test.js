/**
 * Runnable test
 */

const { connect, StringCodec } = require("nats");
const dotenv = require("dotenv");
const init_test_data = require("./init_test_data");

dotenv.config({
    path: process.env.NODE_ENV === "prod" ? ".env" : ".env.test",
});

const EMPTY=0;
const PENDING=1;
const RESERVED=2;

describe("test some API", () => {
    let nc;

    const sc = StringCodec();

    beforeAll(async () => {
        nc = await connect({ servers: process.env.NATS_URL });
        console.log("connected to NATS url", process.env.NATS_URL);
    });
    
    afterAll(async () => {
        await nc.drain();
    });


    beforeEach(async () => {
        console.log("beforeEach");
        await init_test_data();
    });
    
    test("state, snapup, confirm", async () => {
        const session = 1;
        const area = 1;
        console.log("session: ", session);
        
        let rStateInit = await nc.request(`ticketing.${session}.state`);
        // expect all area's total = empty
        for (let area of rStateInit.json().state.areas) {
            expect(area.total).toBe(area.empty);
        }
        console.log(JSON.stringify(rStateInit.json(), null, 2));

        // 搶 n 張票
        const tickets = 2;
        let rSnap = await snapUp(session, area, tickets);

        console.log(JSON.stringify(rSnap.json(), null, 2));
        const order = rSnap.json().order;
        const seats = rSnap.json().seats;
        expect(rSnap.json().status).toBe("success");
        expect(seats).toHaveLength(tickets);
        expect(rSnap.json().seat_status).toBe(PENDING);
        expect(rSnap.json().price).toBe(6888);
        
        // 搶票後有 n 張票進入 pending 狀態
        let rState = await queryState(session);
        console.log(JSON.stringify(rState.json(), null, 2));
        const afterSnapArea = rState.json().state.areas.find((item) => item.id == area);

        expect(afterSnapArea.pending).toBe(tickets);
        expect(afterSnapArea.empty).toBe(afterSnapArea.total - tickets);

        // 確認這 n 張
        let rConfirm = await confirm(session, area, order, seats);

        console.log(JSON.stringify(rConfirm.json(), null, 2));
        expect(rConfirm.json().status).toBe("success");
        expect(rConfirm.json().seat_status).toBe(RESERVED);

    });  

    test("state, snapup, cancel", async () => {
        const session = 1;
        const area = 1;
        console.log("session: ", session);
        
        //確認資料庫沒動過，如果錯了，先執行 npm run init_db 重置資料庫
        let rStateInit = await nc.request(`ticketing.${session}.state`);
        // expect all area's total = empty
        for (let area of rStateInit.json().state.areas) {
            expect(area.total).toBe(area.empty);
        }
        // console.log(JSON.stringify(rStateInit.json(), null, 2));

        // 搶 n 張票
        const tickets = 2;
        let rSnap = await snapUp(session, area, tickets);

        console.log(JSON.stringify(rSnap.json(), null, 2));
        const order = rSnap.json().order;
        const seats = rSnap.json().seats;
        expect(rSnap.json().status).toBe("success");
        expect(seats).toHaveLength(tickets);
        expect(rSnap.json().seat_status).toBe(PENDING);

        // 取消這 n 張
        let rCancel = await cancel(session, area, order, seats);

        console.log(JSON.stringify(rCancel.json(), null, 2));
        expect(rCancel.json().status).toBe("success");
        expect(rCancel.json().seat_status).toBe(EMPTY);
        expect(rCancel.json().seats).toHaveLength(tickets);
        for (let seat of rCancel.json().seats) {
            expect(seats).toContain(seat);
        }

        // 取消後有 n 張票從 pending 進入 empty 狀態
        let rState = await queryState(session);
        console.log(JSON.stringify(rState.json(), null, 2));
        const afterCacnelArea = rState.json().state.areas.find((item) => item.id == area);

        expect(afterCacnelArea.pending).toBe(0);
        expect(afterCacnelArea.empty).toBe(afterCacnelArea.total);
    });  
    
    const snapUp = async (session, area, tickets) => {
       return await nc.request(`ticketing.${session}.${area}.snapUp`,
            sc.encode(JSON.stringify({
                "count": tickets
            }))
        );
    }

    const queryState = async (session) => {
        return await nc.request(`ticketing.${session}.state`);
    }

    const confirm = async (session, area, order, seats) => {
        return await nc.request(`ticketing.${session}.${area}.${order}.confirm`,
            sc.encode(JSON.stringify({
                "seats": seats
            }))
        );
    }

    const cancel = async (session, area, order, seats) => {
        return await nc.request(`ticketing.${session}.${area}.${order}.cancel`,
            sc.encode(JSON.stringify({
                "seats": seats
            }))
        );
    }
})