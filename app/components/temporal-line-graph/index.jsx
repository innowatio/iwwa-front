var R         = require("ramda");
var Radium    = require("radium");
var React     = require("react");
var Loader    = require("halogen/PacmanLoader");
var bootstrap = require("react-bootstrap");

var AppPropTypes     = require("lib/app-prop-types.js");
var dygraphExport    = require("lib/dygraph-export.js");
var DygraphCSVExport = require("lib/dygraph-export-csv.js");
var colors           = require("lib/colors");


var styles = {
    graphContainer: {
        width: "calc(100vw - 100px)",
        height: "calc(100vh - 350px)",
        margin: "20px 20px 30px 20px"
    }
};

var TemporalLineGraph = React.createClass({
    propTypes: {
        colors: React.PropTypes.arrayOf(React.PropTypes.string),
        coordinates: React.PropTypes.arrayOf(
            AppPropTypes.DygraphCoordinate
        ).isRequired,
        dateWindow: React.PropTypes.arrayOf(React.PropTypes.number),
        labels: React.PropTypes.array,
        lockInteraction: React.PropTypes.bool,
        showRangeSelector: React.PropTypes.bool,
        xLabel: React.PropTypes.string,
        xLegendFormatter: React.PropTypes.func,
        xTicker: React.PropTypes.func,
        yLabel: React.PropTypes.string
    },
    componentDidMount: function () {
        this.drawGraph();
    },
    componentWillReceiveProps: function (nextProps) {
        var options = this.getOptionsFromProps(nextProps);
        this.graph.updateOptions(R.merge(options, {
            file: this.getCoordinatesFromProps(nextProps)
        }));
    },
    getCoordinatesFromProps: function (props) {
        return (
            R.isEmpty(props.coordinates) ?
            [[0]] :
            props.coordinates
        );
    },
    getOptionsFromProps: function (props) {
        var options = {
            drawPoints: true,
            errorBars: true,
            hideOverlayOnMouseOut: false,
            labels: this.getLabelsFromProps(props),
            labelsSeparateLines: true,
            legend: "always",
            sigma: 2,
            strokeWidth: 1.5,
            xlabel: props.xLabel,
            ylabel: props.yLabel,
            axes: {
                x: {},
                y: {}
            }
        };
        if (props.colors) {
            options.colors = props.colors;
        }
        if (props.dateWindow) {
            options.dateWindow = props.dateWindow;
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
    drawGraph: function () {
        var container = this.refs.graphContainer.getDOMNode();
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

            var c_now;

            // old and new centers.
            var c_init = context.initialPinchCenter;
            if (touches.length === 1) {
                c_now = touches[0];
            } else {
                c_now = {
                    pageX: 0.5 * (touches[0].pageX + touches[1].pageX)
                };
            }

              // this is the "swipe" component
              // we toss it out for now, but could use it in the future.
            var swipe = {
                pageX: c_now.pageX - c_init.pageX
            };
            var dataWidth = context.initialRange.x[1] - context.initialRange.x[0];
            var dataHeight = context.initialRange.y[0] - context.initialRange.y[1];
            swipe.dataX = (swipe.pageX / g.plotter_.area.w) * dataWidth;
            var xScale;

            // The residual bits are usually split into scale & rotate bits, but we split
            // them into x-scale and y-scale bits.
            if (touches.length === 1) {
                xScale = 1.0;
            } else if (touches.length >= 2) {
                var initHalfWidth = (initialTouches[1].pageX - c_init.pageX);
                xScale = (touches[1].pageX - c_now.pageX) / initHalfWidth;
            }

            // Clip scaling to [1/8, 8] to prevent too much blowup.
            xScale = Math.min(8, Math.max(0.125, xScale));

            var didZoom = false;
            if (context.touchDirections.x) {
                g.dateWindow_ = [
                    c_init.dataX - swipe.dataX + (context.initialRange.x[0] - c_init.dataX) / xScale,
                    c_init.dataX - swipe.dataX + (context.initialRange.x[1] - c_init.dataX) / xScale
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
        link.click();
    },
    renderSpinner: function () {
        // TODO To set a timeout.
        // if (window.location.search.indexOf("sito") >= 0 && this.props.coordinates.length === 0) {
            return (
                <div className="modal-spinner">
                    <bootstrap.Modal
                        autoFocus={false}
                        enforceFocus={false}
                        onHide={R.identity()}
                        style={{zIndex: 1000}}
                    >
                        <Radium.Style
                            rutles={{
                                ".modal-dialog": {
                                    width: "125px"
                                }
                            }}
                            scopeSelector=".modal-spinner"
                        />
                        <Loader color={colors.primary} style={{zIndex: 1010}}/>
                    </bootstrap.Modal>
                </div>
            );
        // }
    },
    render: function () {
        return (
            <span>
                {this.renderSpinner()}
                <div ref="graphContainer" style={styles.graphContainer}/>
            </span>
        );
    }
});

module.exports = TemporalLineGraph;
