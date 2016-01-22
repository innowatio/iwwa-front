require("unit-setup.js");

import * as realTimeReducer from "reducers/real-time";

describe("`real-time` reducer", () => {

    describe("`site` reducer", () => {

        const siteReducer = realTimeReducer.__get__("site");
        const pathReducer = realTimeReducer.__get__("fullPath");

        it("should return the correct object with `id` parameter if is passed `SELECT_REAL_TIME_SITE` type", () => {
            const valuePassedFromAction = {
                type: "SELECT_REAL_TIME_SITE",
                payload: {
                    site: "siteId",
                    fullPath: ["siteId", "podId", "sensorId"]
                }
            };
            const ret = siteReducer(null, valuePassedFromAction);
            const ret2 = pathReducer(null, valuePassedFromAction);
            expect(ret).to.equal("siteId");
            expect(ret2).to.eql(["siteId", "podId", "sensorId"]);
        });

        it("should return the previous state if any correct `type` is checked", () => {
            const valuePassedFromAction = {
                type: "NOT_A_CORRECT_TYPE_CASE"
            };
            const previousState = {
                site: "siteId",
                fullPath: ["siteId", "podId", "sensorId"]
            };
            const ret = siteReducer(previousState, valuePassedFromAction);
            expect(ret).to.deep.equal(previousState);
        });

    });

});
