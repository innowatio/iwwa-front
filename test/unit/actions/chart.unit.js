require("unit-setup.js");

import * as chart from "actions/chart";

describe("`chart` actions", () => {

    describe("`selectSingleSensor` function", () => {

        it("should return the correct object if is passed an array with one string as parameter", () => {
            const selectedSensor = {sensor: "sensorId", site: "siteId"};
            const ret = chart.selectSingleElectricalSensor(selectedSensor);
            expect(ret).to.deep.equal({
                type: "SELECT_SINGLE_ELECTRICAL_SENSOR",
                payload: {
                    sensor: "sensorId",
                    site: "siteId"
                }
            });
        });

        it("should throw if isn't passed `siteId` parameter", () => {
            const sensor = {sensor: "sensorId"};
            function troubleMaker () {
                chart.selectSingleElectricalSensor(sensor);
            }
            expect(troubleMaker).to.throw();
        });

        it("should throw if isn't passed `sensorId` parameter", () => {
            const site = {site: "sitesId"};
            function troubleMaker () {
                chart.selectSingleElectricalSensor(site);
            }
            expect(troubleMaker).to.throw();
        });

    });

    describe("`selectElectricalType` function", () => {

        it("should return the correct object if is passed an object with `label` and `key` keys", () => {
            const type = {
                label: "label",
                key: "key"
            };
            const ret = chart.selectElectricalType(type);
            expect(ret).to.deep.equal({
                type: "SELECT_ELECTRICAL_TYPE",
                payload: type
            });
        });

        it("should throw if isn't passed passed an object with `label` and `key` keys", () => {
            const type = {label: "label"};
            function troubleMaker () {
                chart.selectElectricalType(type);
            }
            expect(troubleMaker).to.throw();
        });

    });

    describe("`selectEnvironmentalSensor` function", () => {

        it("should return the correct object if is passed an object with the correct keys", () => {
            const sensorId = ["sensorId"];
            const type = [{
                label: "label",
                key: "key",
                color: "color",
                icon: "icon",
                selected: "selected"
            }];
            const ret = chart.selectEnvironmentalSensor(sensorId, type);
            expect(ret).to.deep.equal({
                type: "SELECT_ENVIRONMENTAL_SENSOR",
                payload: {
                    sensorId,
                    type
                }
            });
        });

        it("should throw if isn't passed an object with the correct keys", () => {
            const type = {label: "label"};
            function troubleMaker () {
                chart.selectEnvironmentalSensor(type);
            }
            expect(troubleMaker).to.throw();
        });

    });

    describe("`selectSource` function", () => {

        it("should return the correct object if is passed an array with the correct object", () => {
            const source = [{
                label: "label",
                key: "key",
                color: "color"
            }];
            const ret = chart.selectSource(source);
            expect(ret).to.deep.equal({
                type: "SELECT_SOURCE",
                payload: source
            });
        });

        it("should throw if isn't passed an array with the correct object", () => {
            const source = [];
            function troubleMaker () {
                chart.selectSource(source);
            }
            expect(troubleMaker).to.throw();
        });

    });

    describe("`selectMultipleElectricalSensor` function", () => {

        it("should return the correct object if are passed two sites and two sensors", () => {
            const sites = ["siteId1", "siteId2"];
            const sensors = ["sensorId1", "sensorId1"];
            const ret = chart.selectMultipleElectricalSensor(sensors, sites);
            expect(ret).to.deep.equal({
                type: "SELECT_MULTIPLE_ELECTRICAL_SENSOR",
                payload: {sites, sensors}
            });
        });

        it("should return the correct object if are passed a sites and two sensors", () => {
            const sites = ["siteId1"];
            const sensors = ["sensorId1", "sensorId1"];
            const ret = chart.selectMultipleElectricalSensor(sensors, sites);
            expect(ret).to.deep.equal({
                type: "SELECT_MULTIPLE_ELECTRICAL_SENSOR",
                payload: {sites, sensors}
            });
        });

        it("should throw if aren't passed the correct object", () => {
            const source = ["site"];
            function troubleMaker () {
                chart.selectMultipleElectricalSensor(source);
            }
            expect(troubleMaker).to.throw();
        });

    });

    describe("`selectDateRanges` function", () => {

        it("should return the correct object if is passed an array with the correct object", () => {
            const dateRanges = {
                start: 1449157137862,
                end: 1449158137862
            };
            const ret = chart.selectDateRanges(dateRanges);
            expect(ret).to.deep.equal({
                type: "SELECT_DATE_RANGES",
                payload: dateRanges
            });
        });

        it("should return an `Error` if isn't passed an array with the correct object", () => {
            const dateRanges = {
                start: 1449157137862,
                end: "Thu Dec 03 2015 16:57:56 GMT+0100 (CET)"
            };
            function troubleMaker () {
                chart.selectDateRanges(dateRanges);
            }
            expect(troubleMaker).to.throw();
        });

    });

    describe("`selectDateRangesCompare` function", () => {

        it("should return the correct object if is passed the correct object", () => {
            const dateRangesCompare = {
                period: {
                    label: "label",
                    key: "key"
                },
                dateOne: 1449157137862
            };
            const ret = chart.selectDateRangesCompare(dateRangesCompare);
            expect(ret).to.deep.equal({
                type: "SELECT_DATE_RANGES_COMPARE",
                payload: dateRangesCompare
            });
        });

        it("should return an `Error` if isn't passed the correct object", () => {
            const dateRanges = {
                period: {
                    label: "label",
                    key: "key"
                },
                dateOne: "Thu Dec 03 2015 16:57:56 GMT+0100 (CET)"
            };
            function troubleMaker () {
                chart.selectDateRangesCompare(dateRanges);
            }
            expect(troubleMaker).to.throw();
        });

    });

    describe("`removeAllCompare`", () => {

        it("should return the correct object", () => {
            const ret = chart.removeAllCompare();
            expect(ret).to.deep.equal({
                type: "REMOVE_ALL_COMPARE"
            });
        });

    });

});
