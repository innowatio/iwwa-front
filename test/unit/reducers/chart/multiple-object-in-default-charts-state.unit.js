require("unit-setup.js");
import moment from "moment";

import chartReducer from "reducers/chart";

describe("`chart` reducer", () => {

    describe("`charts` reducer [CASE: multiple object in default state array]", () => {

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

        const charts = chartReducer.__get__("charts");

        before(() => {
            chartReducer.__Rewire__("defaultChartState", chartState);
        });

        after(() => {
            chartReducer.__ResetDependency__("defaultChartState", chartState);
        });

        describe("`SELECT_SINGLE_ELECTRICAL_SENSOR_CHART` type", () => {

            it("returns single charts state with selected sensor", () => {
                const valuePassedFromAction = {
                    type: "SELECT_SINGLE_ELECTRICAL_SENSOR_CHART",
                    payload: ["newSiteId", "newSensorId"]
                };
                const ret = charts(chartState, valuePassedFromAction);
                expect(ret).to.deep.equal([{
                    ...defaultChartStateFirstObject,
                    alarms: undefined,
                    site: "newSiteId",
                    sensorId: "newSensorId",
                    fullPath: ["newSiteId", "newSensorId"]
                }]);
            });

        });

        describe("`SELECT_SINGLE_ELECTRICAL_SENSOR_CONSUMPTION` type", () => {

            it("returns single charts state with selected sensor", () => {
                const valuePassedFromAction = {
                    type: "SELECT_SINGLE_ELECTRICAL_SENSOR_CONSUMPTION",
                    payload: ["newSiteId", "newSensorId"]
                };
                const ret = charts(chartState, valuePassedFromAction);
                expect(ret).to.deep.equal([{
                    ...defaultChartStateFirstObject,
                    alarms: undefined,
                    site: "newSiteId",
                    sensorId: "newSensorId",
                    fullPath: ["newSiteId", "newSensorId"]
                }]);
            });

        });

        describe("`SELECT_SINGLE_ELECTRICAL_SENSOR_REAL_TIME` type", () => {

            it("returns single charts state with selected sensor", () => {
                const valuePassedFromAction = {
                    type: "SELECT_SINGLE_ELECTRICAL_SENSOR_REAL_TIME",
                    payload: ["newSiteId", "newSensorId"]
                };
                const ret = charts(chartState, valuePassedFromAction);
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

            describe("returns the new electrical type", () => {

                it("[CASE: two different `measurementType` in state]", () => {
                    const valuePassedFromAction = {
                        type: "SELECT_ELECTRICAL_TYPE",
                        payload: [{
                            label: "labelTypeModify",
                            key: "keyTypeModify"
                        }]
                    };
                    const ret = charts(chartState, valuePassedFromAction);
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

                it("[CASE: two equal `measurementType` in state]", () => {

                    const valuePassedFromAction = {
                        type: "SELECT_ELECTRICAL_TYPE",
                        payload: [{
                            label: "labelTypeModify",
                            key: "keyTypeModify"
                        }]
                    };
                    const ret = charts(chartStateWithEqualMeasurementType, valuePassedFromAction);
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

        });

        describe("`SELECT_MULTIPLE_ELECTRICAL_SITE` type", () => {

            it("returns multiple charts with selected sensors", () => {
                const valuePassedFromAction = {
                    type: "SELECT_MULTIPLE_ELECTRICAL_SITE",
                    payload: ["site", "pod", "sensorId1", "sensorId2"]
                };
                const ret = charts(chartState, valuePassedFromAction);
                expect(ret).to.deep.equal([{
                    ...defaultChartStateFirstObject,
                    alarms: undefined
                }, {
                    ...defaultChartStateFirstObject,
                    alarms: undefined,
                    fullPath: ["site", "pod", "sensorId1", "sensorId2"],
                    site: "site",
                    sensorId: "sensorId2"
                }]);
            });

        });

        describe("`SELECT_ENVIRONMENTAL_SENSOR` type", () => {

            it("remove the second charts selection if the passed sensor is the same", () => {
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
                const ret = charts(chartState, valuePassedFromAction);
                expect(ret).to.deep.equal([defaultChartStateFirstObject]);
            });

            it("replace the second charts selection with the selected environmental sensor", () => {
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
                const ret = charts(chartState, valuePassedFromAction);
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

            it("returns the charts state with new source", () => {
                const valuePassedFromAction = {
                    type: "SELECT_SOURCE",
                    payload: [{
                        label: "labelSourceMod",
                        color: "color",
                        key: "keySourceMod"
                    }]
                };
                const ret = charts(chartState, valuePassedFromAction);
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

            it("returns multiple chart with different dateRange", () => {
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
                const ret = charts(chartState, valuePassedFromAction);
                const startOne = moment.utc(valuePassedFromAction.payload.dateOne)
                    .startOf("month").subtract({days: 2}).weekday(1).valueOf();
                const startTwo = moment.utc(valuePassedFromAction.payload.dateOne).startOf("day")
                    .subtract({weeks: 5}).weekday(1).valueOf();
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

            describe("returns the new charts filtered by date", () => {

                it("[CASE: `dateFilter`]", () => {
                    const valuePassedFromAction = {
                        type: "SELECT_DATE_RANGES",
                        payload: {
                            type: "dateFilter",
                            start: 1498749876543,
                            end: 1516543214890
                        }
                    };
                    const ret = charts(chartState, valuePassedFromAction);
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

                it("[CASE: `dateCompare`]", () => {
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
                    const ret = charts([chartStateFirstObject, chartStateSecondObject], valuePassedFromAction);
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

        });

        describe("`DISPLAY_ALARMS_ON_CHART` type", () => {

            var clock;
            before(() => {
                clock = sinon.useFakeTimers();
            });

            after(() => {
                clock.restore();
            });

            it("returns single charts notification of alarms associated to a selected sensor", () => {
                const valuePassedFromAction = {
                    type: "DISPLAY_ALARMS_ON_CHART",
                    payload: {
                        siteId: "site1",
                        sensorId: "sensorId",
                        alarms: [1498749876543, 1516543214890]
                    }
                };
                const ret = charts(chartState, valuePassedFromAction);
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

            it("remove the second selection in charts state", () => {
                const valuePassedFromAction = {
                    type: "REMOVE_ALL_COMPARE"
                };
                const ret = charts(chartState, valuePassedFromAction);
                expect(ret).to.deep.equal([defaultChartStateFirstObject]);
            });

        });


        it("returns the previous state if any correct `type` is checked", () => {
            const valuePassedFromAction = {
                type: "NOT_A_CORRECT_TYPE_CASE"
            };
            const ret = charts(chartState, valuePassedFromAction);
            expect(ret).to.deep.equal(chartState);
        });

    });

});
