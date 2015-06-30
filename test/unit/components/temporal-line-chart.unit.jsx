require("unit-setup.js");

var TemporalLineChart = proxyquire("components/temporal-line-chart/", {});

// describe("Checking props validation", function () {
//     it("x must represent a date", function () {
//         var isDateEquivalent = TemporalLineChart[1];
//         var inProps = {
//             x: "definitelyNotAdate",
//             y: 1
//         };
//         var resultApply = isDateEquivalent.apply(TemporalLineChart, [inProps, "x"]);
//
//         expect(resultApply).to.eql(new Error("x must represent a date"));
//     });
// });
