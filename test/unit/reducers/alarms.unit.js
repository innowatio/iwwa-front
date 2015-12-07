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
                const ret = idReducer(null, valuePassedFromAction);
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

});
