require("unit-setup.js");

// import * as consumptionsReducers from "reducers/consumptions";
var consumptionsReducers = require("reducers/consumptions");

describe("`consumptions` reducer", () => {

    describe("`fullPath` reducer", () => {

        const pathReducer = consumptionsReducers.__get__("fullPath");

        it("should return the correct object [CASE: type SELECT_SINGLE_ELECTRICAL_SENSOR_CHART]", () => {
            const valuePassedFromAction = {
                type: "SELECT_SINGLE_ELECTRICAL_SENSOR_CHART",
                payload: ["siteId", "podId", "sensorId"]
            };
            const ret = pathReducer(null, valuePassedFromAction);
            expect(ret).to.deep.equal(["siteId", "podId", "sensorId"]);
        });

        it("should return the correct object [CASE: type SELECT_SINGLE_ELECTRICAL_SENSOR_REAL_TIME]", () => {
            const valuePassedFromAction = {
                type: "SELECT_SINGLE_ELECTRICAL_SENSOR_REAL_TIME",
                payload: ["siteId", "podId", "sensorId"]
            };
            const ret = pathReducer(null, valuePassedFromAction);
            expect(ret).to.deep.equal(["siteId", "podId", "sensorId"]);
        });

        it("should return the correct object [CASE: type SELECT_SINGLE_ELECTRICAL_SENSOR_CONSUMPTION]", () => {
            const valuePassedFromAction = {
                type: "SELECT_SINGLE_ELECTRICAL_SENSOR_CONSUMPTION",
                payload: ["siteId", "podId", "sensorId"]
            };
            const ret = pathReducer(null, valuePassedFromAction);
            expect(ret).to.deep.equal(["siteId", "podId", "sensorId"]);
        });

        it("should return the previous state if any correct `type` is checked", () => {
            const valuePassedFromAction = {
                type: "NOT_A_CORRECT_TYPE_CASE"
            };
            const previousState = {
                site: "siteId",
                fullPath: ["siteId", "podId", "sensorId"]
            };
            const ret = pathReducer(previousState, valuePassedFromAction);
            expect(ret).to.deep.equal(previousState);
        });

    });

    describe("`period` reducer", () => {

        const periodReducer = consumptionsReducers.__get__("period");

        it("should return a string with the selected period [CASE: state is null]", () => {
            const valuePassedFromAction = {
                type: "SELECT_CONSUMPTIONS_PERIOD",
                payload: "period"
            };
            const ret = periodReducer(null, valuePassedFromAction);
            expect(ret).to.equal("period");
        });

        it("should return a string with the selected period [CASE: state is a string]", () => {
            const valuePassedFromAction = {
                type: "SELECT_CONSUMPTIONS_PERIOD",
                payload: "another-period"
            };
            const ret = periodReducer("period", valuePassedFromAction);
            expect(ret).to.equal("another-period");
        });

        it("should return the previous state if any correct `type` is checked", () => {
            const valuePassedFromAction = {
                type: "NOT_A_CORRECT_TYPE_CASE"
            };
            const previousState = {
                site: "siteId",
                fullPath: ["siteId", "podId", "sensorId"]
            };
            const ret = periodReducer(previousState, valuePassedFromAction);
            expect(ret).to.deep.equal(previousState);
        });

    });

});
