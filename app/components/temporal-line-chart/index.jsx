var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");
var vis        = require("vis/dist/vis.js");

var utils = require("lib/utils.js");

var TemporalLineChart = React.createClass({
    propTypes: {
        clickToUse: React.PropTypes.bool,
        coordinates: IPropTypes.iterableOf(React.PropTypes.shape({
            id: React.PropTypes.string,
            x: utils.isDateEquivalent,
            y: React.PropTypes.number
        })).isRequired,
        moveable: React.PropTypes.bool
    },
    mixins: [React.addons.PureRenderMixin],
    getDefaultProps: function () {
        return {
            clickToUse: true,
            moveable: true
        };
    },
    getInitialState: function () {
        this.dataset = new vis.DataSet();
        return {};
    },
    componentDidMount: function () {
        this.drawCharts();
    },
    componentWillReceiveProps: function (props) {
        var self = this;
        self.dataset.clear();
        props.coordinates
            // .filter(function (coordinate) {
            //     return !self.dataset.get(coordinate.id);
            // })
            .forEach(function (coordinate) {
                self.dataset.add(coordinate);
            });
    },
    drawCharts: function () {
        var container = this.refs.linechart.getDOMNode();
        var options = {
            clickToUse: this.props.clickToUse,
            moveable: this.props.moveable,
            interpolation: true
        };
        /*
        *   Instantiating the graph automatically renders it to the page
        */
        this.chart = new vis.Graph2d(container, this.dataset, options);
    },
    render: function () {
        return (
            <div ref="linechart" />
        );
    }
});

module.exports = TemporalLineChart;
