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
        consumptionSensors: React.PropTypes.arrayOf(React.PropTypes.string),
        consumptionTypes: React.PropTypes.object,
        dateFilter: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.string
        ]),
        electricalSensors: React.PropTypes.arrayOf(React.PropTypes.string),
        getY2Label: React.PropTypes.func,
        getYLabel: React.PropTypes.func,
        misure: IPropTypes.map,
        sites: React.PropTypes.arrayOf(IPropTypes.map),
        tipologia: React.PropTypes.object,
        valori: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    mixins: [ReactPureRender],
    getCoordinates: function () {
        const self = this;
        const selectedSiteId = self.props.sites[0] ? self.props.sites[0].get("_id") : "";
        const selectedElectricalSensorId = self.props.electricalSensors[0];
        const selectedConsumptionSensorId = self.props.consumptionSensors[0];
        var selectedTipologia = [self.props.tipologia.key];
        if (self.props.consumptionTypes.key) {
            selectedTipologia = selectedTipologia.concat(self.props.consumption.key);
        }
        var result = [];
        self.props.misure
            .filter(measure => {
                return measure.get("sensorId") === selectedElectricalSensorId;
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
        if (R.prop(("label"), this.props.consumptionTypes)) {
            label = label.concat(R.prop(("label"), this.props.consumptionTypes));
        }
        return label;
    },
    getColors: function () {
        var colors = this.props.valori.map(R.prop("color"));
        if (R.prop(("color"), this.props.consumptionTypes)) {
            colors = colors.concat(R.prop(("color"), this.props.consumptionTypes));
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
                site={this.props.sites[0] || Immutable.Map()}
                xLabel=""
                y2label={this.props.getY2Label(this.props.consumptionTypes)}
                yLabel={this.props.getYLabel(this.props.tipologia)}
            />
        );
    }
});

module.exports = Radium(ValoriCompare);
