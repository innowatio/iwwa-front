var R     = require("ramda");
var React = require("react");

var AppPropTypes = require("lib/app-prop-types.js");


var styles = {
    graphContainer: {
        width: "calc(100vw - 100px)",
        height: "calc(100vh - 300px)",
        marginBottom: "25px",
        margin: "auto"
    }
};

var TemporalLineGraph = React.createClass({
    propTypes: {
        colors: React.PropTypes.arrayOf(React.PropTypes.string),
        coordinates: React.PropTypes.arrayOf(
            AppPropTypes.DygraphCoordinate
        ).isRequired,
        dateWindow: React.PropTypes.arrayOf(React.PropTypes.number),
        labels: React.PropTypes.array,
        lockInteraction: React.PropTypes.bool,
        showRangeSelector: React.PropTypes.bool,
        xLabel: React.PropTypes.string,
        xLegendFormatter: React.PropTypes.func,
        xTicker: React.PropTypes.func,
        yLabel: React.PropTypes.string
    },
    componentDidMount: function () {
        this.drawGraph();
    },
    componentWillReceiveProps: function (nextProps) {
        var options = this.getOptionsFromProps(nextProps);
        this.graph.updateOptions(R.merge(options, {
            file: this.getCoordinatesFromProps(nextProps)
        }));
    },
    getCoordinatesFromProps: function (props) {
        return (
            R.isEmpty(props.coordinates) ?
            [[0]] :
            props.coordinates
        );
    },
    getOptionsFromProps: function (props) {
        var options = {
            drawPoints: true,
            errorBars: true,
            hideOverlayOnMouseOut: false,
            labels: this.getLabelsFromProps(props),
            labelsSeparateLines: true,
            legend: "always",
            sigma: 2,
            strokeWidth: 1.5,
            xlabel: props.xLabel,
            ylabel: props.yLabel,
            axes: {
                x: {},
                y: {}
            }
        };
        if (props.colors) {
            options.colors = props.colors;
        }
        if (props.dateWindow) {
            options.dateWindow = props.dateWindow;
        }
        if (props.lockInteraction) {
            options.interactionModel = {};
        }
        if (props.xLegendFormatter) {
            options.axes.x.valueFormatter = props.xLegendFormatter;
        }
        if (props.xTicker) {
            options.axes.x.ticker = props.xTicker;
        }
        return options;
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
        var options = this.getOptionsFromProps(this.props);
        /*
        *   Instantiating the graph automatically renders it to the page
        */
        this.graph = new Dygraph(container, coordinates, options);
    },
    render: function () {
        return (
            <div ref="graphContainer" style={styles.graphContainer} />
        );
    }
});

module.exports = TemporalLineGraph;
