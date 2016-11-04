import moment from "moment";
import {range} from "ramda";

import HighCharts from "components/highcharts";

describe("HighCharts component", () => {

    describe("`getWeekendOverlay` function", () => {

        const getWeekendOverlay = HighCharts.prototype.getWeekendOverlay;
        const instance = {
            props: {
                dateFilter: {
                    start: moment.utc().startOf("month"), // Thu Jan 01 1970 01:00:00 GMT+0100 (CET)
                    end: moment.utc().endOf("month") // Sun Feb 01 1970 00:59:59 GMT+0100 (CET)
                }
            },
            getTheme: sinon.stub().returns({colors: {
                graphUnderlay: "color"
            }})
        };
        var clock;

        beforeEach(() => {
            clock = sinon.useFakeTimers();
        });

        afterEach(() => {
            clock.restore();
            instance.getTheme.reset();
        });

        it("should return an array of object", () => {
            const ret = getWeekendOverlay.call(instance);
            expect(ret).to.be.an("array");
            ret.forEach(value => {
                expect(value).to.be.an("object");
            });
        });

        it("should return an array with length 5", () => {
            const ret = getWeekendOverlay.call(instance);
            expect(ret.length).to.equal(5);
        });

        it.skip("should return an the correct object from saturday to sunday", () => {
            const ret = getWeekendOverlay.call(instance);
            ret.forEach(dataObject => {
                expect(moment.utc(dataObject.from).weekday()).to.equal(6);
                expect(moment.utc(dataObject.to).weekday()).to.equal(0);
                expect(dataObject.color).to.equal("color");
            });
        });

    });

    describe("`getXAxis` function", () => {

        const getXAxis = HighCharts.prototype.getXAxis;
        var instance = {
            props: {
                coordinates: range(0, 2),
                dateCompare: [{
                    start: "2016-02-01",
                    end: "2016-02-29"
                }, {
                    start: "2016-01-01",
                    end: "2016-01-31"
                }]
            },
            getTheme: sinon.stub().returns({colors: {
                axisLabel: "axisLabel",
                lineCompare: "lineCompare"
            }}),
            getWeekendOverlay: sinon.stub().returns([])
        };

        it("should return an array if `isDateCompareActive` is set to `false`", () => {
            const ret = getXAxis.call(instance);
            expect(ret).to.be.an("object");
        });

        it("should return an array if `isDateCompareActive` is false", () => {
            instance.props.isDateCompareActive = true;
            const ret = getXAxis.call(instance);
            expect(ret).to.be.an("array");
        });

        it("should return the correct object if `isDateCompareActive` is `true`", () => {
            instance.props.isDateCompareActive = false;
            const ret = getXAxis.call(instance);
            expect(ret).to.deep.equal({
                labels: {
                    style: {
                        color: "axisLabel"
                    }
                },
                plotBands: [],
                type: "datetime"
            });
        });

        it("should return the array with the correct object if `isDateCompareActive` is `true`", () => {
            instance.props.isDateCompareActive = true;
            const ret = getXAxis.call(instance);
            expect(ret).to.deep.equal([{
                labels: {
                    style: {
                        color: "axisLabel"
                    }
                },
                min: "2016-02-01",
                max: "2016-02-29",
                plotBands: [],
                type: "datetime"
            }, {
                labels: {
                    style: {
                        color: "lineCompare"
                    }
                },
                min: "2016-01-01",
                max: "2016-01-31",
                plotBands: [],
                type: "datetime"
            }]);
        });

    });

});
