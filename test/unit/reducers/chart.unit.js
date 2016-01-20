require("unit-setup.js");

import chartReducer, {chart} from "reducers/chart";

describe("`chart` reducer [CASE: single object in default state array]", () => {

    const chartState = [Object.freeze({
        alarms: 1449157137862,
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
    })];

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
                alarms: undefined,
                site: "newSiteId",
                sensorId: "newSensorId",
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
                alarms: undefined,
                site: "site",
                sensorId: "sensorId",
                measurementType: {
                    label: "labelTypeModify",
                    key: "keyTypeModify"
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
            }]);
        });

    });
    // TODO
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
                alarms: undefined,
                site: "siteId1",
                sensorId: "sensorId1",
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
            }, {
                alarms: undefined,
                site: "siteId1",
                sensorId: "sensorId2",
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

        it("should have the toggle functionality if the payload object is the same of that in the state", () => {
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
            expect(ret).to.deep.equal([{
                alarms: 1449157137862,
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
            }, {
                alarms: undefined,
                site: "site",
                sensorId: "consumptionSensorsId",
                measurementType: {
                    label: "labelEnvironmental",
                    key: "keyEnvironment",
                    color: "color",
                    icon: "icon",
                    selected: "iconSelected"
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
            }]);
        });

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
                alarms: 1449157137862,
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
            }, {
                alarms: undefined,
                site: "site",
                sensorId: "environmentalSensorId",
                measurementType: {
                    label: "labelEnvironmentalMod",
                    key: "keyEnvironmentMod",
                    color: "color",
                    icon: "icon",
                    selected: "iconSelected"
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
                alarms: undefined,
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
                alarms: undefined,
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
                    label: "labelSourceMod1",
                    color: "color1",
                    key: "keySourceMod1"
                }
            }, {
                alarms: undefined,
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
                alarms: 1449157137862,
                site: "site",
                sensorId: "sensorId",
                measurementType: {
                    label: "labelType",
                    key: "keyType"
                },
                date: {
                    range: "dateFilter",
                    start: 1498749876543,
                    end: 1516543214890
                },
                source: {
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }
            }]);
        });

    });

    describe.skip("`REMOVE_ALL_COMPARE` type", () => {

        it("should remove the date compare", () => {
            const chartRemoveDateCompareState = Object.freeze({
                alarms: undefined,
                sites: ["site1"],
                consumptionSensors: [],
                electricalSensors: ["electricalSensorsId"],
                consumptionTypes: [{}],
                electricalTypes: [{
                    label: "labelType",
                    key: "keyType"
                }],
                dateRanges: {
                    period: {
                        label: "labelPeriod",
                        key: "keyPeriod"
                    },
                    dateOne: 1449157157862
                },
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
            const valuePassedFromAction = {
                type: "REMOVE_ALL_COMPARE"
            };
            const ret = chart(chartRemoveDateCompareState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarms: undefined,
                sites: ["site1"],
                consumptionSensors: [],
                electricalSensors: ["electricalSensorsId"],
                consumptionTypes: [{}],
                electricalTypes: [{
                    label: "labelType",
                    key: "keyType"
                }],
                dateRanges: {},
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
        });

        it("should remove the multiple sites compare", () => {
            const chartRemoveSiteCompareState = Object.freeze({
                alarms: undefined,
                sites: ["site1", "site2"],
                consumptionSensors: [],
                electricalSensors: ["electricalSensorsIdSite1", "electricalSensorsIdSite2"],
                consumptionTypes: [{}],
                electricalTypes: [{
                    label: "labelType",
                    key: "keyType"
                }],
                dateRanges: {
                    range: "dateFilter",
                    start: 1449157137862,
                    end: 1449157157862
                },
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
            const valuePassedFromAction = {
                type: "REMOVE_ALL_COMPARE"
            };
            const ret = chart(chartRemoveSiteCompareState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarms: undefined,
                sites: ["site1"],
                consumptionSensors: [],
                electricalSensors: ["electricalSensorsIdSite1"],
                consumptionTypes: [{}],
                electricalTypes: [{
                    label: "labelType",
                    key: "keyType"
                }],
                dateRanges: {
                    range: "dateFilter",
                    start: 1449157137862,
                    end: 1449157157862
                },
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
        });

        it("should remove the consumption sensor", () => {
            const chartRemoveSiteCompareState = Object.freeze({
                alarms: undefined,
                sites: ["site1", "site2"],
                consumptionSensors: ["consumptionSensorsId"],
                electricalSensors: ["electricalSensorsIdSite1", "electricalSensorsIdSite2"],
                consumptionTypes: [{
                    label: "labelEnvironmental",
                    key: "keyEnvironment",
                    color: "color",
                    icon: "icon",
                    selected: "iconSelected"
                }],
                electricalTypes: [{
                    label: "labelType",
                    key: "keyType"
                }],
                dateRanges: {
                    range: "dateFilter",
                    start: 1449157137862,
                    end: 1449157157862
                },
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
            const valuePassedFromAction = {
                type: "REMOVE_ALL_COMPARE"
            };
            const ret = chart(chartRemoveSiteCompareState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                alarms: undefined,
                sites: ["site1"],
                consumptionSensors: [],
                electricalSensors: ["electricalSensorsIdSite1"],
                consumptionTypes: [{}],
                electricalTypes: [{
                    label: "labelType",
                    key: "keyType"
                }],
                dateRanges: {
                    range: "dateFilter",
                    start: 1449157137862,
                    end: 1449157157862
                },
                sources: [{
                    label: "labelSource",
                    color: "color",
                    key: "keySource"
                }]
            });
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
