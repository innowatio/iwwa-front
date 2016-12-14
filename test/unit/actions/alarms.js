import * as alarms from "actions/alarms";

describe("`alarms` actions", () => {

    describe("`filterCollection` function", () => {

        it("should return the correct object if are passed an object and a string", () => {
            const ret = alarms.filterCollection({period: 7}, "filterCollection");
            expect(ret).to.deep.equal({
                type: alarms.FILTER_COLLECTION,
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
                type: alarms.NUMBER_OF_SELECTED_TABS,
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
            const ret = alarms.resetSelectAlarm();
            expect(ret).to.deep.equal({
                type: alarms.SELECT_ALARM_RESET
            });
        });

    });

});
