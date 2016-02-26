require("unit-setup.js");

import * as realTime from "actions/consumptions";

describe("`consumptions` actions", () => {

    describe("`selectSite` function", () => {

        it("should return the correct object if a `fullPath` Array value is passed", () => {
            const fullPath = ["siteId", "podId", "sensorId"];
            const ret = realTime.selectSite(fullPath);
            expect(ret).to.deep.equal({
                type: "SELECT_SINGLE_ELECTRICAL_SENSOR_CONSUMPTION",
                payload: ["siteId", "podId", "sensorId"]
            });
        });

        it("should throw if the given `fullPath` incorrect", () => {
            const fullPath = {"0": "siteId", "1": "anotherString"};
            function troubleMaker () {
                realTime.selectSite(fullPath);
            }
            expect(troubleMaker).to.throw();
        });

    });
    describe("`selectPeriod` function", () => {

        it("should return the correct object if a `period` String value is passed", () => {
            const period = "imAperiod";
            const ret = realTime.selectPeriod(period);
            expect(ret).to.deep.equal({
                type: "SELECT_CONSUMPTIONS_PERIOD",
                payload: "imAperiod"
            });
        });

        it("should throw if the given `period` incorrect", () => {
            const period = {
                period: "notAgoodPeriod"
            };
            function troubleMaker () {
                realTime.selectPeriod(period);
            }
            expect(troubleMaker).to.throw();
        });

    });
});
