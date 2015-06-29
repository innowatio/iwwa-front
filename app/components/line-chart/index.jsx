var React = require("react");
var vis = require("vis/dist/vis.js");

var LineChart = React.createClass({
    componentDidMount: function () {
        this.drawCharts();
    },
    componentDidUpdate: function () {
        this.drawCharts();
    },
    drawCharts: function () {
        // var container = document.getElementById(this.props.name);
        var container = this.refs.linechart.getDOMNode();
        var dataset = new vis.DataSet([
            {x: "2015-06-11", y: 10},
            {x: "2015-06-12", y: 25},
            {x: "2015-06-13", y: 30},
            {x: "2015-06-14", y: 10},
            {x: "2015-06-15", y: 15},
            {x: "2015-06-16", y: 30}
        ]);

        var options = {
            start: "2015-06-11",
            end: "2015-06-16"
        };

        var Graph2d = new vis.Graph2d(container, dataset, options);
    },
    render: function () {
        return (
            <div ref="linechart"></div>
        );
    }
});

module.exports = LineChart;
