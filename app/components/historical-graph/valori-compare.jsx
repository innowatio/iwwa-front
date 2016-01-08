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
        electricalTypes: React.PropTypes.object,
        getY2Label: React.PropTypes.func,
        getYLabel: React.PropTypes.func,
        misure: IPropTypes.map,
        sites: React.PropTypes.arrayOf(IPropTypes.map),
        sources: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    mixins: [ReactPureRender],
    getCoordinates: function () {
        const self = this;
        const selectedSiteId = self.props.sites[0] ? self.props.sites[0].get("_id") : "";
        var sensors = self.props.electricalSensors;
        var selectedTypes = [self.props.electricalTypes.key];
        if (self.props.consumptionSensors[0]) {
            sensors = sensors.concat(self.props.consumptionSensors);
            selectedTypes = selectedTypes.concat(self.props.consumptionTypes.key);
        }
        return measuresUtils.convertBySensorsAndVariable(self.props.misure, sensors, selectedTypes, self.props.dateFilter);
    },
    getLabels: function () {
        var label = ["Data"].concat(
            R.map(R.prop("label"), this.props.sources)
        );
        if (R.prop(("label"), this.props.consumptionTypes)) {
            label = label.concat(R.prop(("label"), this.props.consumptionTypes));
        }
        return label;
    },
    getColors: function () {
        var colors = this.props.sources.map(R.prop("color"));
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
                coordinates={this.getCoordinates() || []}
                dateFilter={this.props.dateFilter}
                labels={this.getLabels()}
                ref="temporalLineGraph"
                showRangeSelector={true}
                site={this.props.sites[0] || Immutable.Map()}
                xLabel=""
                y2label={this.props.getY2Label(this.props.consumptionTypes)}
                yLabel={this.props.getYLabel(this.props.electricalTypes)}
            />
        );
    }
});

module.exports = Radium(ValoriCompare);
