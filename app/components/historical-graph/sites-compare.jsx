var Immutable       = require("immutable");
var IPropTypes      = require("react-immutable-proptypes");
var Radium          = require("radium");
var React           = require("react");
var ReactPureRender = require("react-addons-pure-render-mixin");

var colors      = require("lib/colors");
var components  = require("components");
var convertToGraph = require("lib/convert-collection-to-graph");

var sitesCompare = React.createClass({
    propTypes: {
        getYLabel: React.PropTypes.func,
        misure: IPropTypes.map,
        sites: React.PropTypes.arrayOf(IPropTypes.map),
        tipologia: React.PropTypes.object,
        valori: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    mixins: [ReactPureRender],
    getCoordinates: function () {
        var sitesId = this.props.sites.map(function (sito) {
            return sito.get("siteId");
        });
        return convertToGraph.convertBySitesAndVariable(this.props.misure, sitesId, this.props.tipologia.key);
    },
    getLabels: function () {
        var sitesLabels = this.props.sites.map(function (sito) {
            return sito.get("idCoin");
        });
        return ["Data"].concat(sitesLabels);
    },
    render: function () {
        var valori = this.props.valori[0];
        return (
            <components.TemporalLineGraph
                colors={[valori.color, colors.lineCompare]}
                coordinates={this.getCoordinates()}
                labels={this.getLabels()}
                ref="temporalLineGraph"
                site={this.props.sites[0] || Immutable.Map()}
                xLabel=""
                yLabel={this.props.getYLabel(this.props.tipologia)}
            />
        );
    }
});

module.exports = Radium(sitesCompare);
