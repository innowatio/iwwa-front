import {fromJS} from "immutable";
import moment from "moment";

import * as CollectionUtils from "lib/collection-utils";

describe("`CollectionUtils` lib", () => {

    describe("`filters` object", () => {

        const filters = CollectionUtils.filters;

        describe("`date` function", () => {

            var clock;

            before(() => {
                clock = sinon.useFakeTimers(new Date("2016-04-01").getTime());
            });

            after(() => {
                clock.restore();
            });

            const date = filters.date;
            const arrayOfDate = fromJS([{
                date: moment("2016-03-15")
            }, {
                date: moment("2016-01-11")
            }, {
                date: moment("2016-03-31")
            }, {
                date: moment("2016-02-12")
            }, {
                date: moment("2016-03-26")
            }]);

            it("should return true if item pass the filter [CASE: 7 days]", () => {
                const day = 7;
                const ret = arrayOfDate.map(item => date(item.get("date"), day)).toJS();
                expect(ret).to.deep.equal([false, false, true, false, true]);
            });

            it("should return true if item pass the filter [CASE: 30 days]", () => {
                const day = 30;
                const ret = arrayOfDate.map(item => date(item.get("date"), day)).toJS();
                expect(ret).to.deep.equal([true, false, true, false, true]);
            });

        });

    });

});
