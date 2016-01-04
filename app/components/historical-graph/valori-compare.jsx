var Immutable       = require("immutable");
var IPropTypes      = require("react-immutable-proptypes");
var moment          = require("moment");
var Radium          = require("radium");
var R               = require("ramda");
var React           = require("react");
var ReactPureRender = require("react-addons-pure-render-mixin");

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
        getY2Label: React.PropTypes.func,
        getYLabel: React.PropTypes.func,
        misure: IPropTypes.map,
        sensors: React.PropTypes.arrayOf(React.PropTypes.string),
        siti: React.PropTypes.arrayOf(IPropTypes.map),
        tipologia: React.PropTypes.object,
        valori: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    mixins: [ReactPureRender],
    getCoordinates: function () {
        const self = this;
        const selectedSiteId = self.props.siti[0] ? self.props.siti[0].get("_id") : "";
        const selectedSensorId = self.props.sensors[0];
        const selectedTipologia = [self.props.tipologia.key];
        // if (self.props.consumption.key) {
        //     selectedTipologia = selectedTipologia.concat(self.props.consumption.key);
        // }
        var result = [];
        self.props.misure
            .filter(measure => {
                return measure.get("sensorId") === selectedSensorId;
            })
            .sortBy(measure => measure.get("day"))
            .filter(measure => {
                if (self.props.dateFilter) {
                    const dateMeasure = moment(measure.get("day"), "YYYY-MM-DD").valueOf();
                    return (
                        self.props.dateFilter.start <= dateMeasure &&
                        self.props.dateFilter.end > dateMeasure
                    );
                }
                return true;
            })
            .forEach(measure => {
                result = R.concat(
                    result,
                    measuresUtils.convertByVariables(measure, selectedTipologia)
                );
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
                y2label={this.props.getY2Label(this.props.consumption)}
                yLabel={this.props.getYLabel(this.props.tipologia)}
            />
        );
    }
});

module.exports = Radium(ValoriCompare);
