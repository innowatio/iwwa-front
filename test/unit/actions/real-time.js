require("unit-setup.js");

import * as realTime from "actions/real-time";

describe("`realTime` actions", () => {

    describe("`selectRealTimeSite` function", () => {

        it("should return the correct object if is passed an array of string as fullPath", () => {
            const fullPath = ["siteId", "podId", "sensorId"];
            const ret = realTime.selectRealTimeSite(fullPath);
            expect(ret).to.deep.equal({
                type: "SELECT_SINGLE_ELECTRICAL_SENSOR_REAL_TIME",
                payload: ["siteId", "podId", "sensorId"]
            });
        });

        it("should throw if the given parameters are incorrect", () => {
            const siteId = {
                fullPath: ["siteId", "anotherString"]
            };
            function troubleMaker () {
                realTime.selectRealTimeSite(siteId);
            }
            expect(troubleMaker).to.throw();
        });

    });

});
