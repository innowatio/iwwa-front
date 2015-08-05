var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");
var titleCase  = require("title-case");

var colors             = require("lib/colors");
var components         = require("components/");
var DateCompareGraph   = require("./date-compare.jsx");
var ValoriCompareGraph = require("./valori-compare.jsx");
var SitiCompareGraph   = require("./siti-compare.jsx");

var HistoricalGraph = React.createClass({
    propTypes: {
        dateCompare: React.PropTypes.shape({
            period: React.PropTypes.object,
            dateOne: React.PropTypes.date
        }),
        misure: IPropTypes.map,
        siti: React.PropTypes.arrayOf(IPropTypes.map),
        style: React.PropTypes.object,
        tipologia: React.PropTypes.object,
        valori: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    mixins: [React.addons.PureRenderMixin],
    renderSitoTitle: function (sito) {
        return sito ? (
            <span>
                <strong>
                    <components.Spacer direction="h" size={8}/>
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
                <h3 className="text-center" style={{marginTop: "20px"}}>
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
                <div style={R.merge({width: "100%", height: "100%"}, this.props.style)}>
                    <Radium.Style
                        rules={{
                            ".dygraph-legend": {
                                top: "-60px !important",
                                border: "1px solid" + colors.borderColor + "!important",
                                boxShadow: "2px 2px 5px " + colors.greySubTitle + "!important",
                                textIndent: "8px"
                            }
                        }}
                        scopeSelector=".col-sm-12"
                    />
                    {this.renderTitle()}
                    {this.renderGraph()}
                </div>
        );
    }
});

module.exports = Radium(HistoricalGraph);
