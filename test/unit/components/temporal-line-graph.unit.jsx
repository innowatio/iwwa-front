require("unit-setup.js");

describe("The TemporalLineGraph component", function () {

    var Dygraph = sinon.spy();

    var TemporalLineGraph = proxyquire("components/temporal-line-chart-new/", {
        "dygraphs/dygraphs-combined-dev.js": {
        Dygraph: Dygraph
        }
    });

    it("should update graph with new data when props change", function () {
        var instance = {
            props: {
                coordinates: []
            },
            chart: {
                updateOptions: sinon.spy()
            }
        };
        var newPropsWithChangedCoordinates = {
            coordinates: []
        };
        var newPropsWithUnchangedCoordinates = {
            coordinates: instance.props.coordinates
        };
        var cwrp = TemporalLineGraph.prototype.componentWillReceiveProps;
        cwrp.call(instance, newPropsWithUnchangedCoordinates);
        expect(instance.chart.updateOptions).to.have.callCount(0);
        instance.chart.updateOptions.reset();
        cwrp.call(instance, newPropsWithChangedCoordinates);
        expect(instance.chart.updateOptions).to.have.callCount(1);
    });
});
