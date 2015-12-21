require("unit-setup.js");

import * as alarmsReducer from "reducers/alarms";

describe("`alarms` reducer", () => {

    describe("`id` reducer", () => {

        const idReducer = alarmsReducer.__get__("id");

        describe("`MODIFY_EXISTENT_ALARM` type", () => {

            it("should return the correct object with `id` parameter", () => {
                const valuePassedFromAction = {
                    type: "MODIFY_EXISTENT_ALARM",
                    payload: "siteId"
                };
                const ret = idReducer(null, valuePassedFromAction);
                expect(ret).to.equal("siteId");
            });

        });

        describe("`RESET_ALARM_FORM_VIEW` type", () => {

            it("should return the correct object with `id` parameter", () => {
                const valuePassedFromAction = {
                    type: "RESET_ALARM_FORM_VIEW"
                };
                const ret = idReducer(undefined, valuePassedFromAction);
                expect(ret).to.equal(null);
            });

        });

        it("should return the previous state if any correct `type` is checked", () => {
            const valuePassedFromAction = {
                type: "NOT_A_CORRECT_TYPE_CASE"
            };
            const previousState = {
                id: "alarmId"
            };
            const ret = idReducer(previousState, valuePassedFromAction);
            expect(ret).to.deep.equal(previousState);
        });

    });

    describe("`statePostAlarm` reducer", () => {

        const statePostAlarmReducer = alarmsReducer.__get__("statePostAlarm");

        it("should return `true` if is passed the `CREATE_OR_MODIFY_ALARM_START` type", () => {
            const valuePassedFromAction = {
                type: "CREATE_OR_MODIFY_ALARM_START"
            };
            const ret = statePostAlarmReducer(undefined, valuePassedFromAction);
            expect(ret).to.equal(true);
        });

        it("should return `false` if is passed the `CREATION_ALARM_STOP` type", () => {
            const valuePassedFromAction = {
                type: "CREATION_ALARM_STOP"
            };
            const ret = statePostAlarmReducer(undefined, valuePassedFromAction);
            expect(ret).to.equal(false);
        });

        it("should return `false` if is passed a not correct type", () => {
            const valuePassedFromAction = {
                type: "NOT_A_CORRECT_TYPE_CASE"
            };
            const ret = statePostAlarmReducer(undefined, valuePassedFromAction);
            expect(ret).to.equal(false);
        });

    });

    describe("`selectedTab` reducer", () => {

        const statePostAlarmReducer = alarmsReducer.__get__("selectedTab");

        it("should return the payload if is passed the `NUMBER_OF_SELECTED_TABS` type", () => {
            const valuePassedFromAction = {
                type: "NUMBER_OF_SELECTED_TABS",
                payload: 2
            };
            const ret = statePostAlarmReducer(undefined, valuePassedFromAction);
            expect(ret).to.equal(2);
        });

        it("should return `3` if is passed a not correct type", () => {
            const valuePassedFromAction = {
                type: "NOT_A_CORRECT_TYPE_CASE",
                payload: 2
            };
            const ret = statePostAlarmReducer(undefined, valuePassedFromAction);
            expect(ret).to.equal(3);
        });


    });

});
