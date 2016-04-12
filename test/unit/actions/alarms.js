require("unit-setup.js");

import * as alarms from "actions/alarms";

describe("`alarms` actions", () => {

    describe("`displayAlarmsOnChart` function", () => {

        it("should return the correct object if are passed the correct parameters", () => {
            const siteId = "siteId";
            const sensorId = "sensorId";
            const arrayOfAlarms = [1449157137862, 1449157157862];
            const ret = alarms.displayAlarmsOnChart(sensorId, siteId, arrayOfAlarms);
            expect(ret).to.deep.equal({
                type: "DISPLAY_ALARMS_ON_CHART",
                payload: {
                    siteId,
                    sensorId,
                    alarms: arrayOfAlarms
                }
            });
        });

        it("should throw if aren't passed the correct parameter", () => {
            const siteId = "siteId";
            const sensorId = "sensorId";
            const arrayOfAlarms = [1449157137862, "Thu Dec 03 2015 16:38:57 GMT+0100 (CET)"];
            function troubleMaker () {
                alarms.displayAlarmsOnChart(sensorId, siteId, arrayOfAlarms);
            }
            expect(troubleMaker).to.throw();
        });

    });

    describe("`modifyExistentAlarm` function", () => {

        it("should return the correct object if is passed a string", () => {
            const alarmId = "alarmId";
            const ret = alarms.modifyExistentAlarm(alarmId);
            expect(ret).to.deep.equal({
                type: "MODIFY_EXISTENT_ALARM",
                payload: alarmId
            });
        });

        it("should throw if isn't passed a string", () => {
            const alarmId = ["wrongTypeOfAlarmId"];
            function troubleMaker () {
                alarms.modifyExistentAlarm(alarmId);
            }
            expect(troubleMaker).to.throw();
        });

    });

    describe("`filterCollection` function", () => {

        it("should return the correct object if are passed an object and a string", () => {
            const ret = alarms.filterCollection({period: 7}, "filterCollection");
            expect(ret).to.deep.equal({
                type: "FILTER_COLLECTION",
                payload: {
                    filterSelection: {period: 7},
                    collectionToFilter: "filterCollection"
                }
            });
        });

        it("should throw if isn't passed a number", () => {
            function troubleMaker () {
                alarms.numberOfSelectedTabs("1", "filter");
            }
            expect(troubleMaker).to.throw();
        });

    });

    describe("`numberOfSelectedTabs` function", () => {

        it("should return the correct object if is passed a number", () => {
            const ret = alarms.numberOfSelectedTabs(1);
            expect(ret).to.deep.equal({
                type: "NUMBER_OF_SELECTED_TABS",
                payload: 1
            });
        });

        it("should throw if isn't passed a number", () => {
            function troubleMaker () {
                alarms.numberOfSelectedTabs("1");
            }
            expect(troubleMaker).to.throw();
        });

    });

    describe("`resetAlarmFormView` function", () => {

        it("should return the correct object", () => {
            const ret = alarms.resetAlarmFormView();
            expect(ret).to.deep.equal({
                type: "RESET_ALARM_FORM_VIEW"
            });
        });

    });

});
