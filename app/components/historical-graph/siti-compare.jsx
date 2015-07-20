var Immutable  = require("immutable");
var moment     = require("moment");
var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");

var components = require("components");

var SitiCompare = React.createClass({
    propTypes: {
        misure: IPropTypes.map,
        siti: React.PropTypes.arrayOf(IPropTypes.map),
        tipologia: React.PropTypes.object,
        valori: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    mixins: [React.addons.PureRenderMixin],
    getCoordinates: function () {
        var self = this;
        var pods = self.props.siti.map(function (sito) {
            return sito.get("pod");
        });
        var nullPods = R.repeat(null, pods.length);
        var valore = self.props.valori[0];
        return self.props.misure
            .filter(function (misura) {
                return R.contains(misura.get("pod"), pods);
            })
            .filter(function (misura) {
                return misura.get("tipologia") === self.props.tipologia.key;
            })
            .reduce(function (acc, misura) {
                var date = moment(misura.get("data")).valueOf();
                return acc.withMutations(function (map) {
                    var value = map.get(date) || [new Date(date)].concat(nullPods);
                    var pod = misura.get("pod");
                    value[pods.indexOf(pod) + 1] = [misura.get(valore.key), 0];
                    map.set(date, value);
                });
            }, Immutable.Map())
            .sort(function (m1, m2) {
                return (m1[0] < m2[0] ? -1 : 1);
            })
            .toArray();
    },
    getLabels: function () {
        var sitiLabels = this.props.siti.map(function (sito) {
            return sito.get("idCoin");
        });
        return ["Data"].concat(sitiLabels);
    },
    render: function () {
        return (
            <components.TemporalLineGraph
                coordinates={this.getCoordinates()}
                labels={this.getLabels()}
                xLabel=""
                yLabel="kWh"
            />
        );
    }
});

module.exports = Radium(SitiCompare);
