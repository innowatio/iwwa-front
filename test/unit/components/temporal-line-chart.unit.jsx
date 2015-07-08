// require("unit-setup.js");
//
// describe("The TemporalLineChart component ", function () {
//
//     var Graph2d = sinon.spy();
//
//     var TemporalLineChart = proxyquire("components/temporal-line-chart/", {
//         "vis/dist/vis.js": {
//             Graph2d: Graph2d
//         }
//     });
//
//     afterEach(function () {
//         Graph2d.reset();
//     });
//
//     it("should attach a vis.Graph2d to its main DOM element", function () {
//         var coords = [
//             {x: 1, y: 1},
//             {x: 2, y: 2}
//         ];
//         var chart = TestUtils.renderIntoDocument(
//             <TemporalLineChart coordinates={coords} />
//         );
//         var expectedOptions = {
//             moveable: false
//         };
//         var div = TestUtils.findRenderedDOMComponentWithTag(chart, "div").getDOMNode();
//         expect(Graph2d).to.have.been.calledWith(div, coords, expectedOptions);
//         expect(Graph2d.calledWithNew()).to.equal(true);
//     });
//
//     it("should attach the vis.Graph2d object to the component instance", function () {
//         var coords = [
//             {x: 1, y: 1},
//             {x: 2, y: 2}
//         ];
//         var chart = TestUtils.renderIntoDocument(
//             <TemporalLineChart coordinates={coords} />
//         );
//         expect(chart.chart).to.be.an.instanceOf(Graph2d);
//     });
//
//     it("should make the graph moveable if we set the moveable prop", function () {
//         var coords = [
//             {x: 1, y: 1},
//             {x: 2, y: 2}
//         ];
//         var chart = TestUtils.renderIntoDocument(
//             <TemporalLineChart coordinates={coords} moveable={true} />
//         );
//         var expectedOptions = {
//             moveable: true
//         };
//         var div = TestUtils.findRenderedDOMComponentWithTag(chart, "div").getDOMNode();
//         expect(Graph2d).to.have.been.calledWith(div, coords, expectedOptions);
//     });
//
// });
