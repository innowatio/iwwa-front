var Radium     = require("radium");
var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");

var components = require("components");

var HistoricalGraph = React.createClass({
    propTypes: {
        deviazioneStd: React.PropTypes.number,
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
                return [
                    misura.get("data"),
                    [
                        misura.get(self.props.valore.key),
                        self.props.deviazioneStd || 0
                    ]
                ];
            });
    },
    render: function () {
        return (
            <components.TemporalLineGraph
                coordinates={[
                    [10, [10, 1]],
                    [18, [2, 1]],
                    [20, [3, 1]],
                    [25, [2, 1]],
                    [30, [1, 1]]
                ]}
            />
    ); // this.getCoordinates()
    }
});

module.exports = Radium(HistoricalGraph);
