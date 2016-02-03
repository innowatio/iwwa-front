import "unit-setup.js";
import moment from "moment";
import {flatten, range} from "ramda";

import {getDateRangesCompare} from "reducers/chart/date-ranges";

describe("`getDateRangesCompare`", () => {

    describe("[CASE: period.key = years]", () => {

        const formattedNumber = n => (n < 10 ? `0${n}` : n);

        const inputArray = flatten(range(0, 4).map(numberOfYear => {
            return range(1, 13).map(n => {
                return {
                    period: {
                        key: "years"
                    },
                    dateOne: moment(
                        `${2016 + numberOfYear}-${formattedNumber(n)}-${16 + numberOfYear}`, "YYYY-MM-DD"
                    ).valueOf()
                };
            });
        }));

        it("return an array with length 2", () => {
            inputArray.forEach(inputObj => {
                const ret = getDateRangesCompare(inputObj);
                expect(ret).to.be.an.instanceOf(Array);
                expect(ret.length).to.equal(2);
            });
        });

        it("the two object in array begin in Monday and end in Sunday", () => {
            inputArray.forEach(inputObj => {
                const ret = getDateRangesCompare(inputObj);
                expect(moment.utc(ret[0].start).weekday()).to.equal(1);
                expect(moment.utc(ret[1].start).weekday()).to.equal(1);
                expect(moment.utc(ret[0].end).weekday()).to.equal(0);
                expect(moment.utc(ret[1].end).weekday()).to.equal(0);
            });
        });

        it("return the correct date of at the most the entire month and the same month one year ago", () => {
            inputArray.forEach(inputObj => {
                const ret = getDateRangesCompare(inputObj);
                /*
                *   Add one week because the start/end can been 1 week in the
                *   previous/following month.
                */
                const startFirstObj = moment.utc(ret[0].start).add({week: 1});
                expect(ret[0].start).to.be.at.most(startFirstObj.startOf("month").valueOf());
                expect(ret[0].end).to.be.at.least(startFirstObj.endOf("month").valueOf());
                const startSecondObj = moment.utc(ret[1].start).add({week: 1});
                expect(ret[1].start).to.be.at.most(startSecondObj.endOf("month").valueOf());
                expect(ret[1].end).to.be.at.least(startSecondObj.endOf("month").valueOf());
            });
        });

        it("return an array of object with equal months but different years", () => {
            inputArray.forEach(inputObj => {
                const ret = getDateRangesCompare(inputObj);
                /*
                *   Add one week because the start/end can been 1 week in the
                *   previous/following month.
                */
                expect(moment.utc(ret[0].start).add({weeks: 1}).format("YYYY-MM")).to.be.equal(
                    moment.utc(inputObj.dateOne).format("YYYY-MM")
                );
                expect(moment.utc(ret[1].start).add({weeks: 1}).format("YYYY-MM")).to.be.equal(
                    moment.utc(inputObj.dateOne).subtract({year: 1}).format("YYYY-MM")
                );
            });
        });

    });

    describe("[CASE: period.key = years]", () => {

        const formattedNumber = n => (n < 10 ? `0${n}` : n);

        const inputArray = flatten(range(0, 4).map(numberOfYear => {
            return range(1, 13).map(n => {
                return {
                    period: {
                        key: "months"
                    },
                    dateOne: moment(
                        `${2016 + numberOfYear}-${formattedNumber(n)}-${16 + numberOfYear}`, "YYYY-MM-DD"
                    ).valueOf()
                };
            });
        }));

        it("return an array with length 2", () => {
            inputArray.forEach(inputObj => {
                const ret = getDateRangesCompare(inputObj);
                expect(ret).to.be.an.instanceOf(Array);
                expect(ret.length).to.equal(2);
            });
        });

        it("the two object in array begin in Monday and end in Sunday", () => {
            inputArray.forEach(inputObj => {
                const ret = getDateRangesCompare(inputObj);
                expect(moment.utc(ret[0].start).weekday()).to.equal(1);
                expect(moment.utc(ret[1].start).weekday()).to.equal(1);
                // Zero is equal to Sunday
                expect(moment.utc(ret[0].end).weekday()).to.equal(0);
                expect(moment.utc(ret[1].end).weekday()).to.equal(0);
            });
        });

        it("return the correct date of at the most the entire month and the same month one year ago", () => {
            inputArray.forEach(inputObj => {
                const ret = getDateRangesCompare(inputObj);
                /*
                *   Add one week because the start/end can been 1 week in the
                *   previous/following month.
                */
                const startFirstObj = moment.utc(ret[0].start).add({week: 1});
                expect(ret[0].start).to.be.at.most(startFirstObj.startOf("month").valueOf());
                expect(ret[0].end).to.be.at.least(startFirstObj.endOf("month").valueOf());
                const startSecondObj = moment.utc(ret[1].start).add({week: 1});
                expect(ret[1].start).to.be.at.most(startSecondObj.endOf("month").valueOf());
                expect(ret[1].end).to.be.at.least(startSecondObj.endOf("month").valueOf());
            });
        });

    });

    it("return an array with length 2", () => {
        const inputArray = {
            period: {
                key: "any",
                dateOne: moment("2016-05-11", "YYYY-MM-DD").valueOf()
            }
        };
        const ret = getDateRangesCompare(inputArray);
        expect(ret).to.be.an.instanceOf(Array);
        expect(ret.length).to.equal(0);
    });

});
