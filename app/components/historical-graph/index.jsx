var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");
var titleCase  = require("title-case");

var icons              = require("lib/icons");
var colors             = require("lib/colors");
var components         = require("components");
var DateCompareGraph   = require("./date-compare.jsx");
var ValoriCompareGraph = require("./valori-compare.jsx");
var SitiCompareGraph   = require("./siti-compare.jsx");

var HistoricalGraph = React.createClass({
    propTypes: {
        alarms: React.PropTypes.arrayOf(React.PropTypes.number),
        dateCompare: React.PropTypes.shape({
            period: React.PropTypes.object,
            dateOne: React.PropTypes.date
        }),
        misure: IPropTypes.map,
        resetCompare: React.PropTypes.func,
        siti: React.PropTypes.arrayOf(IPropTypes.map),
        style: React.PropTypes.object,
        tipologia: React.PropTypes.object,
        valori: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    mixins: [React.addons.PureRenderMixin],
    exportPNG: function () {
        return this.refs.temporalLineGraph.exportPNG;
    },
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
        if (this.props.siti.length > 0) {
            return (
                <div>
                    <h3 className="text-center" style={{marginTop: "20px"}}>
                        {this.renderSitoTitle(this.props.siti[0])}
                        {this.props.siti.length === 2 ? " & " : null}
                        {this.renderSitoTitle(this.props.siti[1])}
                    </h3>
                    <h4 className="text-center" style={{color: colors.greySubTitle}}>
                        {this.props.tipologia.label}
                    </h4>
                </div>
            );
        }
    },
    renderDateCompareGraph: function () {
        return <DateCompareGraph {...this.props} ref="compareGraph"/>;
    },
    renderSitiCompareGraph: function () {
        return <SitiCompareGraph {...this.props} ref="compareGraph"/>;
    },
    renderValoriCompareGraph: function () {
        return <ValoriCompareGraph {...this.props} ref="compareGraph"/>;
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
        console.log(this);
        return (
                <div style={R.merge({width: "100%", height: "100%"}, this.props.style)}>
                    <Radium.Style
                        rules={{
                            ".dygraph-legend": {
                                top: "-60px !important",
                                boxShadow: "2px 2px 5px " + colors.greySubTitle,
                                left: "85% !important",
                                width: "186px !important"
                            }
                        }}
                        scopeSelector=".col-sm-12"
                    />
                    {this.renderTitle()}
                    <div
                        onClick={this.props.resetCompare}
                        style={{
                            display: this.props.dateCompare || this.props.siti.length > 1 ? "flex" : "none",
                            position: "relative",
                            marginLeft: "50px",
                            cursor: "pointer"
                        }}
                    >
                        <img src={icons.iconLogoutColor} style={{width: "30px", height: "20px"}}/>
                        <components.Spacer direction="h" size={5} />
                        {"Esci dal confronto"}
                    </div>
                    {this.renderGraph()}
                </div>
        );
    }
});

module.exports = Radium(HistoricalGraph);
