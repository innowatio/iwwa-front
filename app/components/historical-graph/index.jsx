var Radium     = require("radium");
var React      = require("react");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var titleCase  = require("title-case");

var colors             = require("lib/colors");
var DateCompareGraph   = require("./date-compare.jsx");
var ValoriCompareGraph = require("./valori-compare.jsx");
var SitiCompareGraph   = require("./siti-compare.jsx");

var HistoricalGraph = React.createClass({
    propTypes: {
        dateCompare: React.PropTypes.shape({
            period: React.PropTypes.object,
            dateOne: React.PropTypes.date,
            dateTwo: React.PropTypes.date
        }),
        misure: IPropTypes.map,
        siti: React.PropTypes.arrayOf(IPropTypes.map),
        tipologia: React.PropTypes.object,
        valori: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    mixins: [React.addons.PureRenderMixin],
    renderSitoTitle: function (sito) {
        return sito ? (
            <span>
                <strong>
                    {titleCase(sito.get("societa"))}
                </strong>
                {" - "}
                {titleCase(sito.get("idCoin"))}
            </span>
        ) : null;
    },
    renderTitle: function () {
        return (
            <div>
                <h3 className="text-center" style={{marginTop: "0px"}}>
                    Sito: &nbsp;
                    {this.renderSitoTitle(this.props.siti[0])}
                    {this.props.siti.length === 2 ? " & " : null}
                    {this.renderSitoTitle(this.props.siti[1])}
                </h3>
                <h4 className="text-center" style={{color: colors.greySubTitle}}>
                    Tipologia: &nbsp;
                    {this.props.tipologia.label}
                </h4>
            </div>
        );
    },
    renderDateCompareGraph: function () {
        return <DateCompareGraph {...this.props} />;
    },
    renderSitiCompareGraph: function () {
        return <SitiCompareGraph {...this.props} />;
    },
    renderValoriCompareGraph: function () {
        return <ValoriCompareGraph {...this.props} />;
    },
    renderGraph: function () {
        if (this.props.dateCompare) {
            return this.renderDateCompareGraph();
        }
        if (this.props.siti.length > 1) {
            return this.renderSitiCompareGraph();
        }
        return this.renderValoriCompareGraph();
    },
    render: function () {
        return (
            <div style={{width: "100%", height: "100%"}}>
                {this.renderTitle()}
                {this.renderGraph()}
            </div>
        );
    }
});

module.exports = Radium(HistoricalGraph);
