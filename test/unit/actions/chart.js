require("unit-setup.js");

import * as chart from "actions/chart";

describe("`chart` actions", () => {

    describe("`selectSingleElectricalSensor` function", () => {

        it("should return the correct object if is passed an array with string as parameter", () => {
            const fullPath = ["siteId", "podId", "sensorId"];
            const ret = chart.selectSingleElectricalSensor(fullPath);
            expect(ret).to.deep.equal({
                type: "SELECT_SINGLE_ELECTRICAL_SENSOR_CHART",
                payload: ["siteId", "podId", "sensorId"]
            });
        });

        it("should throw if isn't passed `fullPath` parameter", () => {
            const sensor = {sensor: "sensorId"};
            function troubleMaker () {
                chart.selectSingleElectricalSensor(sensor);
            }
            expect(troubleMaker).to.throw();
        });

    });

    describe("`selectElectricalType` function", () => {

        it("should return the correct object if is passed an array of object with `label` and `key` keys", () => {
            const type = [{
                label: "label",
                key: "key"
            }];
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
                iconClass: "icon",
                iconColor: "icon-color",
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

        it("should return the correct object if are passed a fullPath", () => {
            const fullPath = ["siteId1", "pod1", "sensorId1"];
            const ret = chart.selectMultipleElectricalSensor(fullPath);
            expect(ret).to.deep.equal({
                type: "SELECT_MULTIPLE_ELECTRICAL_SITE",
                payload: fullPath
            });
        });

        it("should throw if aren't passed the correct object", () => {
            const source = "site";
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
                end: 1449158137862,
                valueType: {
                    label: "label",
                    key: "key"
                }
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
            const value = {
                period: {
                    label: "label",
                    key: "key"
                },
                dateOne: Date.now()
            };
            const ret = chart.selectDateRangesCompare(value);
            expect(ret).to.deep.equal({
                type: "SELECT_DATE_RANGES_COMPARE",
                payload: value
            });
        });

        it("should return an `Error` if isn't passed the correct object", () => {
            const dateRanges = ({
                label: "label",
                key: "key"
            },
            1234
            );
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

    describe("`setZoomExtremes`", () => {

        it("should return the correct object", () => {
            const zoomExtremes = [{
                max: 123,
                min: 456
            }];
            const ret = chart.setZoomExtremes(zoomExtremes);
            expect(ret).to.deep.equal({
                type: "SET_ZOOM_EXTREMES",
                payload: zoomExtremes
            });
        });

        it("should return an `Error` if isn't passed the correct object", () => {
            const zoomExtremes = {
                max: "max",
                min: "min"
            };
            function troubleMaker () {
                chart.setZoomExtremes(zoomExtremes);
            }
            expect(troubleMaker).to.throw();
        });
    });

});
