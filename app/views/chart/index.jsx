var color      = require("color");
var Immutable  = require("immutable");
var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");

var colors           = require("lib/colors");
var components       = require("components/");
var icons            = require("lib/icons");
var styles           = require("lib/styles");
var QuerystringMixin = require("lib/querystring-mixin");
var CollectionUtils  = require("lib/collection-utils");
var transformers     = require("./transformers.js");

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

var Chart = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map
    },
    mixins: [QuerystringMixin],
    componentDidMount: function () {
        this.props.asteroid.subscribe("siti");
    },
    componentWillReceiveProps: function (props) {
        var self = this;
        var sitoQuery = R.path(["location", "query", "sito"], props);
        var siti = (sitoQuery && sitoQuery.split(",")) || [];
        siti.forEach(function (sito) {
            self.props.asteroid.subscribe("misureBySito", sito);
        });
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
            {label: "Contrattuale", color: colors.lineContrattuale, key: "contrattuale"},
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
    render: function () {
        // Sito
        var siti = this.props.collections.get("siti") || Immutable.Map();
        var sitoInputProps = this.bindToQueryParameter(
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
        var dateCompareProps = this.bindToQueryParameter(
            "dateCompare",
            transformers.dateCompare(compareDate)
        );
        // Date filter
        var filterDate = this.getDateFilter();
        var dateFilterProps = this.bindToQueryParameter(
            "dateFilter",
            transformers.dateFilter()
        );

        var valoriMulti = (
            !dateCompareProps.value &&
            sitoInputProps.value.length <= 1
        );
        return (
            <div>
                <h2
                    className="text-center"
                    style={styles.titlePage}
                >
                    <components.Spacer direction="v" size={5} />
                    Storico consumi
                </h2>
                <bootstrap.Col sm={12} style={styles.colVerticalPadding}>
                    <span className="pull-left">
                        <components.ButtonGroupSelect
                            allowedValues={valori}
                            getActiveStyle={valoreGetActiveStyle}
                            getKey={R.prop("key")}
                            getLabel={R.prop("label")}
                            multi={valoriMulti}
                            {...valoreInputProps}
                        />
                        <components.Popover
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
                    </span>
                    <span className="pull-right" style={{display: "flex"}}>
                        <components.Popover
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
                        <components.Popover
                            style="inherit"
                            title={<img src={icons.iconSiti} style={{width: "75%"}} />}
                            tooltipId="tooltipMisurazione"
                            tooltipMessage="Punti di misurazione"
                            tooltipPosition="top"
                        >
                            <components.SelectTree
                                allowedValues={siti}
                                filter={CollectionUtils.siti.filter}
                                getLabel={CollectionUtils.siti.getLabel}
                                placeholder={"Punto di misurazione"}
                                {...sitoInputProps}
                            />
                        </components.Popover>
                        <components.DatefilterModal
                            allowedValues={filterDate}
                            getKey={R.prop("key")}
                            getLabel={R.prop("label")}
                            title={<img src={icons.iconCompare} style={{width: "75%"}} />}
                            {...dateFilterProps}
                        />
                        <components.Compare>
                            <components.SitiCompare
                                allowedValues={siti}
                                filter={CollectionUtils.siti.filter}
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
                    </span>
                </bootstrap.Col>
                <bootstrap.Col sm={12} style={{height: "100%"}}>
                    <components.HistoricalGraph
                        dateCompare={dateCompareProps.value}
                        dateFilter={dateFilterProps.value}
                        misure={this.props.collections.get("misure") || Immutable.Map()}
                        ref="historicalGraph"
                        siti={sitoInputProps.value}
                        style={graphStyle}
                        tipologia={tipologiaInputProps.value}
                        valori={valoreInputProps.value}
                    />
                </bootstrap.Col>
            </div>
        );
    }
});

module.exports = Radium(Chart);
