require("unit-setup.js");

import Immutable from "immutable";


var PageContainer = proxyquire("components/page-container/", {
    render: function () {
        return ;
    }
});

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
            const chart1 = {
                fullPath: ["site1"]
            };

            var pageContainerElement = TestUtils.renderIntoDocument(
                <PageContainer
                    asteroid={asteroid}
                    children={(<div/>)}
                    collections={collections}
                />
            );

            const expected1 = "Sito 1";
            expect(expected1).to.be.equals(pageContainerElement.getTitleForSingleSensor(chart1));

            // NameSito · NamePod/Sensor
            const chart2 = {
                fullPath: ["site1", "pod1", "sensor2"]
            };

            const expected2 = "Sito 1 · Sensor 2";
            expect(expected2).to.be.equals(pageContainerElement.getTitleForSingleSensor(chart2));

            // NameSito · NamePod/Sensor
            const chart3 = {
                fullPath: ["site1", "pod1", "sensor3"]
            };

            const expected3 = "Sito 1 · sensor3";
            expect(expected3).to.be.equals(pageContainerElement.getTitleForSingleSensor(chart3));
        });
    });
});
