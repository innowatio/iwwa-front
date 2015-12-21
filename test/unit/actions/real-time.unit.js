require("unit-setup.js");

import * as realTime from "actions/real-time";

describe("`realTime` actions", () => {

    describe("`selectRealTimeSite` function", () => {

        it("should return the correct object if is passed an array with one string as parameter", () => {
            const siteId = ["siteId"];
            const ret = realTime.selectRealTimeSite(siteId);
            expect(ret).to.deep.equal({
                type: "SELECT_REAL_TIME_SITE",
                payload: ["siteId"]
            });
        });

        it("should throw if isn't passed an array with one string as parameter", () => {
            const siteId = ["siteId", "anotherString"];
            function troubleMaker () {
                realTime.selectRealTimeSite(siteId);
            }
            expect(troubleMaker).to.throw();
        });

    });

});
