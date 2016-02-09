require("unit-setup.js");
import moment from "moment";

import chartReducer, {chart} from "reducers/chart";

describe("`chart` reducer [CASE: multiple object in default state array]", () => {

    const defaultChartStateFirstObject = Object.freeze({
        alarms: [1449157137862],
        site: "site1",
        fullPath: ["site1", "sensorId"],
        sensorId: "sensorId",
        measurementType: {
            label: "labelType1",
            key: "keyType1"
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

    const defaultChartStateSecondObject = Object.freeze({
        alarms: undefined,
        site: "site2",
        sensorId: "consumptionSensorsId",
        fullPath: ["site2", "consumptionSensorsId"],
        measurementType: {
            label: "labelEnvironmental",
            key: "keyEnvironment",
            color: "color",
            icon: "icon",
            selected: "iconSelected"
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

    const chartState = Object.freeze([
        defaultChartStateFirstObject,
        defaultChartStateSecondObject
    ]);

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
                ...defaultChartStateFirstObject,
                alarms: undefined,
                site: "newSiteId",
                sensorId: "newSensorId",
                fullPath: ["newSiteId", "newSensorId"]
            }]);
        });

    });

    describe("`SELECT_ELECTRICAL_TYPE` type", () => {

        const chartStateWithEqualMeasurementType = Object.freeze([
            defaultChartStateFirstObject, {
                ...defaultChartStateSecondObject,
                measurementType: {
                    label: "labelType1",
                    key: "keyType1"
                }
            }
        ]);

        it("should return the new measurementType passed by action [CASE: two different `measurementType` in state]", () => {
            const valuePassedFromAction = {
                type: "SELECT_ELECTRICAL_TYPE",
                payload: {
                    label: "labelTypeModify",
                    key: "keyTypeModify"
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal([{
                ...defaultChartStateFirstObject,
                alarms: undefined,
                measurementType: {
                    label: "labelTypeModify",
                    key: "keyTypeModify"
                }
            }, {
                ...defaultChartStateSecondObject
            }]);
        });

        it("should return the new measurementType passed by action [CASE: two equal `measurementType` in state]", () => {

            const valuePassedFromAction = {
                type: "SELECT_ELECTRICAL_TYPE",
                payload: {
                    label: "labelTypeModify",
                    key: "keyTypeModify"
                }
            };
            const ret = chart(chartStateWithEqualMeasurementType, valuePassedFromAction);
            expect(ret).to.deep.equal([{
                ...defaultChartStateFirstObject,
                alarms: undefined,
                measurementType: {
                    label: "labelTypeModify",
                    key: "keyTypeModify"
                }
            }, {
                ...chartStateWithEqualMeasurementType[1],
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
                ...defaultChartStateFirstObject,
                alarms: undefined,
                fullPath: ["siteId1"],
                site: "siteId1",
                sensorId: "siteId1"
            }, {
                ...defaultChartStateFirstObject,
                alarms: undefined,
                fullPath: ["siteId2"],
                site: "siteId2",
                sensorId: "siteId2"
            }]);
        });

    });

    describe("`SELECT_ENVIRONMENTAL_SENSOR` type", () => {

        it("should remove the second object if the `measurementType` passed from action is the same of that in the second object of the array", () => {
            const valuePassedFromAction = {
                type: "SELECT_ENVIRONMENTAL_SENSOR",
                payload: {
                    sensorId: ["consumptionSensorsId"],
                    type: [{
                        label: "labelEnvironmental",
                        key: "keyEnvironment",
                        color: "color",
                        icon: "icon",
                        selected: "iconSelected"
                    }]
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal([defaultChartStateFirstObject]);
        });

        it("should change the second object of the array if is called another measurementType or another sensor", () => {
            const valuePassedFromAction = {
                type: "SELECT_ENVIRONMENTAL_SENSOR",
                payload: {
                    sensorId: ["consumptionSensorsId"],
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
            expect(ret).to.deep.equal([
                defaultChartStateFirstObject, {
                    ...defaultChartStateSecondObject,
                    site: "site1",
                    fullPath: undefined,
                    measurementType: {
                        label: "labelEnvironmentalMod",
                        key: "keyEnvironmentMod",
                        color: "color",
                        icon: "icon",
                        selected: "iconSelected"
                    },
                    source: {
                        label: "labelSource",
                        color: "color",
                        key: "keySource"
                    }
                }
            ]);
        });

    });

    describe("`SELECT_SOURCE` type", () => {

        it("should return the chart state objects with new source", () => {
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
                ...defaultChartStateFirstObject,
                alarms: undefined,
                source: {
                    label: "labelSourceMod",
                    color: "color",
                    key: "keySourceMod"
                }
            }, {
                ...defaultChartStateSecondObject,
                alarms: undefined,
                source: {
                    label: "labelSourceMod",
                    color: "color",
                    key: "keySourceMod"
                }
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

        it("should return an array of two object with type `dateCompare`", () => {
            const valuePassedFromAction = {
                type: "SELECT_DATE_RANGES_COMPARE",
                payload: {
                    period: {
                        label: "Mese",
                        key: "months"
                    },
                    dateOne: new Date("Thu Dec 03 2015 16:38:57 GMT+0100 (CET)").getTime()
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            const startOne = moment.utc(valuePassedFromAction.payload.dateOne)
                .startOf("month").subtract({days: 2}).weekday(1).valueOf();
            const startTwo = moment.utc(valuePassedFromAction.payload.dateOne)
                .subtract({weeks: 6}).weekday(1).valueOf();
            expect(ret).to.deep.equal([{
                ...defaultChartStateFirstObject,
                date: {
                    type: "dateCompare",
                    period: {
                        label: "Mese",
                        key: "months"
                    },
                    start: startOne,
                    end: moment.utc(startOne).add({weeks: 5}).endOf("isoWeek").valueOf()
                }
            }, {
                ...defaultChartStateFirstObject,
                date: {
                    type: "dateCompare",
                    period: {
                        label: "Mese",
                        key: "months"
                    },
                    start: startTwo,
                    end: moment.utc(startTwo).add({weeks: 5}).endOf("isoWeek").valueOf()
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
                ...defaultChartStateFirstObject,
                date: {
                    type: "dateFilter",
                    start: 1498749876543,
                    end: 1516543214890
                }
            }, {
                ...defaultChartStateSecondObject,
                date: {
                    type: "dateFilter",
                    start: 1498749876543,
                    end: 1516543214890
                }
            }]);
        });

        it("should return the new filter of the date, with `{type: `dateFilter`}` [CASE: `dateCompare`]", () => {
            const chartStateFirstObject = {
                ...defaultChartStateFirstObject,
                date: {
                    start: 1498749876543,
                    end: 1516543214890,
                    type: "dateCompare"
                }
            };
            const chartStateSecondObject = {
                ...defaultChartStateFirstObject,
                date: {
                    start: 1488749876543,
                    end: 1506543214890,
                    type: "dateCompare"
                }
            };
            const valuePassedFromAction = {
                type: "SELECT_DATE_RANGES",
                payload: {
                    type: "dateFilter",
                    start: 1468749876543,
                    end: 1476543214890
                }
            };
            const ret = chart([chartStateFirstObject, chartStateSecondObject], valuePassedFromAction);
            expect(ret).to.deep.equal([{
                ...defaultChartStateFirstObject,
                date: {
                    type: "dateFilter",
                    start: 1468749876543,
                    end: 1476543214890
                }
            }]);
        });

    });

    describe("`DISPLAY_ALARMS_ON_CHART` type", () => {

        var clock;
        before(() => {
            clock = sinon.useFakeTimers();
        });

        after(() => {
            clock.restore();
        });

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
                ...defaultChartStateFirstObject,
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

    describe("`REMOVE_ALL_COMPARE` type", () => {

        it("should remove the comparation", () => {
            const valuePassedFromAction = {
                type: "REMOVE_ALL_COMPARE"
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal([{
                ...defaultChartStateFirstObject,
                date: {}
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
