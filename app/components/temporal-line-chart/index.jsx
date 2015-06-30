var React = require("react");
var vis   = require("vis/dist/vis.js");

var utils = require("lib/utils.js");

var TemporalLineChart = React.createClass({
    propTypes: {
        coordinates: React.PropTypes.arrayOf(React.PropTypes.shape({
            x: utils.isDateEquivalent,
            y: React.PropTypes.number
        })).isRequired,
        moveable: React.PropTypes.bool
    },
    getDefaultProps: function () {
        return {
            moveable: false
        };
    },
    componentDidMount: function () {
        this.drawCharts();
    },
    drawCharts: function () {
        var container = this.refs.linechart.getDOMNode();
        var dataset = this.props.coordinates;
        var options = {
            moveable: this.props.moveable
        };
        /*
        *   Instantiating the graph automatically renders it to the page
        */
        var chart = new vis.Graph2d(container, dataset, options);
        this.setState({
            chart: chart
        });
    },
    render: function () {
        return (
            <div className="ac-temporal-line-chart" ref="linechart"></div>
        );
    }
});

module.exports = TemporalLineChart;
