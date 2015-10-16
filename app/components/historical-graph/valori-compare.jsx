var Immutable  = require("immutable");
var moment     = require("moment");
var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");

var components  = require("components");
var formatValue = require("./format-value.js");

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
        var sito = self.props.siti[0] || Immutable.Map();
        var pod = sito.get("pod");
        return self.props.misure
            .filter(function (misura) {
                return misura.get("pod") === pod;
            })
            .filter(function (misura) {
                return misura.get("tipologia") === self.props.tipologia.key;
            })
            .filter(function (misura) {
                if (self.props.dateFilter) {
                    return moment(misura.get("data")).toDate() >= self.props.dateFilter.start &&
                        moment(misura.get("data")).toDate() <= self.props.dateFilter.end;
                }
                return true;
            })
            .map(function (misura) {
                var date = moment(misura.get("data")).toDate();
                return R.pipe(
                    R.map(function (valore) {
                        return formatValue(misura.get(valore.key));
                    }),
                    R.prepend(date)
                )(self.props.valori);
            })
            .sort(function (m1, m2) {
                return (m1[0] < m2[0] ? -1 : 1);
            })
            .toArray();
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
