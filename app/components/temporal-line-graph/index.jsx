import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
var R         = require("ramda");
var Radium    = require("radium");
var Loader    = require("halogen/PacmanLoader");
var bootstrap = require("react-bootstrap");
var moment    = require("moment");

var AppPropTypes     = require("lib/app-prop-types.js");
var dygraphExport    = require("lib/dygraph-export.js");
var DygraphCSVExport = require("lib/dygraph-export-csv.js");
var colors           = require("lib/colors_restyling");

var styles = {
    graphContainer: {
        width: "100%",
        height: "calc(100vh - 420px)",
        margin: "20px 20px 30px 0px"
    }
};

const oneMonthInMilliseconds = moment.duration(1, "months").asMilliseconds();

var TemporalLineGraph = React.createClass({
    propTypes: {
        alarms: PropTypes.arrayOf(PropTypes.number),
        colors: PropTypes.arrayOf(PropTypes.string),
        coordinates: PropTypes.arrayOf(
            AppPropTypes.DygraphCoordinate
        ).isRequired,
        dateFilter: PropTypes.object,
        dateWindow: PropTypes.object,
        labels: PropTypes.array,
        lockInteraction: PropTypes.bool,
        showRangeSelector: PropTypes.bool,
        site: IPropTypes.map,
        xLabel: PropTypes.string,
        xLegendFormatter: PropTypes.func,
        xTicker: PropTypes.func,
        y2Label: PropTypes.string,
        yLabel: PropTypes.string
    },
    componentDidMount: function () {
        this.drawGraph();
    },
    componentWillReceiveProps: function (nextProps) {
        var options = this.getOptionsFromProps(nextProps);
        this.graph.updateOptions(R.merge(options, {
            file: this.getCoordinatesFromProps(nextProps)
        }));
        this.drawAnnotations();
    },
    getCoordinatesFromProps: function (props) {
        return (
            R.isEmpty(props.coordinates) ?
            [[0]] :
            props.coordinates
        );
    },
    getUnderlayForWeekEnd: function (canvas, area, g, date, dayFrom0Unix) {
        if (
            R.equals(moment.utc(date).format("YYYY-MM-DD"), moment.utc(date).day(6).format("YYYY-MM-DD"))
        ) {
            const dayBottomLeft = moment.utc(dayFrom0Unix ? dayFrom0Unix : date).startOf("day");
            const dayTopRight = moment.utc(dayFrom0Unix ? dayFrom0Unix : date).add({days: 1}).endOf("day");
            var bottomLeft = g.toDomCoords(dayBottomLeft, -20);
            var topRight = g.toDomCoords(dayTopRight, +20);
            var left = bottomLeft[0];
            var right = topRight[0];

            canvas.fillStyle = colors.greyBackground;
            canvas.fillRect(left, area.y, right - left, area.h);
        }
    },
    getOptionsFromProps: function (props) {
        var options = {
            series: {},
            connectSeparatedPoints: true,
            drawPoints: true,
            errorBars: false,
            hideOverlayOnMouseOut: false,
            includeZero: true,
            labels: this.getLabelsFromProps(props),
            labelsSeparateLines: true,
            legend: "always",
            sigma: 2,
            strokeWidth: 1.5,
            xlabel: props.xLabel,
            ylabel: props.yLabel,
            y2label: props.y2Label ? props.y2Label : "",
            axes: {
                x: {},
                y: {},
                y2: {}
            }
        };
        if (!R.isEmpty(props.coordinates)) {
            if (props.y2Label) {
                var maxY2Range = R.reduce(function (prev, elm) {
                    return R.max(prev, elm[2][0]);
                }, 0, props.coordinates);
                options.axes.y2.valueRange = [0, maxY2Range * 1.01];
            }
            var labels = this.getLabelsFromProps(props);
            var externalLabel = labels[2];
            var maxYRange = R.reduce(function (prev, elm) {
                // Y axis is at the height of the max of y or y2
                return elm.length === 2 || props.y2Label ? // TACCONATA
                R.max(prev, elm[1][0]) :
                R.max(R.max(prev, elm[1][0]), R.max(prev, elm[2][0]));
            }, 0, props.coordinates);
            if (maxYRange === 0.01) {
                options.axes.y.valueRange = [0, 10]; // Tacconata
            } else {
                options.axes.y.valueRange = [0, maxYRange * 1.01];
            }
            props.y2Label ? options.series[externalLabel] = {axis: "y2"} : null;
        }
        if (props.coordinates.length !== 0 && !props.dateWindow && R.isEmpty(props.dateFilter)) {
            const dateStart = props.coordinates[0][0];
            const dateEnd = R.last(props.coordinates)[0];
            options.underlayCallback = (canvas, area, g) => {
                const numberOfDayInGraph = moment.utc(dateEnd).diff(dateStart, "days");
                for (var i=0; i<=numberOfDayInGraph; i++) {
                    const day = moment.utc(dateStart).add({days: i});
                    this.getUnderlayForWeekEnd(canvas, area, g, day);
                }
            };
        }
        if (!R.isEmpty(props.dateFilter)) {
            const date = props.dateFilter;
            options.underlayCallback = (canvas, area, g) => {
                const numberOfDayInGraph = moment.utc(date.end).diff(date.start, "days");
                for (var i=0; i<=numberOfDayInGraph; i++) {
                    const day = moment.utc(date.start).add({days: i});
                    this.getUnderlayForWeekEnd(canvas, area, g, day);
                }
            };
        }
        if (props.dateWindow) {
            const dateStart = props.dateWindow.start;
            options.underlayCallback = (canvas, area, g) => {
                for (var i=0; i<=props.dateWindow.dayToAdd; i++) {
                    const day = moment.utc(dateStart).add({days: i});
                    const dayFrom0Unix = moment.utc(0).add({days: i});
                    this.getUnderlayForWeekEnd(canvas, area, g, day, dayFrom0Unix);
                }
            };
        }
        if (props.colors) {
            options.colors = props.colors;
        }
        if (props.dateFilter && props.dateFilter.type === "dateFilter") {
            options.dateWindow = [props.dateFilter.start, props.dateFilter.end];
        } else if (props.dateWindow) {
            options.dateWindow = props.dateWindow.dateArray;
        } else {
            const {max, min} = props.coordinates.reduce((acc, coordinate) => {
                return {
                    max: coordinate[0] > acc.max ? coordinate[0] : acc.max,
                    min: coordinate[0] < acc.min ? coordinate[0] : acc.min
                };
            }, {max: new Date(0), min: new Date()});
            const delta = max - min;
            if (delta >= oneMonthInMilliseconds) {
                options.dateWindow = [max -  oneMonthInMilliseconds, max];
            }
        }
        if (props.lockInteraction) {
            options.interactionModel = {};
        }
        if (props.xLegendFormatter) {
            options.axes.x.valueFormatter = props.xLegendFormatter;
        }
        if (props.xTicker) {
            options.axes.x.ticker = props.xTicker;
        }
        return options;
    },
    getLabelsFromProps: function (props) {
        return (
            R.isEmpty(props.coordinates) ?
            ["Data"] :
            props.labels
        );
    },
    drawAnnotations: function () {
        var annotations = [];
        if (this.props.alarms) {
            this.props.alarms.map((alarm) =>
                annotations.push({
                    series: "Reale",
                    x: alarm,
                    text: "alarm",
                    cssClass: "alarmPoint",
                    attachAtBottom: false,
                    tickHeight: 0,
                    width: 8,
                    height: 4
                })
            );
        }
        this.graph.setAnnotations(annotations);
    },
    drawGraph: function () {
        var container = this.refs.graphContainer;
        var coordinates = this.getCoordinatesFromProps(this.props);
        var options = this.getOptionsFromProps(this.props);
        /*
        *   Instantiating the graph automatically renders it to the page
        */
        Dygraph.Interaction.moveTouch = function (event, g, context) {
            // If the tap moves, then it's definitely not part of a double-tap.
            context.startTimeForDoubleTapMs = null;
            var i = [];
            var touches = [];
            for (i = 0; i < event.touches.length; i++) {
                var t = event.touches[i];
                touches.push({
                    pageX: t.pageX
                });
            }
            var initialTouches = context.initialTouches;
            var cNow;
            // old and new centers.
            var cInit = context.initialPinchCenter;
            if (touches.length === 1) {
                cNow = touches[0];
            } else {
                cNow = {
                    pageX: 0.5 * (touches[0].pageX + touches[1].pageX)
                };
            }
              // this is the "swipe" component
              // we toss it out for now, but could use it in the future.
            var swipe = {
                pageX: cNow.pageX - cInit.pageX
            };
            var dataWidth = context.initialRange.x[1] - context.initialRange.x[0];
            swipe.dataX = (swipe.pageX / g.plotter_.area.w) * dataWidth;
            var xScale;
            // The residual bits are usually split into scale & rotate bits, but we split
            // them into x-scale and y-scale bits.
            if (touches.length === 1) {
                xScale = 1.0;
            } else if (touches.length >= 2) {
                var initHalfWidth = (initialTouches[1].pageX - cInit.pageX);
                xScale = (touches[1].pageX - cNow.pageX) / initHalfWidth;
            }
            // Clip scaling to [1/8, 8] to prevent too much blowup.
            xScale = Math.min(8, Math.max(0.125, xScale));
            var didZoom = false;
            if (context.touchDirections.x) {
                g.dateWindow_ = [
                    cInit.dataX - swipe.dataX + (context.initialRange.x[0] - cInit.dataX) / xScale,
                    cInit.dataX - swipe.dataX + (context.initialRange.x[1] - cInit.dataX) / xScale
                ];
                didZoom = true;
            }
            g.drawGraph_(false);
            // We only call zoomCallback on zooms, not pans, to mirror desktop behavior.
            if (didZoom && touches.length > 1 && g.getFunctionOption("zoomCallback")) {
                var viewWindow = g.xAxisRange();
                g.getFunctionOption("zoomCallback").call(g, viewWindow[0], viewWindow[1], g.yAxisRanges());
            }
        };

        this.graph = new Dygraph(container, coordinates, options);
        this.drawAnnotations();
    },
    exportCSV: function () {
        var csvString = DygraphCSVExport.exportCSV(this.graph);
        var dataTypePrefix = "data:text/csv;base64,";
        this.openDownloadLink(dataTypePrefix + window.btoa(csvString), "export.csv");
    },
    exportPNG: function () {
        var options = {
            labelFont: "14px lato",
            legendFont: "14px lato",
            magicNumbertop: 20
        };
        var imgContainer = {};
        dygraphExport.asPNG(this.graph, imgContainer, options);
        var imageBase64 = imgContainer.src.replace("image/png", "image/octet-stream");
        this.openDownloadLink(imageBase64, "export.png");
    },
    openDownloadLink: function (content, name) {
        var encodedUri = encodeURI(content);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", name);
        link.setAttribute("target", "_blank");
        link.click();
    },
    renderSpinner: function () {
        // TODO Set a timeout.
        if (!R.isNil(this.props.site) && this.props.site.size > 0 && this.props.coordinates.length === 0) {
            return (
                <div className="modal-spinner">
                    <bootstrap.Modal
                        animation={false}
                        autoFocus={false}
                        container={this}
                        enforceFocus={false}
                        onHide={R.identity()}
                        show={true}
                        style={{zIndex: 1000}}
                    >
                        <Radium.Style
                            rules={{
                                ".modal-dialog": {
                                    width: "98%"
                                },
                                ".modal-container": {
                                    position: "relative",
                                    width: "100%"
                                },
                                ".modal-container .modal, .modal-container .modal-backdrop": {
                                    position: "absolute",
                                    width: "98%"
                                },
                                ".modal": {
                                    top: "50%",
                                    zIndex: 1039
                                },
                                ".modal-content > div > div": {
                                    left: "45%"
                                },
                                ".modal-content": {
                                    backgroundColor: colors.transparent,
                                    boxShadow: "none",
                                    WebkitBoxShadow: "none",
                                    border: "none"
                                },
                                ".modal-backdrop": {
                                    opacity: "0.8",
                                    backgroundColor: colors.white,
                                    zIndex: 1039
                                }
                            }}
                            scopeSelector=".modal-container"
                        />
                        <Loader color={colors.primary} style={{zIndex: 1010, position: "relative"}}/>
                    </bootstrap.Modal>
                </div>
            );
        }
    },
    render: function () {
        return (
            <div className="container-graph">
                <Radium.Style
                    rules={{
                        ".alarmPoint": {
                            border: `4px solid ${colors.red} !important`,
                            borderRadius: "50%"
                        },
                        ".dygraph-y2label": {
                            backgroundColor: colors.white,
                            height: "56px"
                        },
                        ".dygraph-legend": {
                            display: ENVIRONMENT === "cordova" ? "none" : "initial",
                            top: "-50px !important",
                            boxShadow: "2px 2px 5px " + colors.greySubTitle
                        }
                    }}
                    scopeSelector=".container-graph"
                />
                <div ref="graphContainer" style={styles.graphContainer}/>
            </div>
        );
    }
});

module.exports = Radium(TemporalLineGraph);
