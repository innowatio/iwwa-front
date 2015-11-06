var Immutable  = require("immutable");
var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");

var components    = require("components");
// var formatValue   = require("./format-value");
var measuresUtils = require("lib/collection-utils").measures;

var ValoriCompare = React.createClass({
    propTypes: {
        alarms: React.PropTypes.arrayOf(React.PropTypes.number),
        dateFilter: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.string
        ]),
        getYLabel: React.PropTypes.func,
        misure: IPropTypes.map,
        siti: React.PropTypes.arrayOf(IPropTypes.map),
        tipologia: React.PropTypes.object,
        valori: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    mixins: [React.addons.PureRenderMixin],
    getCoordinates: function () {
        var self = this;
        if (self.props.misure.size === 0) {
            return [];
        }
        return measuresUtils.convertByVariables(self.props.misure.first(), [self.props.tipologia.key]);
    },
    getLabels: function () {
        return ["Data"].concat(
            R.map(R.prop("label"), this.props.valori)
        );
    },
    render: function () {
        return (
            <components.TemporalLineGraph
                alarms={this.props.alarms}
                colors={this.props.valori.map(R.prop("color"))}
                coordinates={this.getCoordinates()}
                dateFilter={this.props.dateFilter}
                labels={this.getLabels()}
                ref="temporalLineGraph"
                showRangeSelector={true}
                sito={this.props.siti[0] || Immutable.Map()}
                xLabel=""
                yLabel={this.props.getYLabel(this.props.tipologia)}
            />
        );
    }
});

module.exports = Radium(ValoriCompare);
