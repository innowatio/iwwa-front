require("unit-setup.js");

import * as chart from "actions/chart";

describe("`chart` actions", () => {

    describe("`selectSingleSite` function", () => {

        it("should return the correct object if is passed an array with one string as parameter", () => {
            const siteId = ["siteId"];
            const ret = chart.selectSingleSite(siteId);
            expect(ret).to.deep.equal({
                type: "SELECT_SINGLE_SITE",
                payload: ["siteId"]
            });
        });

        it("should throw if isn't passed an array with one string as parameter", () => {
            const siteId = ["siteId", "anotherString"];
            function troubleMaker () {
                chart.selectSingleSite(siteId);
            }
            expect(troubleMaker).to.throw();
        });

    });

    describe("`selectType` function", () => {

        it("should return the correct object if is passed an object with `label` and `key` keys", () => {
            const type = {
                label: "label",
                key: "key"
            };
            const ret = chart.selectType(type);
            expect(ret).to.deep.equal({
                type: "SELECT_TYPE",
                payload: type
            });
        });

        it("should throw if isn't passed passed an object with `label` and `key` keys", () => {
            const type = {label: "label"};
            function troubleMaker () {
                chart.selectType(type);
            }
            expect(troubleMaker).to.throw();
        });

    });

    describe("`selectEnvironmental` function", () => {

        it("should return the correct object if is passed an object with the correct keys", () => {
            const type = {
                label: "label",
                key: "key",
                color: "color",
                icon: "icon",
                selected: "selected"
            };
            const ret = chart.selectEnvironmental(type);
            expect(ret).to.deep.equal({
                type: "SELECT_ENVIRONMENTAL",
                payload: type
            });
        });

        it("should throw if isn't passed an object with the correct keys", () => {
            const type = {label: "label"};
            function troubleMaker () {
                chart.selectEnvironmental(type);
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
                type: "SELECT_SOURCES",
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

    describe("`selectMultipleSite` function", () => {

        it("should return the correct object if is passed an array with two string", () => {
            const sitesId = ["siteId1", "siteId2"];
            const ret = chart.selectMultipleSite(sitesId);
            expect(ret).to.deep.equal({
                type: "SELECT_MULTIPLE_SITE",
                payload: sitesId
            });
        });

        it("should throw if isn't passed an array with two string", () => {
            const source = ["site"];
            function troubleMaker () {
                chart.selectMultipleSite(source);
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
                type: "SELECT_DATA_RANGES_COMPARE",
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
