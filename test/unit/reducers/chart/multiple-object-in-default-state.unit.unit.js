require("unit-setup.js");

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
                ...defaultChartStateFirstObject,
                alarms: undefined,
                site: "siteId1",
                sensorId: "sensorId1"
            }, {
                ...defaultChartStateFirstObject,
                alarms: undefined,
                site: "siteId1",
                sensorId: "sensorId2"
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
                ...defaultChartStateFirstObject,
                date: {
                    range: "dateFilter",
                    start: 1498749876543,
                    end: 1516543214890
                }
            }, {
                ...defaultChartStateSecondObject,
                date: {
                    range: "dateFilter",
                    start: 1498749876543,
                    end: 1516543214890
                }
            }
        ]);
        });

    });

    describe("`REMOVE_ALL_COMPARE` type", () => {

        it("should remove the comparation", () => {
            const valuePassedFromAction = {
                type: "REMOVE_ALL_COMPARE"
            };
            const ret = chart(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal([defaultChartStateFirstObject]);
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
