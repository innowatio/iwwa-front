var React      = require("react");

var utils = require("lib/utils.js");

var TemporalLineGraph = React.createClass({
    propTypes: {
        coordinates: React.PropTypes.arrayOf(
            utils.isDateEquivalent,
            React.PropTypes.arrayOf(
                React.PropTypes.number,
                React.PropTypes.number
            )
        ).isRequired
    },
    mixins: [React.addons.PureRenderMixin],
    // getDefaultProps: function () {
    //     return {
    //     };
    // },
    // getInitialState: function () {
    //     this.props.coordinates.push(); // push(this.coordinates); // new vis.DataSet();
    //     return {};
    // },
    componentDidMount: function () {
        this.drawCharts();
    },
    componentWillReceiveProps: function (nextProp) {
        if (!(nextProp.coordinates === this.props.coordinates)) {
            this.chart.updateOptions({
                "file": this.props.coordinates
            });
        }
    },
    drawCharts: function () {
        var container = this.refs.linechart.getDOMNode();
        var options = {
            errorBars: true,
            drawPoints: true,
            ylabel: "Misura",
            xlabel: "Data",
            strokeWidth: 1.5 // Largezza della linea
        };
        /*
        *   Instantiating the graph automatically renders it to the page
        */
        this.chart = new Dygraph(container, this.props.coordinates, options);
    },
    render: function () {
        return (
            <div ref="linechart" style={{width: "100%", height: "500px"}} />
        );
    }
});

module.exports = TemporalLineGraph;
