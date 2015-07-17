var R     = require("ramda");
var React = require("react");

var AppPropTypes = require("lib/app-prop-types.js");

var TemporalLineGraph = React.createClass({
    propTypes: {
        coordinates: React.PropTypes.arrayOf(
            AppPropTypes.DygraphCoordinate
        ).isRequired,
        labels: React.PropTypes.array,
        xLabel: React.PropTypes.string.isRequired,
        yLabel: React.PropTypes.string.isRequired
    },
    getInitialState: function () {
        return {
            props: []
        }
    },
    componentDidMount: function () {
        this.drawGraph();
    },
    componentWillReceiveProps: function (nextProps) {
        this.graph.updateOptions({
            file: this.getCoordinatesFromProps(nextProps),
            xlabel: nextProps.xLabel,
            ylabel: nextProps.yLabel,
            labels: this.getLabelsFromProps(nextProps)
        });
    },
    getCoordinatesFromProps: function (props) {
        return (
            R.isEmpty(props.coordinates) ?
            [[0]] :
            props.coordinates
        );
    },
    getLabelsFromProps: function (props) {
        return (
            R.isEmpty(props.coordinates) ?
            ["Data"] :
            props.labels
        );
    },
    drawGraph: function () {
        var container = this.refs.graphContainer.getDOMNode();
        var coordinates = this.getCoordinatesFromProps(this.props);
        var options = {
            drawPoints: true,
            errorBars: true,
            labels: this.getLabelsFromProps(this.props),
            sigma: 2,
            strokeWidth: 1.5,
            xlabel: this.props.xLabel,
            ylabel: this.props.yLabel
        };
        /*
        *   Instantiating the graph automatically renders it to the page
        */
        this.graph = new Dygraph(container, coordinates, options);
    },
    render: function () {
        return (
            <div ref="graphContainer" style={{width: "100%", height: "100%"}} />
        );
    }
});

module.exports = TemporalLineGraph;
