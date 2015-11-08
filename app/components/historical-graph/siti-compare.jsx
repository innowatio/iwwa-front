var Immutable  = require("immutable");
var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");

var colors      = require("lib/colors");
var components  = require("components");
var measuresUtils = require("lib/collection-utils").measures;

var SitiCompare = React.createClass({
    propTypes: {
        getYLabel: React.PropTypes.func,
        misure: IPropTypes.map,
        siti: React.PropTypes.arrayOf(IPropTypes.map),
        tipologia: React.PropTypes.object,
        valori: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    mixins: [React.addons.PureRenderMixin],
    getCoordinates: function () {
        var pods = this.props.siti.map(function (sito) {
            return sito.get("pod");
        });
        return measuresUtils.convertBySitesAndVariable(this.props.misure, pods, this.props.tipologia.key);
    },
    getLabels: function () {
        var sitiLabels = this.props.siti.map(function (sito) {
            return sito.get("idCoin");
        });
        return ["Data"].concat(sitiLabels);
    },
    render: function () {
        var valori = this.props.valori[0];
        return (
            <components.TemporalLineGraph
                colors={[valori.color, colors.lineCompare]}
                coordinates={this.getCoordinates()}
                labels={this.getLabels()}
                ref="temporalLineGraph"
                sito={this.props.siti[0] || Immutable.Map()}
                xLabel=""
                yLabel={this.props.getYLabel(this.props.tipologia)}
            />
        );
    }
});

module.exports = Radium(SitiCompare);
