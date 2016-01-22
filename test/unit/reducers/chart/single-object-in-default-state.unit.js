require("unit-setup.js");

import chartReducer, {chart} from "reducers/chart";

describe("`chart` reducer [CASE: single object in default state array]", () => {

    const defaultChartStateObject = Object.freeze({
        alarms: [1449157137862],
        site: "site",
        sensorId: "sensorId",
        measurementType: {
            label: "labelType",
            key: "keyType"
        },
        date: {
            range: "dateFilter",
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
                    sensor: "newSensorId"
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal([{
                ...defaultChartStateObject,
                alarms: undefined,
                site: "newSiteId",
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

    describe("`SELECT_MULTIPLE_ELECTRICAL_SENSOR` type", () => {

        it("should return the correct object", () => {
            const valuePassedFromAction = {
                type: "SELECT_MULTIPLE_ELECTRICAL_SENSOR",
                payload: {
                    sites: ["siteId1"],
                    sensors: ["sensorId1", "sensorId2"]
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal([{
                ...defaultChartStateObject,
                alarms: undefined,
                site: "siteId1",
                sensorId: "sensorId1"
            }, {
                ...defaultChartStateObject,
                alarms: undefined,
                site: "siteId1",
                sensorId: "sensorId2"
            }]);
        });

    });
    // TODO
    describe.skip("`SELECT_DATA_RANGES_COMPARE` type", () => {

        it("should return the correct object", () => {
            const valuePassedFromAction = {
                type: "SELECT_DATA_RANGES_COMPARE",
                payload: {
                    period: {
                        label: "labelPeriodDateCompare",
                        key: "keyPeriodDateCompare"
                    },
                    dateOne: 1449157137862
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarms: undefined,
                sites: [],
                types: [
                    {
                        label: "labelType",
                        key: "keyType"
                    },
                    {}
                ],
                dateRanges: [{
                    period: {
                        label: "labelPeriodDateCompare",
                        key: "keyPeriodDateCompare"
                    },
                    dateOne: 1449157137862
                }],
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
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

        it("should return the new filter of the date, with `{range: `dateFilter`}`", () => {
            const valuePassedFromAction = {
                type: "SELECT_DATE_RANGES",
                payload: {
                    range: "dateFilter",
                    start: 1498749876543,
                    end: 1516543214890
                }
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal([{
                ...defaultChartStateObject,
                date: {
                    range: "dateFilter",
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
