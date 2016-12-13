var alarmsReducer = require("reducers/alarms");

describe("`alarms` reducer", () => {

    describe("`selectedTab` reducer", () => {

        const selectedTabReducer = alarmsReducer.__get__("selectedTab");

        it("should return the payload if is passed the `NUMBER_OF_SELECTED_TABS` type", () => {
            const valuePassedFromAction = {
                type: "NUMBER_OF_SELECTED_TABS",
                payload: 2
            };
            const ret = selectedTabReducer(undefined, valuePassedFromAction);
            expect(ret).to.equal(2);
        });

        it("should return `3` if is passed a not correct type", () => {
            const valuePassedFromAction = {
                type: "NOT_A_CORRECT_TYPE_CASE",
                payload: 2
            };
            const ret = selectedTabReducer(undefined, valuePassedFromAction);
            expect(ret).to.equal(3);
        });

    });

    describe("`filter` reducer", () => {

        const filterReducer = alarmsReducer.__get__("filter");

        it("should return the payload if is passed the `FILTER_COLLECTION` type", () => {
            const valuePassedFromAction = {
                type: "FILTER_COLLECTION",
                payload: {
                    collectionToFilter: "collectionToFilter",
                    filterSelection: {
                        period: 7,
                        status: "active"
                    }
                }
            };
            const ret = filterReducer({}, valuePassedFromAction);
            expect(ret).to.deep.equal({
                collectionToFilter: {
                    period: 7,
                    status: "active"
                }
            });
        });

        it("should return the default state if is passed a not correct type and state is undefined", () => {
            const valuePassedFromAction = {
                type: "NOT_A_CORRECT_TYPE_CASE"
            };
            const ret = filterReducer(undefined, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarm: {
                    status: "all"
                },
                notification: {
                    period: "-1"
                }
            });
        });

    });

});
