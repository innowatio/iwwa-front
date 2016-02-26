import "unit-setup.js";
import moment from "moment";
import {flatten, range} from "ramda";

import {getDateRangesCompare} from "reducers/chart/date-ranges";

describe("`getDateRangesCompare`", () => {

    const formattedNumber = n => (n < 10 ? `0${n}` : n);

    describe("[CASE: period.key = years]", () => {

        const inputArray = flatten(range(1, 5).map(numberOfYear => {
            return range(1, 13).map(n => {
                return {
                    period: {
                        key: "years"
                    },
                    dateOne: moment(
                        `${2015 + numberOfYear}-${formattedNumber(n)}-${formattedNumber(6 * numberOfYear)}`, "YYYY-MM-DD"
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
                const startFirstObj = moment.utc(inputObj.dateOne);
                expect(ret[0].start).to.be.at.most(startFirstObj.startOf("month").valueOf());
                expect(ret[0].end).to.be.at.least(startFirstObj.endOf("month").valueOf());
                const startSecondObj = moment.utc(inputObj.dateOne).subtract({year: 1});
                expect(ret[1].start).to.be.at.most(startSecondObj.startOf("month").valueOf());
                expect(ret[1].end).to.be.at.least(startSecondObj.endOf("month").valueOf());
            });
        });

        it("return an array of object with equal months but different years", () => {
            inputArray.forEach(inputObj => {
                const ret = getDateRangesCompare(inputObj);
                /*
                *   Add one week because the start/end can be 1 week in the
                *   previous/following month.
                */
                expect(moment.utc(ret[0].start).add({week: 1}).format("YYYY-MM")).to.be.equal(
                    moment.utc(inputObj.dateOne).format("YYYY-MM")
                );
                expect(moment.utc(ret[1].start).add({weeks: 2}).format("YYYY-MM")).to.be.equal(
                    moment.utc(inputObj.dateOne).subtract({year: 1}).startOf("month").format("YYYY-MM")
                );
            });
        });

    });

    describe("[CASE: period.key = months]", () => {

        const inputArray = flatten(range(1, 5).map(numberOfYear => {
            return range(1, 13).map(n => {
                return {
                    period: {
                        key: "months"
                    },
                    dateOne: moment(
                        `${2015 + numberOfYear}-${formattedNumber(n)}-${formattedNumber(4 * numberOfYear)}`, "YYYY-MM-DD"
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
                const startFirstObj = moment.utc(inputObj.dateOne);
                expect(ret[0].start).to.be.at.most(startFirstObj.startOf("month").valueOf());
                expect(ret[0].end).to.be.at.least(startFirstObj.endOf("month").valueOf());
                const startSecondObj = moment.utc(inputObj.dateOne).subtract({month: 1});
                expect(ret[1].start).to.be.at.most(startSecondObj.startOf("month").valueOf());
                expect(ret[1].end).to.be.at.least(startSecondObj.endOf("month").valueOf());
            });
        });

    });

    describe("[CASE: period.key = days]", () => {

        const inputArray = flatten(range(1, 13).map(monthOfYear => {
            return range(1, moment(monthOfYear, "M").daysInMonth()).map(n => {
                return {
                    period: {
                        key: "days"
                    },
                    dateOne: moment(
                        `${2016}-${formattedNumber(monthOfYear)}-${formattedNumber(n)}`, "YYYY-MM-DD"
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

        it("return at the first place in array today, and in the second yesterday", () => {
            inputArray.forEach(inputObj => {
                const ret = getDateRangesCompare(inputObj);
                expect(moment.utc(ret[0].start).format("DD")).to.equal(
                    moment.utc(inputObj.dateOne).format("DD")
                );
                expect(moment.utc(ret[1].start).format("DD")).to.equal(
                    moment.utc(inputObj.dateOne).subtract({day: 1}).startOf("day").format("DD")
                );
            });
        });

        it("return at the first place in array today [from 00:00 to 23:59]", () => {
            inputArray.forEach(inputObj => {
                const ret = getDateRangesCompare(inputObj);
                expect(moment.utc(ret[0].start).format("DD-HH:mm")).to.equal(
                    moment.utc(inputObj.dateOne).startOf("day").format("DD-HH:mm")
                );
                expect(moment.utc(ret[0].end).endOf("day").format("DD-HH:mm")).to.equal(
                    moment.utc(inputObj.dateOne).endOf("day").format("DD-HH:mm")
                );
            });
        });

        it("return at the second place in array yesterday [from 00:00 to 23:59]", () => {
            inputArray.forEach(inputObj => {
                const ret = getDateRangesCompare(inputObj);
                expect(moment.utc(ret[1].start).format("DD-HH:mm")).to.equal(
                    moment.utc(inputObj.dateOne).subtract({day: 1}).startOf("day").format("DD-HH:mm")
                );
                expect(moment.utc(ret[1].end).endOf("day").format("DD-HH:mm")).to.equal(
                    moment.utc(inputObj.dateOne).subtract({day: 1}).endOf("day").format("DD-HH:mm")
                );
            });
        });

    });

    describe("[CASE: period.key = 7 days before]", () => {

        const inputArray = flatten(range(1, 13).map(monthOfYear => {
            return range(1, moment(monthOfYear, "M").daysInMonth()).map(n => {
                return {
                    period: {
                        key: "7 days before"
                    },
                    dateOne: moment(
                        `${2016}-${formattedNumber(monthOfYear)}-${formattedNumber(n)}`, "YYYY-MM-DD"
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

        it("return at the first place in array today, and in the second the same day one week before", () => {
            inputArray.forEach(inputObj => {
                const ret = getDateRangesCompare(inputObj);
                expect(moment.utc(ret[0].start).format("DD")).to.equal(
                    moment.utc(inputObj.dateOne).format("DD")
                );
                expect(moment.utc(ret[0].start).weekday()).to.equal(
                    moment.utc(inputObj.dateOne).weekday()
                );
                expect(moment.utc(ret[1].start).format("DD")).to.equal(
                    moment.utc(inputObj.dateOne).subtract({week: 1}).startOf("day").format("DD")
                );
                expect(moment.utc(ret[1].start).weekday()).to.equal(
                    moment.utc(inputObj.dateOne).subtract({week: 1}).startOf("day").weekday()
                );
            });
        });

        it("return at the first place in array today [from 00:00 to 23:59]", () => {
            inputArray.forEach(inputObj => {
                const ret = getDateRangesCompare(inputObj);
                expect(moment.utc(ret[0].start).format("DD-HH:mm")).to.equal(
                    moment.utc(inputObj.dateOne).startOf("day").format("DD-HH:mm")
                );
                expect(moment.utc(ret[0].end).endOf("day").format("DD-HH:mm")).to.equal(
                    moment.utc(inputObj.dateOne).endOf("day").format("DD-HH:mm")
                );
            });
        });

        it("return at the second place in array the same day as today one week before [from 00:00 to 23:59]", () => {
            inputArray.forEach(inputObj => {
                const ret = getDateRangesCompare(inputObj);
                expect(moment.utc(ret[1].start).format("DD-HH:mm")).to.equal(
                    moment.utc(inputObj.dateOne).subtract({week: 1}).startOf("day").format("DD-HH:mm")
                );
                expect(moment.utc(ret[1].end).endOf("day").format("DD-HH:mm")).to.equal(
                    moment.utc(inputObj.dateOne).subtract({week: 1}).endOf("day").format("DD-HH:mm")
                );
            });
        });

    });

    describe("[CASE: period.key = week]", () => {

        const inputArray = flatten(range(1, 13).map(monthOfYear => {
            return range(1, moment(monthOfYear, "M").daysInMonth()).map(n => {
                return {
                    period: {
                        key: "week"
                    },
                    dateOne: moment(
                        `${2016}-${formattedNumber(monthOfYear)}-${formattedNumber(n)}`, "YYYY-MM-DD"
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

        it("return in the first place of the array the current week", () => {
            inputArray.forEach(inputObj => {
                const ret = getDateRangesCompare(inputObj);
                expect(moment.utc(ret[0].start).format("DD")).to.equal(
                    moment.utc(inputObj.dateOne).startOf("week").format("DD")
                );
                expect(moment.utc(ret[0].start).weekday()).to.equal(0);
                expect(moment.utc(ret[0].end).format("DD")).to.equal(
                    moment.utc(inputObj.dateOne).endOf("week").format("DD")
                );
                expect(moment.utc(ret[0].end).weekday()).to.equal(6);
            });
        });

        it("return in the second place of the array the following week", () => {
            inputArray.forEach(inputObj => {
                const ret = getDateRangesCompare(inputObj);
                expect(moment.utc(ret[1].start).format("DD")).to.equal(
                    moment.utc(inputObj.dateOne).subtract({week: 1}).startOf("week").format("DD")
                );
                expect(moment.utc(ret[1].start).weekday()).to.equal(0);
                expect(moment.utc(ret[1].end).format("DD")).to.equal(
                    moment.utc(inputObj.dateOne).subtract({week: 1}).endOf("week").format("DD")
                );
                expect(moment.utc(ret[1].end).weekday()).to.equal(6);
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
