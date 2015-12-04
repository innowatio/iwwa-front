require("unit-setup.js");

import * as alarms from "actions/alarms";

describe("`alarms` actions", () => {

    describe("`displayAlarmsOnChart` function", () => {

        it("should return the correct object if are passed the correct parameters", () => {
            const siteId = ["siteId"];
            const alarmsDate = [1449157137862, 1449157157862];
            const startDate = 1448924400000;
            const endDate = 1451602799999;
            const ret = alarms.displayAlarmsOnChart(
                siteId, alarmsDate, startDate, endDate
            );
            expect(ret).to.deep.equal({
                type: "DISPLAY_ALARMS_ON_CHART",
                payload: {
                    siteId,
                    alarms: alarmsDate,
                    startDate,
                    endDate
                }
            });
        });

        it("should throw if aren't passed the correct parameter", () => {
            const siteId = ["siteId"];
            const alarmsDate = [1449157137862, "Thu Dec 03 2015 16:38:57 GMT+0100 (CET)"];
            const startDate = 1448924400000;
            const endDate = 1451602799999;
            function troubleMaker () {
                alarms.displayAlarmsOnChart(siteId, alarmsDate, startDate, endDate);
            }
            expect(troubleMaker).to.throw();
        });

    });

});
