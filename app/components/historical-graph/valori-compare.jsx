var Immutable  = require("immutable");
var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");

var components    = require("components");
var measuresUtils = require("lib/collection-utils").measures;

var ValoriCompare = React.createClass({
    propTypes: {
        alarms: React.PropTypes.arrayOf(React.PropTypes.number),
        consumption: React.PropTypes.object,
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
        var selectedPod = this.props.siti[0] ? this.props.siti[0].get("pod") : "";
        var selectedTipologia = [this.props.tipologia.key];
        if (this.props.consumption.key) {
            selectedTipologia = selectedTipologia.concat(this.props.consumption.key);
        }
        var result = [];

        this.props.misure
            .filter(function (measure) {
                return measure.get("podId") === selectedPod;
            })
            .forEach(function (measure) {
                result = R.concat(result, measuresUtils.convertByVariables(measure, selectedTipologia));
            });
        return result;
    },
    getLabels: function () {
        var label = ["Data"].concat(
            R.map(R.prop("label"), this.props.valori)
        );
        if (R.prop(("label"), this.props.consumption)) {
            label = label.concat(R.prop(("label"), this.props.consumption));
        }
        return label;
    },
    getColors: function () {
        var colors = this.props.valori.map(R.prop("color"));
        if (R.prop(("color"), this.props.consumption)) {
            colors = colors.concat(R.prop(("color"), this.props.consumption));
        }
        return colors;
    },
    render: function () {
        return (
            <components.TemporalLineGraph
                alarms={this.props.alarms}
                colors={this.getColors()}
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
