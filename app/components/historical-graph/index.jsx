var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");

var components = require("components");

var HistoricalGraph = React.createClass({
    propTypes: {
        misure: IPropTypes.map,
        sito: IPropTypes.map,
        tipologia: React.PropTypes.object,
        valori: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    mixins: [React.addons.PureRenderMixin],
    getCoordinates: function () {
        var self = this;
        var pod = self.props.sito.get("pod");
        return self.props.misure
            .filter(function (misura) {
                return misura.get("pod") === pod;
            })
            .filter(function (misura) {
                return misura.get("tipologia") === self.props.tipologia.key;
            })
            .map(function (misura) {
                return R.pipe(
                    R.map(function (valore) {
                        return [misura.get(valore.key), 0];
                    }),
                    R.prepend(new Date(misura.get("data")))
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
                coordinates={this.getCoordinates()}
                labels={this.getLabels()}
                xLabel="Data"
                yLabel="Potenza"
            />
        );
    }
});

module.exports = Radium(HistoricalGraph);
