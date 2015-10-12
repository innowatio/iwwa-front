var color      = require("color");
var Immutable  = require("immutable");
var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");

var CollectionUtils  = require("lib/collection-utils");
var colors           = require("lib/colors");
var components       = require("components/");
var icons            = require("lib/icons");
var QuerystringMixin = require("lib/querystring-mixin");
var styles           = require("lib/styles");
var transformers     = require("./transformers.js");
var GetTutorialMixin = require("lib/get-tutorial-mixin");
var tutorialString   = require("assets/JSON/tutorial-string.json").historicalGraph;

var multiselectStyles = {
    multiselectPopover: {
        width: "175px"
    },
    multiselect: {
        width: "450px",
        height: "35px",
        display: "inline-block"
    }
};

var graphStyle = {
    border: "solid 1px " + color(colors.darkBlack).alpha(0.1).rgbString(),
    boxShadow: "2px 2px 5px " + colors.greySubTitle
};

var dateCompareProps;
var sitoInputProps;

var Chart = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map,
        localStorage: React.PropTypes.object,
        location: React.PropTypes.object,
        params: React.PropTypes.object
    },
    mixins: [QuerystringMixin,
        GetTutorialMixin("historicalGraph", [
            "valori",
            "export",
            "tipologie",
            "siti",
            "dateFilter",
            "compare",
            "graph"
    ])],
    componentDidMount: function () {
        this.props.asteroid.subscribe("siti");
        if (R.has("idAlarm", this.props.params)) {
            this.props.asteroid.subscribe("alarms");
        }
        this.subscribeToMisure(this.props);
    },
    componentWillReceiveProps: function (props) {
        this.subscribeToMisure(props);
    },
    componentDidUpdate: function () {
        var siti = this.props.collections.get("siti") || Immutable.Map();
        if (siti.size > 0 && this.refs.historicalGraph.props.siti.length < 1) {
            sitoInputProps.onChange([siti.first()], "sito");
        }
    },
    getPeriods: function () {
        return [
            {label: "Settimana", key: "week"},
            {label: "Mese", key: "month"},
            {label: "Trimestre", key: "quarter"}
        ];
    },
    getTipologie: function () {
        return [
            {label: "Attiva", key: 1},
            {label: "Potenza", key: 2},
            {label: "Reattiva", key: 3}
        ];
    },
    getValori: function () {
        return [
            {label: "Reale", color: colors.lineReale, key: "reale"},
            {label: "Previsionale", color: colors.linePrevisionale, key: "previsionale"}
        ];
    },
    getExportType: function () {
        return [
            {label: "Png", key: "png", icon: icons.iconPNG},
            {label: "Csv", key: "csv", icon: icons.iconCSV}
        ];
    },
    getDateCompare: function () {
        return [
            {label: "IERI", key: "days"},
            {label: "7 GG FA", key: "7 days before"},
            {label: "SETTIMANA SCORSA", key: "weeks"},
            {label: "MESE SCORSO", key: "months"},
            {label: "12 MESI FA", key: "years"}
        ];
    },
    getDateFilter: function () {
        return [
            {label: "IERI", key: "days"},
            {label: "SETTIMANA SCORSA", key: "weeks"},
            {label: "MESE SCORSO", key: "months"},
            {label: "2 MESI FA", key: "2months"},
            {label: "ALTRO PERIODO", key: "custom"}
        ];
    },
    onChangeExport: function (valueChanged) {
        var exportAPILocation = this.refs.historicalGraph.refs.compareGraph.refs.temporalLineGraph;
        if (valueChanged.key === "png") {
            exportAPILocation.exportPNG();
        } else if (valueChanged.key === "csv") {
            exportAPILocation.exportCSV();
        }
    },
    resetCompare: function () {
        if (sitoInputProps.value && sitoInputProps.value.length > 1) {
            var val = sitoInputProps.value[0];
            sitoInputProps.onChange([val], "sito");
        }
        if (this.refs.historicalGraph.props.dateCompare) {
            dateCompareProps.onChange(null, "dateCompare");
        }
    },
    subscribeToMisure: function (props) {
        var self = this;
        var sitoQuery = R.path(["location", "query", "sito"], props);
        var siti = (sitoQuery && sitoQuery.split(",")) || [];
        siti.forEach(function (sito) {
            self.props.asteroid.subscribe("misureBySito", sito);
        });
    },
    render: function () {
        // Sito
        var siti = this.props.collections.get("siti") || Immutable.Map();
        sitoInputProps = this.bindToQueryParameter(
            "sito",
            transformers.sito(siti)
        );

        // Tipologia
        var tipologie = this.getTipologie();
        var tipologiaInputProps = this.bindToQueryParameter(
            "tipologia",
            transformers.tipologia(tipologie)
        );
        // Valore
        var valori = this.getValori();
        var valoreInputProps = this.bindToQueryParameter(
            "valore",
            transformers.valore(valori)
        );
        var valoreGetActiveStyle = function (valore) {
            return {
                background: valore.color,
                color: colors.white,
                fontSize: "13px",
                border: "1px " + colors.greyBorder
            };
        };
        // Compare
        var compareDate = this.getDateCompare();
        dateCompareProps = this.bindToQueryParameter(
            "dateCompare",
            transformers.dateCompare(compareDate)
        );
        // Date filter
        var filterDate = this.getDateFilter();
        var dateFilterProps = this.bindToQueryParameter(
            "dateFilter",
            transformers.dateFilter()
        );

        // Alarms
        var alarms = this.bindToQueryParameter(
            "alarms",
            transformers.alarms()
        );

        var valoriMulti = (
            !dateCompareProps.value &&
            sitoInputProps.value.length <= 1
        );

        return (
            <div>
                <components.TutorialAnchor
                    message={tutorialString.introTutorial}
                    order={0}
                    ref="intro"
                />
                <h2
                    className="text-center"
                    style={styles.titlePage}
                >
                    <components.Spacer direction="v" size={5} />
                    Storico consumi
                </h2>
                <bootstrap.Col sm={12} style={styles.colVerticalPadding}>
                    <span className="pull-left" style={{display: "flex"}}>
                        <components.TutorialAnchor
                            message={tutorialString.valori}
                            order={1}
                            position="right"
                            ref="valori"
                        >
                            <components.ButtonGroupSelect
                                allowedValues={valori}
                                getActiveStyle={valoreGetActiveStyle}
                                getKey={R.prop("key")}
                                getLabel={R.prop("label")}
                                multi={valoriMulti}
                                {...valoreInputProps}
                            />
                        </components.TutorialAnchor>
                        <components.TutorialAnchor
                            message={tutorialString.export}
                            order={2}
                            position="right"
                            ref="export"
                        >
                            <components.Popover
                                hideOnChange={true}
                                title={<img src={icons.iconExport} style={{width: "50%"}} />}
                                tooltipId="tooltipExport"
                                tooltipMessage="Esporta"
                                tooltipPosition="right"
                            >
                                <components.DropdownButton
                                    allowedValues={this.getExportType()}
                                    getIcon={R.prop("icon")}
                                    getKey={R.prop("key")}
                                    getLabel={R.prop("label")}
                                    onChange={this.onChangeExport}
                                />
                            </components.Popover>
                        </components.TutorialAnchor>
                    </span>
                    <span className="pull-right" style={{display: "flex"}}>
                        <components.TutorialAnchor
                            message={tutorialString.tipologie}
                            order={3}
                            position="left"
                            ref="tipologie"
                        >
                            <components.Popover
                                hideOnChange={true}
                                title={<img src={icons.iconPower} style={{width: "75%"}} />}
                                tooltipId="tooltipInterest"
                                tooltipMessage="Quantità d'interesse"
                                tooltipPosition="left"
                            >
                                <components.DropdownSelect
                                    allowedValues={tipologie}
                                    getKey={R.prop("key")}
                                    getLabel={R.prop("label")}
                                    style={{float: "left"}}
                                    {...tipologiaInputProps}
                                />
                            </components.Popover>
                        </components.TutorialAnchor>
                        <components.TutorialAnchor
                            message={tutorialString.siti}
                            order={4}
                            position="left"
                            ref="siti"
                        >
                            <components.Popover
                                hideOnChange={true}
                                style="inherit"
                                title={<img src={icons.iconSiti} style={{width: "75%"}} />}
                                tooltipId="tooltipMisurazione"
                                tooltipMessage="Punti di misurazione"
                                tooltipPosition="top"
                            >
                                <components.SelectTree
                                    allowedValues={siti}
                                    filter={CollectionUtils.siti.filter}
                                    getKey={CollectionUtils.siti.getKey}
                                    getLabel={CollectionUtils.siti.getLabel}
                                    placeholder={"Punto di misurazione"}
                                    {...sitoInputProps}
                                />
                            </components.Popover>
                        </components.TutorialAnchor>
                        <components.TutorialAnchor
                            message={tutorialString.dateFilter}
                            order={5}
                            position="left"
                            ref="dateFilter"
                        >
                            <components.DatefilterModal
                                allowedValues={filterDate}
                                getKey={R.prop("key")}
                                getLabel={R.prop("label")}
                                title={<img src={icons.iconCalendar} style={{width: "75%"}} />}
                                {...dateFilterProps}
                            />
                        </components.TutorialAnchor>
                        <components.TutorialAnchor
                            message={tutorialString.compare}
                            order={6}
                            position="left"
                            ref="compare"
                        >
                            <components.Compare>
                                <components.SitiCompare
                                    allowedValues={siti}
                                    filter={CollectionUtils.siti.filter}
                                    getKey={CollectionUtils.siti.getKey}
                                    getSitoLabel={CollectionUtils.siti.getLabel}
                                    open={"undefined"}
                                    style={multiselectStyles.multiselect}
                                    {...sitoInputProps}
                                />
                                <components.DataCompare
                                    allowedValues={compareDate}
                                    getKey={R.prop("key")}
                                    getLabel={R.prop("label")}
                                    {...dateCompareProps}
                                />
                            </components.Compare>
                        </components.TutorialAnchor>
                    </span>
                </bootstrap.Col>
                <bootstrap.Col  className="modal-container" sm={12} style={{height: "100%"}}>
                    <components.TutorialAnchor
                        message={tutorialString.graph}
                        order={7}
                        position="top"
                        ref="graph"
                    >
                        <components.HistoricalGraph
                            alarms={alarms.value}
                            dateCompare={dateCompareProps.value}
                            dateFilter={dateFilterProps.value}
                            misure={this.props.collections.get("misure") || Immutable.Map()}
                            ref="historicalGraph"
                            resetCompare={this.resetCompare}
                            siti={sitoInputProps.value}
                            style={graphStyle}
                            tipologia={tipologiaInputProps.value}
                            valori={valoreInputProps.value}
                        />
                    </components.TutorialAnchor>
                </bootstrap.Col>
            </div>
        );
    }
});

module.exports = Radium(Chart);
