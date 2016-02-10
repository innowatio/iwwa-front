require("unit-setup.js");

import Immutable from "immutable";


var PageContainer = proxyquire("components/page-container/", {});

describe("The `PageContainer` component ", function () {

    describe("the `getTitleForSingleSensor` function ", function () {
        it("should return the expected string", function () {
            // NameSito
            const asteroid = {
                subscribe: function () {
                    return ;
                }
            };
            const collections = Immutable.fromJS({
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

            var pageContainerElement = TestUtils.renderIntoDocument(
                <PageContainer
                    asteroid={asteroid}
                    children={(<div/>)}
                    collections={collections}
                />
            );

            // ""
            const chart1 = {
                fullPath: []
            };
            const expected1 = "";
            expect(pageContainerElement.getTitleForSingleSensor(chart1)).to.be.equals(expected1);

            const chart2 = {
                fullPath: undefined
            };
            const expected2 = "";
            expect(pageContainerElement.getTitleForSingleSensor(chart2)).to.be.equals(expected2);

            // NameSito
            const chart3 = {
                fullPath: ["site1"]
            };
            const expected3 = "Sito 1";
            expect(pageContainerElement.getTitleForSingleSensor(chart3)).to.be.equals(expected3);

            // NameSito · NamePod/Sensor
            const chart4 = {
                fullPath: ["site1", "pod1", "sensor2"]
            };
            const expected4 = "Sito 1 · Sensor 2";
            expect(pageContainerElement.getTitleForSingleSensor(chart4)).to.be.equals(expected4);

            // NameSito · NamePod/Sensor
            const chart5 = {
                fullPath: ["site1", "pod1", "sensor3"]
            };
            const expected5 = "Sito 1 · sensor3";
            expect(pageContainerElement.getTitleForSingleSensor(chart5)).to.be.equals(expected5);
        });
    });
});
