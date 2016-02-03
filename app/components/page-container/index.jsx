var R     = require("ramda");
var React = require("react");

var icons      = require("lib/icons_restyling");
var styles     = require("lib/styles_restyling");

var PageContainer = React.createClass({
    propTypes: {
        children: React.PropTypes.node,
        reduxState: React.PropTypes.object.isRequired,
        style: React.PropTypes.object
    },
    defaultProps: {
        style: {}
    },
    getTitleComponent: function (title) {
        return (
            <div style={styles.titlePage}>
                <h2 style={{fontSize: "18px", marginBottom: "0px", paddingTop: "18px"}}>
                    {title}
                </h2>
                <img className="pull-right" src={icons.iconSettings} style={{marginTop: "-20px"}}/>
            </div>);
    },
    getTitleForChartOrLive: function (chart) {
        const path = chart.fullPath;
        return path ?
            [path[0], path.length > 1 ? R.last(path) : undefined]
                .filter(value => !R.isNil(value))
                .join(" · ") :
            "";
    },
    renderTitle: function () {
        var locationName = R.path(["props", "route", "name"], this.props.children);

        if (locationName === "chart") {
            const reduxChart = this.props.reduxState.chart;

            return this.getTitleComponent(
                R.map(this.getTitleForChartOrLive, reduxChart).join(" - ")
            );
        } else if (locationName === "live") {
            const reduxRealTime = this.props.reduxState.realTime;

            return this.getTitleComponent(
                R.map(this.getTitleForChartOrLive, reduxRealTime).join(" - ")
            );
        } else {
            return ;
        }
    },
    render: function () {
        console.log("this.props.reduxState");
        console.log(this.props);
        console.log(R.path(["props", "route"], this.props.children));
        const {style} = this.props;
        return (
            <div
                {...this.props}
                style={{...style}}
            >
                {this.renderTitle()}
                <div>
                    {this.props.children}
                </div>
            </div>
        );
    }
});

module.exports = PageContainer;
