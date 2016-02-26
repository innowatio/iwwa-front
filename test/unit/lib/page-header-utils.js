require("unit-setup.js");
import {fromJS} from "immutable";
import moment from "moment";

import * as pageHeaderUtils from "lib/page-header-utils";

describe("`page-header-utils` lib", () => {

    describe("`getTitleForSingleSensor` function ", () => {

        it("should return the expected string", () => {
            const collections = fromJS({
                sensors: {
                    sensor2: {
                        description: "Sensor 2"
                    }
                },
                sites: {
                    site1: {
                        name: "Sito 1"
                    }
                }
            });

            // ""
            const chart1 = {
                fullPath: []
            };
            const expected1 = "";
            expect(pageHeaderUtils.getTitleForSingleSensor(chart1, collections)).to.be.equals(expected1);

            const chart2 = {
                fullPath: undefined
            };
            const expected2 = "";
            expect(pageHeaderUtils.getTitleForSingleSensor(chart2, collections)).to.be.equals(expected2);

            // NameSito
            const chart3 = {
                fullPath: ["site1"]
            };
            const expected3 = "Sito 1";
            expect(pageHeaderUtils.getTitleForSingleSensor(chart3, collections)).to.be.equals(expected3);

            // NameSito · NamePod/Sensor
            const chart4 = {
                fullPath: ["site1", "pod1", "sensor2"]
            };
            const expected4 = "Sito 1 · Sensor 2";
            expect(pageHeaderUtils.getTitleForSingleSensor(chart4, collections)).to.be.equals(expected4);

            // NameSito · NamePod/Sensor
            const chart5 = {
                fullPath: ["site1", "pod1", "sensor3"]
            };
            const expected5 = "Sito 1 · sensor3";
            expect(pageHeaderUtils.getTitleForSingleSensor(chart5, collections)).to.be.equals(expected5);
        });

    });

    describe("`getStringPeriod` function", () => {

        var clock;

        before(() => {
            clock = sinon.useFakeTimers();
        });

        after(() => {
            clock.restore();
        });

        it("returns a single date in format `YYYY-MM` [CASE: date.type !== `dateCompare`]`", () => {
            const date = {
                type: "notDateCompare",
                end: moment("2016-02-5", "YYYY-MM-DD").valueOf()
            };
            const ret = pageHeaderUtils.getStringPeriod(date);
            expect(ret).to.equal("Feb 2016");
        });

        it("returns a single date in format `YYYY-MM` [CASE: date.type === `dateCompare`]`", () => {
            const date = {
                type: "dateCompare",
                period: {
                    key: "months"
                }
            };
            const ret = pageHeaderUtils.getStringPeriod(date);
            expect(ret).to.equal("Jan 1970 & Dec 1969");
        });

    });

    describe("`getSensorName` function", () => {

        it("returns the description of the selected sensor [CASE: it exist in sensors collection]", () => {
            const collection = fromJS({
                sensors: {
                    sensor1: {
                        description: "sensore Number 1"
                    }
                }
            });
            const ret = pageHeaderUtils.getSensorName("sensor1", collection);
            expect(ret).to.equal("sensore Number 1");
        });

        it("returns the description of the selected sensor [CASE: it not exist in sensors collection]", () => {
            const collection = fromJS({
                sensors: {
                    sensor1: {}
                }
            });
            const ret = pageHeaderUtils.getSensorName("sensor1", collection);
            expect(ret).to.equal("sensor1");
        });

    });

    describe("`getSiteName` function", () => {

        it("returns the name of the selected site", () => {
            const getSiteName = pageHeaderUtils.__get__("getSiteName");
            const collection = fromJS({
                sites: {
                    site1: {
                        name: "Site 1"
                    }
                }
            });
            const ret = getSiteName("site1", collection);
            expect(ret).to.equal("Site 1");
        });

    });

});
