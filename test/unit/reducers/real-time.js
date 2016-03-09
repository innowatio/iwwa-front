require("unit-setup.js");

// import * as  from "reducers/real-time";
var realTimeReducer = require("reducers/real-time");


describe("`real-time` reducer", () => {

    describe("`site` and `fullPath` reducer", () => {

        const siteReducer = realTimeReducer.__get__("site");
        const pathReducer = realTimeReducer.__get__("fullPath");

        it("should return the correct object [CASE: type SELECT_SINGLE_ELECTRICAL_SENSOR_CHART]", () => {
            const valuePassedFromAction = {
                type: "SELECT_SINGLE_ELECTRICAL_SENSOR_CHART",
                payload: ["siteId", "podId", "sensorId"]
            };
            const ret = siteReducer(null, valuePassedFromAction);
            const ret2 = pathReducer(null, valuePassedFromAction);
            expect(ret).to.equal("siteId");
            expect(ret2).to.deep.equal(["siteId", "podId", "sensorId"]);
        });

        it("should return the correct object [CASE: type SELECT_SINGLE_ELECTRICAL_SENSOR_REAL_TIME]", () => {
            const valuePassedFromAction = {
                type: "SELECT_SINGLE_ELECTRICAL_SENSOR_REAL_TIME",
                payload: ["siteId", "podId", "sensorId"]
            };
            const ret = siteReducer(null, valuePassedFromAction);
            const ret2 = pathReducer(null, valuePassedFromAction);
            expect(ret).to.equal("siteId");
            expect(ret2).to.deep.equal(["siteId", "podId", "sensorId"]);
        });

        it("should return the correct object [CASE: type SELECT_SINGLE_ELECTRICAL_SENSOR_CONSUMPTION]", () => {
            const valuePassedFromAction = {
                type: "SELECT_SINGLE_ELECTRICAL_SENSOR_CONSUMPTION",
                payload: ["siteId", "podId", "sensorId"]
            };
            const ret = siteReducer(null, valuePassedFromAction);
            const ret2 = pathReducer(null, valuePassedFromAction);
            expect(ret).to.equal("siteId");
            expect(ret2).to.deep.equal(["siteId", "podId", "sensorId"]);
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
            const ret2 = pathReducer(previousState, valuePassedFromAction);
            expect(ret).to.deep.equal(previousState);
            expect(ret2).to.deep.equal(previousState);
        });

    });

});
