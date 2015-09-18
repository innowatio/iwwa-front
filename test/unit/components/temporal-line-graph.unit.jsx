require("unit-setup.js");

describe("The TemporalLineGraph component", function () {

    var Dygraph = sinon.spy();

    var TemporalLineGraph = proxyquire("components/temporal-line-graph/", {
        "dygraphs/dygraphs-combined-dev.js": {
        Dygraph: Dygraph
        }
    });

    it("should update graph with new data when props change", function () {
        var instance = {
            props: {
                coordinates: [1]
            },
            graph: {
                updateOptions: sinon.spy()
            },
            getOptionsFromProps: sinon.spy(),
            getCoordinatesFromProps: sinon.spy()
        };
        var newPropsWithChangedCoordinates = {
            coordinates: [1, 2]
        };
        var cwrp = TemporalLineGraph.prototype.componentWillReceiveProps;
        cwrp.call(instance, newPropsWithChangedCoordinates);
        expect(instance.getOptionsFromProps).to.have.callCount(1);
        expect(instance.getCoordinatesFromProps).to.have.callCount(1);
    });

    it("should mount graph", function () {
        var instance = {
            drawGraph: sinon.spy()
        };
        var cwrp = TemporalLineGraph.prototype.componentDidMount;
        cwrp.call(instance);
        expect(instance.drawGraph).to.have.callCount(1);
    });
});
