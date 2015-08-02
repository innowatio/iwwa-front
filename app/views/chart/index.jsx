var color      = require("color");
var Immutable  = require("immutable");
var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
var titleCase  = require("title-case");

var colors           = require("lib/colors");
var components       = require("components/");
var styles           = require("lib/styles");
var QuerystringMixin = require("lib/querystring-mixin");
var transformers     = require("./transformers.js");

var multiselectStyles = {
    multiselectPopover: {
        width: "175px"
    },
    multiselect: {
        width: "550px",
        height: "35px"
    },
    tag: {
        display: "inline-block",
        width: "150px",
        float: "left",
        paddingLeft: "10px",
        paddingRight: "10px",
        fontSize: "11px",
        overflow: "hidden",
        textOverflow: "ellipsis"
    }
};

var graphStyle = {
    border: "solid 1px " + color(colors.darkBlack).alpha(0.1).rgbString(),
    boxShadow: "2px 2px 5px " + colors.greySubTitle,
    marginBottom: "15px"
};

var getSitoLabel = function (sito) {
    return [
        titleCase(sito.get("societa")),
        titleCase(sito.get("idCoin"))
    ].join(" - ");
};
var SitoTagComponent = React.createClass({
    propTypes: {
        item: IPropTypes.map
    },
    render: function () {
        return (
            <span style={multiselectStyles.tag}>
                {getSitoLabel(this.props.item)}
            </span>
        );
    }
});
var filterSito = function (item, search) {
    var searchRegExp = new RegExp(search, "i");
    return (
        searchRegExp.test(item.get("societa")) ||
        searchRegExp.test(item.get("idCoin"))
    );
};

var Chart = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map
    },
    mixins: [QuerystringMixin],
    componentDidMount: function () {
        this.props.asteroid.on("connected", (function () {
            this.props.asteroid.subscribe("siti");
        }).bind(this));
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
        var iconCSV = "/_assets/icons/os__CSV.svg";
        var iconPNG = "/_assets/icons/os__JPG.svg";
        return [
            {label: "Png", key: "png", icon: iconPNG},
            {label: "Csv", key: "csv", icon: iconCSV}
        ];
    },
    getCompare: function () {
        return [
            {label: "Ieri e oggi", key: "ieri e oggi"},
            {label: "Oggi con stesso giorno una settimana fa", key: "1 giorno della settimana"},
            {label: "Settimana corrente con settimana precedente", key: "1 settimana fa"},
            {label: "Mese corrente con mese precedente", key: "1 mese fa"},
            {label: "Mese corrente con stesso mese anno precedente", key: "stesso mese anno scorso"}
        ];
    },
    onChangeExport: function (valueChanged) {
        console.log("Esporta con " + valueChanged.label);
    },
    render: function () {
        // Icone
        var iconExport = "/_assets/icons/os__export.svg";
        var iconPower = "/_assets/icons/os__power.svg";
        var iconSiti = "/_assets/icons/os__map.svg";
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
                color: colors.white
            };
        };
        // Date Compare
        var periods = this.getPeriods();
        var dateCompareProps = this.bindToQueryParameter(
            "dateCompare",
            transformers.dateCompare(periods)
        );
        // Compare
        var compare = this.getCompare();

        var valoriMulti = (
            !dateCompareProps.value &&
            sitoInputProps.value.length <= 1
        );
        return (
            <div>
                <h2
                    className="text-center"
                    style={{
                            color: colors.titleColor,
                            backgroundColor: colors.greyBackground,
                            marginTop: "0px",
                            height: "40px",
                            fontSize: "20pt"
                        }}
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
                            style={{width: "18px"}}
                            title={<img src={iconExport} style={{width: "25px"}} />}
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
                    <span className="pull-right">
                        <components.Spacer direction="h" size={10} />
                        <components.Popover
                            title={<img src={iconPower} style={{width: "25px"}} />}
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
                            title={<img src={iconSiti} style={{width: "25px"}} />}
                            tooltipMessage="Punti di misurazione.
                                Puoi selezionare un singolo punto oppure due per confrontarli"
                            tooltipPosition="left"
                        >
                            <components.Multiselect
                                allowedValues={siti}
                                filter={filterSito}
                                getLabel={getSitoLabel}
                                maxValues={2}
                                open=" "
                                style={multiselectStyles.multiselectPopover}
                                tagComponent={SitoTagComponent}
                                {...sitoInputProps}
                            />
                        </components.Popover>
                        <components.Spacer direction="h" size={10} />
                        <components.DatefilterModal
                            getPeriodKey={R.prop("key")}
                            getPeriodLabel={R.prop("label")}
                            periods={periods}
                            {...dateCompareProps}
                        />
                        <components.Compare>
                            <components.SitiCompare
                                allowedValues={siti}
                                filter={filterSito}
                                getSitoLabel={getSitoLabel}
                                open={"undefined"}
                                style={multiselectStyles.multiselect}
                                value={[]}
                            />
                            <components.DataCompare
                                allowedValues={compare}
                                getKey={R.prop("key")}
                                getLabel={R.prop("label")}
                            />
                        </components.Compare>
                    </span>
                </bootstrap.Col>
                <bootstrap.Col sm={12} style={{height: "100%"}}>
                    <components.HistoricalGraph
                        dateCompare={dateCompareProps.value}
                        misure={this.props.collections.get("misure") || Immutable.Map()}
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
