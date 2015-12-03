require("unit-setup.js");

import * as chart from "actions/chart";

describe("Chart actions", function () {

    describe("`selectSingleSite` function", function () {

        it("should return the correct object if is passed an array of one string as parameter", function () {
            const siteId = ["siteId"];
            const ret = chart.selectSingleSite(siteId);
            expect(ret).to.deep.equal({
                type: "SELECT_SINGLE_SITE",
                payload: ["siteId"]
            });
        });

        it("should return an `Error` if isn't passed an array of one string as parameter", function () {
            const siteId = ["siteId", "anotherString"];
            function troubleMaker () {
                chart.selectSingleSite(siteId);
            }
            expect(troubleMaker).to.throw(`siteId in "selectSingleSite" action is not an Array of one string`);
        });

    });

    describe("`selectType` function", function () {

        it("should return the correct object", function () {
            const type = {type: "type"};
            const ret = chart.selectType(type);
            expect(ret).to.deep.equal({
                type: "SELECT_TYPE",
                payload: {
                    type: "type"
                }
            });
        });

    });

});
