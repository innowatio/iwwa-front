require("unit-setup.js");

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
                payload: {
                    label: "labelTypeModify",
                    key: "keyTypeModify"
                }
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
                fullPath: ["siteId1", undefined],
                sensorId: null
            }, {
                ...defaultChartStateObject,
                alarms: undefined,
                fullPath: ["siteId2", undefined],
                site: "siteId2",
                sensorId: null
            }]);
        });

    });

    describe("`SELECT_DATA_RANGES_COMPARE` type", () => {

        it("should return an array of two object with different dateRange", () => {
            const valuePassedFromAction = {
                type: "SELECT_DATE_RANGES_COMPARE",
                payload: {
                    period: {
                        label: "Mese",
                        key: "months"
                    },
                    dateOne: 1449157137862
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal([{
                ...defaultChartStateObject,
                date: {
                    type: "dateCompare",
                    period: {
                        label: "Mese",
                        key: "months"
                    },
                    start: 1446678000000,
                    end: 1449183599999
                }
            }, {
                ...defaultChartStateObject,
                date: {
                    type: "dateCompare",
                    period: {
                        label: "Mese",
                        key: "months"
                    },
                    start: 1444255200000,
                    end: 1446764399999
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

    describe.skip("`DISPLAY_ALARMS_ON_CHART` type", () => {

        it("should return the correct object", () => {
            const valuePassedFromAction = {
                type: "DISPLAY_ALARMS_ON_CHART",
                payload: {
                    siteId: ["site1"],
                    alarms: [1498749876543, 1516543214890],
                    startDate: 1449157137862,
                    endDate: 1449157157862
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarms: [1498749876543, 1516543214890],
                sites: ["site1"],
                types: [
                    {
                        label: "Attiva",
                        key: "activeEnergy"
                    },
                    {}
                ],
                dateRanges: [{
                    start: 1449157137862,
                    end: 1449157157862
                }],
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
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
