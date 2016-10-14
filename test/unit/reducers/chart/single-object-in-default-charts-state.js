import moment from "lib/moment";

import chartReducer from "reducers/chart";

describe("`chart` reducer", () => {

    describe("`charts` reducer [CASE: single object in default state array]", () => {

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
                valueType: {label: "calendario", key: "calendar"},
                start: 1449157137862,
                end: 1449157157862
            },
            source: {
                label: "labelSource",
                color: "color",
                key: "keySource"
            }
        });

        const charts = chartReducer.__get__("charts");
        const chartState = Object.freeze([defaultChartStateObject]);

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
                    ...defaultChartStateObject,
                    alarms: undefined,
                    site: "newSiteId",
                    fullPath: ["newSiteId", "newSensorId"],
                    sensorId: "newSensorId"
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
                    ...defaultChartStateObject,
                    alarms: undefined,
                    site: "newSiteId",
                    fullPath: ["newSiteId", "newSensorId"],
                    sensorId: "newSensorId"
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
                    ...defaultChartStateObject,
                    alarms: undefined,
                    site: "newSiteId",
                    fullPath: ["newSiteId", "newSensorId"],
                    sensorId: "newSensorId"
                }]);
            });

        });

        describe("`SELECT_ELECTRICAL_TYPE` type", () => {

            it("returns the new electrical type", () => {
                const valuePassedFromAction = {
                    type: "SELECT_ELECTRICAL_TYPE",
                    payload: [{
                        label: "labelTypeModify",
                        key: "keyTypeModify"
                    }]
                };
                const ret = charts(chartState, valuePassedFromAction);
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

            it("returns multiple charts with selected sensors", () => {
                const valuePassedFromAction = {
                    type: "SELECT_MULTIPLE_ELECTRICAL_SITE",
                    payload: ["site", "pod", "sensorId1", "sensorId2"]
                };
                const ret = charts(chartState, valuePassedFromAction);
                expect(ret).to.deep.equal([{
                    ...defaultChartStateObject,
                    alarms: undefined
                }, {
                    ...defaultChartStateObject,
                    alarms: undefined,
                    fullPath: ["site", "pod", "sensorId1", "sensorId2"],
                    site: "site",
                    sensorId: "sensorId2"
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
                            label: "Years",
                            key: "years"
                        },
                        dateOne: new Date("Thu Dec 03 2015 16:38:57 GMT+0100 (CET)").getTime()
                    }
                };
                const ret = charts(chartState, valuePassedFromAction);
                const startOne = moment.utc(valuePassedFromAction.payload.dateOne)
                    .startOf("month").subtract({days: 2}).weekday(1).valueOf();
                const startTwo = moment.utc(valuePassedFromAction.payload.dateOne).startOf("day")
                    .subtract({weeks: moment.utc().weeksInYear()}).weekday(1).valueOf();
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

            it("returns the environmental sensor as second selection of charts", () => {
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
                const ret = charts(chartState, valuePassedFromAction);
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

            describe("returns the charts state with new source", () => {

                it("[CASE: single source]", () => {
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
                        ...defaultChartStateObject,
                        alarms: undefined,
                        source: {
                            label: "labelSourceMod",
                            color: "color",
                            key: "keySourceMod"
                        }
                    }]);
                });

                it("[CASE: multiple source]", () => {
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
                    const ret = charts(chartState, valuePassedFromAction);
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

        });

        describe("`SELECT_DATE_RANGES` type", () => {

            it("returns the new charts filtered by date [CASE: empty valueType in payload]", () => {
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
                    ...defaultChartStateObject,
                    date: {
                        type: "dateFilter",
                        valueType: {},
                        start: 1498749876543,
                        end: 1516543214890
                    }
                }]);
            });

            it("returns the new charts filtered by date [CASE: valueType in payload]", () => {
                const valuePassedFromAction = {
                    type: "SELECT_DATE_RANGES",
                    payload: {
                        type: "dateFilter",
                        valueType: {label: "calendario", key: "calendar"},
                        start: 1498749876543,
                        end: 1516543214890
                    }
                };
                const ret = charts(chartState, valuePassedFromAction);
                expect(ret).to.deep.equal([{
                    ...defaultChartStateObject,
                    date: {
                        type: "dateFilter",
                        valueType: {label: "calendario", key: "calendar"},
                        start: 1498749876543,
                        end: 1516543214890
                    }
                }]);
            });

        });

        describe("`DISPLAY_ALARMS_ON_CHART` type", () => {

            it("returns single charts notification of alarms associated to a selected sensor [CASE: empty valueType in payload]", () => {
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
                    ...defaultChartStateObject,
                    alarms: [1498749876543, 1516543214890],
                    site: "site1",
                    sensorId: "sensorId",
                    fullPath: ["site1"],
                    date: {
                        start: moment.utc(1516543214890).startOf("month").valueOf(),
                        end: moment.utc(1516543214890).endOf("month").valueOf(),
                        type: "dateFilter",
                        valueType: {}
                    }
                }]);
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
