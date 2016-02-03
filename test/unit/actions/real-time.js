require("unit-setup.js");

import * as realTime from "actions/real-time";

describe("`realTime` actions", () => {

    describe("`selectRealTimeSite` function", () => {

        it("should return the correct object if is passed an object with site and fullPath values", () => {
            const siteId = {
                site: "siteId",
                fullPath: ["siteId", "podId", "sensorId"]
            };
            const ret = realTime.selectRealTimeSite(siteId);
            expect(ret).to.deep.equal({
                type: "SELECT_REAL_TIME_SITE",
                payload: {
                    site: "siteId",
                    fullPath: ["siteId", "podId", "sensorId"]
                }
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
