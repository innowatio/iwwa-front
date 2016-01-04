var IPropTypes      = require("react-immutable-proptypes");
var Radium          = require("radium");
var React           = require("react");
var ReactPureRender = require("react-addons-pure-render-mixin");
var titleCase       = require("title-case");

var icons              = require("lib/icons");
var colors             = require("lib/colors");
var components         = require("components");
var DateCompareGraph   = require("./date-compare.jsx");
var ValoriCompareGraph = require("./valori-compare.jsx");
var SitesCompareGraph   = require("./sites-compare.jsx");

var HistoricalGraph = React.createClass({
    propTypes: {
        alarms: React.PropTypes.arrayOf(React.PropTypes.number),
        consumption: React.PropTypes.object,
        dateCompare: React.PropTypes.shape({
            period: React.PropTypes.object,
            dateOne: React.PropTypes.date
        }),
        misure: IPropTypes.map,
        resetCompare: React.PropTypes.func,
        sensors: React.PropTypes.arrayOf(React.PropTypes.string),
        sites: React.PropTypes.arrayOf(IPropTypes.map),
        tipologia: React.PropTypes.object,
        valori: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    mixins: [ReactPureRender],
    exportPNG: function () {
        return this.refs.temporalLineGraph.exportPNG;
    },
    renderSiteTitle: function (site) {
        return site ? (
            <span>
                <strong>
                    {titleCase(site.get("name"))}
                </strong>
            </span>
        ) : null;
    },
    renderTitle: function () {
        if (this.props.sites.length > 0) {
            return (
                <div>
                    <h3 className="text-center" style={{marginTop: "20px"}}>
                        {this.renderSiteTitle(this.props.sites[0])}
                        {this.props.sites.length === 2 ? " & " : null}
                        {this.renderSiteTitle(this.props.sites[1])}
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
    renderSitesCompareGraph: function () {
        return <SitesCompareGraph {...this.props} ref="compareGraph"/>;
    },
    renderValoriCompareGraph: function () {
        return <ValoriCompareGraph {...this.props} ref="compareGraph"/>;
    },
    renderGraph: function () {
        if (this.props.dateCompare) {
            return this.renderDateCompareGraph();
        }
        if (this.props.sites.length > 1) {
            return this.renderSitesCompareGraph();
        }
        return this.renderValoriCompareGraph();
    },
    render: function () {
        return (
                <div style={{width: "100%", height: "100%"}}>
                    {this.renderTitle()}
                    <div
                        onClick={this.props.resetCompare}
                        style={{
                            display: this.props.dateCompare || this.props.sites.length > 1 ? "flex" : "none",
                            positeson: "relative",
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
