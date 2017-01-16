var React     = require("react");
var Slider    = require("react-slick");
var components = require("components");
var bootstrap       = require("react-bootstrap");

var MeasureLabel = require("components/").MeasureLabel;
import {defaultTheme} from "lib/theme";
import getLastUpdate from "lib/date-utils";
import Radium from "radium";

var style = (variableColor) => ({
    box: {
        maxWidth: "400px",
        minWidth: "calc(320px + 1.3vw)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        borderRadius: "26px",
        height: "65px",
        margin: "0 1vw",
        background: variableColor
    }
});

var VariablesPanel = React.createClass({
    propTypes: {
        numberOfConsumptionSensor: React.PropTypes.number,
        values: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.object),
            React.PropTypes.object
        ]).isRequired
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            innerWidth: window.innerWidth
        };
    },
    componentWillMount: function () {
        window.addEventListener("resize", this.handleResize);
    },
    componentWillUnmount () {
        window.removeEventListener("resize", this.handleResize);
    },
    handleResize () {
        this.setState({
            innerWidth: window.innerWidth
        });
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getItemToShow: function () {
        return Math.ceil(this.state.innerWidth / 400);
    },

    renderVariableBox: function () {
        return this.props.values.map((variable) => {
            const updateTitle = getLastUpdate(variable.measurementTime);
            return (
                <div
                    key={variable.key}
                    style={{display: "inline-block"}}
                >
                    <bootstrap.OverlayTrigger
                        overlay={<bootstrap.Tooltip id="lastUpdate" className="lastUpdate">{updateTitle}</bootstrap.Tooltip>}
                        placement="bottom"
                        rootClose={true}
                    >
                        <div style={style(variable.color).box}>
                            <components.Icon
                                color={this.getTheme().colors.iconConsumptionVariable}
                                icon={variable.icon}
                                size={"calc(45px + 1vw)"}
                                style={{
                                    lineHeight: "75px",
                                    margin: "0 .6vw",
                                    height: "65px"
                                }}
                            />
                            <MeasureLabel
                                id={variable.name || variable._id}
                                unit={variable.unit}
                                value={variable.measurementValue.toFixed(2)}
                            />
                        </div>
                    </bootstrap.OverlayTrigger>
                </div>
            );
        });
    },
    render: function () {
        const theme = this.getTheme();
        const numberOfItem = this.getItemToShow();
        var settings = {
            arrow: false,
            dots: true,
            dotsClass: "slick-dots",
            infinite: false,
            speed: 500,
            slidesToShow: numberOfItem,
            slidesToScroll: numberOfItem - 1,
            swipeToSilde: true,
            lazyLoad: true,
            autoplay: false,
            focusOnSelect: true,
            draggable: true,
            variableWidth: true
        };
        return (
            <div className={"slick-style"} style={{width: "100%", height: "125px", overflow: "hidden"}}>
                <Radium.Style
                    rules={{
                        ".slick-dots li.slick-active button:before": {
                            opacity: 1
                        },
                        ".slick-dots li button:before": {
                            fontSize: "50px",
                            lineHeight: "20px",
                            color: theme.colors.backgroundSlickDots
                        },
                        ".slick-dots li button": {
                            padding: "0px"
                        },
                        ".slick-dots": {
                            bottom: "-40px"
                        }
                    }}
                    scopeSelector=".slick-style"
                />
                <Slider {...settings}>
                    {this.renderVariableBox()}
                </Slider>
            </div>
        );
    }
});

module.exports = VariablesPanel;
