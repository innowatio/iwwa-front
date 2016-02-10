require("unit-setup.js");
import moment from "moment";

import chartReducer, {chart} from "reducers/chart";

describe("`chart` reducer [CASE: single object in default state array]", () => {

    const defaultChartStateObject = Object.freeze({
        alarms: [1449157137862],
        site: "site",
        sensorId: "sensorId",
        fullPath: ["site", "sensorId"],
        measurementType: {
            label: "labelType",
            key: "keyType"
        },
        date: {
            type: "dateFilter",
            start: 1449157137862,
            end: 1449157157862
        },
        source: {
            label: "labelSource",
            color: "color",
            key: "keySource"
        }
    });

    const chartState = Object.freeze([defaultChartStateObject]);

    before(() => {
        chartReducer.__Rewire__("defaultChartState", chartState);
    });

    after(() => {
        chartReducer.__ResetDependency__("defaultChartState", chartState);
    });

    describe("`SELECT_SINGLE_ELECTRICAL_SENSOR` type", () => {

        it("should return the correct array with an object that contain the new sensorId and siteId", () => {
            const valuePassedFromAction = {
                type: "SELECT_SINGLE_ELECTRICAL_SENSOR",
                payload: {
                    site: "newSiteId",
                    fullPath: ["newSiteId", "newSensorId"],
                    sensor: "newSensorId"
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal([{
                ...defaultChartStateObject,
                alarms: undefined,
                site: "newSiteId",
                fullPath: ["newSiteId", "newSensorId"],
                sensorId: "newSensorId"
            }]);
        });

    });

    describe("`SELECT_ELECTRICAL_TYPE` type", () => {

        it("should return the new measurementType passed", () => {
            const valuePassedFromAction = {
                type: "SELECT_ELECTRICAL_TYPE",
                payload: [{
                    label: "labelTypeModify",
                    key: "keyTypeModify"
                }]
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal([{
                ...defaultChartStateObject,
                alarms: undefined,
                measurementType: {
                    label: "labelTypeModify",
                    key: "keyTypeModify"
                }
            }]);
        });

    });

    describe("`SELECT_MULTIPLE_ELECTRICAL_SITE` type", () => {

        it("should return the correct object", () => {
            const valuePassedFromAction = {
                type: "SELECT_MULTIPLE_ELECTRICAL_SITE",
                payload: ["siteId1", "siteId2"]
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal([{
                ...defaultChartStateObject,
                alarms: undefined,
                site: "siteId1",
                fullPath: ["siteId1"],
                sensorId: "siteId1"
            }, {
                ...defaultChartStateObject,
                alarms: undefined,
                fullPath: ["siteId2"],
                site: "siteId2",
                sensorId: "siteId2"
            }]);
        });

    });

    describe("`SELECT_DATA_RANGES_COMPARE` type", () => {

        var clock;
        before(() => {
            clock = sinon.useFakeTimers();
        });

        after(() => {
            clock.restore();
        });

        it("should return an array of two object with different dateRange", () => {
            const valuePassedFromAction = {
                type: "SELECT_DATE_RANGES_COMPARE",
                payload: {
                    period: {
                        label: "Years",
                        key: "years"
                    },
                    dateOne: new Date("Thu Dec 03 2015 16:38:57 GMT+0100 (CET)").getTime()
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            const startOne = moment.utc(valuePassedFromAction.payload.dateOne)
                .startOf("month").subtract({days: 2}).weekday(1).valueOf();
            const startTwo = moment.utc(valuePassedFromAction.payload.dateOne).startOf("day")
                .subtract({weeks: moment.utc().weeksInYear() + 1}).weekday(1).valueOf();
            expect(ret).to.deep.equal([{
                ...defaultChartStateObject,
                date: {
                    type: "dateCompare",
                    period: {
                        label: "Years",
                        key: "years"
                    },
                    start: startOne,
                    end: moment.utc(startOne).add({weeks: 5}).endOf("isoWeek").valueOf()
                }
            }, {
                ...defaultChartStateObject,
                date: {
                    type: "dateCompare",
                    period: {
                        label: "Years",
                        key: "years"
                    },
                    start: startTwo,
                    end: moment.utc(startTwo).add({weeks: 5}).endOf("isoWeek").valueOf()
                }
            }]);
        });

    });

    describe("`SELECT_ENVIRONMENTAL_SENSOR` type", () => {

        it("should return the new value of the payload passed for the environmental sensor", () => {
            const valuePassedFromAction = {
                type: "SELECT_ENVIRONMENTAL_SENSOR",
                payload: {
                    sensorId: ["environmentalSensorId"],
                    type: [{
                        label: "labelEnvironmentalMod",
                        key: "keyEnvironmentMod",
                        color: "color",
                        icon: "icon",
                        selected: "iconSelected"
                    }]
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal([{
                ...defaultChartStateObject
            }, {
                ...defaultChartStateObject,
                alarms: undefined,
                site: "site",
                sensorId: "environmentalSensorId",
                fullPath: undefined,
                measurementType: {
                    label: "labelEnvironmentalMod",
                    key: "keyEnvironmentMod",
                    color: "color",
                    icon: "icon",
                    selected: "iconSelected"
                }
            }]);
        });

    });

    describe("`SELECT_SOURCE` type", () => {

        it("should return the chart state with new source [CASE: single source]", () => {
            const valuePassedFromAction = {
                type: "SELECT_SOURCE",
                payload: [{
                    label: "labelSourceMod",
                    color: "color",
                    key: "keySourceMod"
                }]
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal([{
                ...defaultChartStateObject,
                alarms: undefined,
                source: {
                    label: "labelSourceMod",
                    color: "color",
                    key: "keySourceMod"
                }
            }]);
        });

        it("should return the chart state with new source [CASE: multiple source]", () => {
            const valuePassedFromAction = {
                type: "SELECT_SOURCE",
                payload: [{
                    label: "labelSourceMod1",
                    color: "color1",
                    key: "keySourceMod1"
                }, {
                    label: "labelSourceMod2",
                    color: "color2",
                    key: "keySourceMod2"
                }]
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal([{
                ...defaultChartStateObject,
                alarms: undefined,
                source: {
                    label: "labelSourceMod1",
                    color: "color1",
                    key: "keySourceMod1"
                }
            }, {
                ...defaultChartStateObject,
                alarms: undefined,
                source: {
                    label: "labelSourceMod2",
                    color: "color2",
                    key: "keySourceMod2"
                }
            }]);
        });


    });

    describe("`SELECT_DATE_RANGES` type", () => {

        it("should return the new filter of the date, with `{type: `dateFilter`}`", () => {
            const valuePassedFromAction = {
                type: "SELECT_DATE_RANGES",
                payload: {
                    type: "dateFilter",
                    start: 1498749876543,
                    end: 1516543214890
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal([{
                ...defaultChartStateObject,
                date: {
                    type: "dateFilter",
                    start: 1498749876543,
                    end: 1516543214890
                }
            }]);
        });

    });

    describe("`DISPLAY_ALARMS_ON_CHART` type", () => {

        it("should return the correct object", () => {
            const valuePassedFromAction = {
                type: "DISPLAY_ALARMS_ON_CHART",
                payload: {
                    siteId: "site1",
                    sensorId: "sensorId",
                    alarms: [1498749876543, 1516543214890]
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal([{
                ...defaultChartStateObject,
                alarms: [1498749876543, 1516543214890],
                site: "site1",
                sensorId: "sensorId",
                fullPath: ["site1"],
                date: {
                    start: moment.utc(1516543214890).startOf("month").valueOf(),
                    end: moment.utc(1516543214890).endOf("month").valueOf(),
                    type: "dateFilter"
                }
            }]);
        });

    });

    it("should return the previous state if any correct `type` is checked", () => {
        const valuePassedFromAction = {
            type: "NOT_A_CORRECT_TYPE_CASE"
        };
        const ret = chart(chartState, valuePassedFromAction);
        expect(ret).to.deep.equal(chartState);
    });

});
