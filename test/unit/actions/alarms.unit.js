require("unit-setup.js");

import * as alarms from "actions/alarms";

describe("`alarms` actions", () => {

    describe("`displayAlarmsOnChart` function", () => {

        it("should return the correct object if are passed the correct parameters", () => {
            const sensorId = ["sensorId"];
            const alarmsDate = [1449157137862, 1449157157862];
            const startDate = 1448924400000;
            const endDate = 1451602799999;
            const ret = alarms.displayAlarmsOnChart(
                sensorId, alarmsDate, startDate, endDate
            );
            expect(ret).to.deep.equal({
                type: "DISPLAY_ALARMS_ON_CHART",
                payload: {
                    sensorId,
                    alarms: alarmsDate,
                    startDate,
                    endDate
                }
            });
        });

        it("should throw if aren't passed the correct parameter", () => {
            const sensorId = ["sensorId"];
            const alarmsDate = [1449157137862, "Thu Dec 03 2015 16:38:57 GMT+0100 (CET)"];
            const startDate = 1448924400000;
            const endDate = 1451602799999;
            function troubleMaker () {
                alarms.displayAlarmsOnChart(sensorId, alarmsDate, startDate, endDate);
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
