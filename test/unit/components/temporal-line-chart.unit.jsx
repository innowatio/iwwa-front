require("unit-setup.js");

var TemporalLineChart = proxyquire("components/temporal-line-chart/", {});

describe("Checking props validation", function () {
    it("Check isDateEquivalent function", function () {
        var badString = TemporalLineChart.isDateEquivalent({notAdate: "sajdhask"}, "notAdate");
        console.log(badString);
        // expect(badString).to.match("x must represent a date");
    });
});
