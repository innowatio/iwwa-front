var Radium     = require("radium");
var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");

var components = require("components");

var HistoricalChart = React.createClass({
    propTypes: {
        misure: IPropTypes.map,
        sito: IPropTypes.map,
        tipologia: React.PropTypes.object,
        valore: React.PropTypes.object
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
                return {
                    id: misura.get("_id"),
                    x: misura.get("data"),
                    y: misura.get(self.props.valore.key)
                };
            });
    },
    render: function () {
        return (
            <components.TemporalLineChart
                coordinates={this.getCoordinates()}
            />
        );
    }
});

module.exports = Radium(HistoricalChart);
