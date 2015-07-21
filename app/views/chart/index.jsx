var Immutable  = require("immutable");
var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
var titleCase  = require("title-case");

var components       = require("components");
var styles           = require("lib/styles");
var QuerystringMixin = require("lib/querystring-mixin");
var transformers     = require("./transformers.js");

var multiselectStyles = {
    multiselect: {
        width: "348.5px"
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
            {label: "Reale", key: "reale"},
            {label: "Contrattuale", key: "contrattuale"},
            {label: "Previsionale", key: "previsionale"}
        ];
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
        // Date Compare
        var periods = this.getPeriods();
        var dateCompareProps = this.bindToQueryParameter(
            "dateCompare",
            transformers.dateCompare(periods)
        );
        var valoriMulti = (
            !dateCompareProps.value &&
            sitoInputProps.value.length <= 1
        );
        return (
            <div>
                <bootstrap.Col sm={12} style={styles.colVerticalPadding}>
                    <span className="pull-left">
                        <components.ButtonGroupSelect
                            allowedValues={valori}
                            getKey={R.prop("key")}
                            getLabel={R.prop("label")}
                            multi={valoriMulti}
                            {...valoreInputProps}
                        />
                    </span>
                    <span className="pull-left">
                        <components.Spacer direction="h" size={10} />
                        <components.DatefilterModal
                            getPeriodKey={R.prop("key")}
                            getPeriodLabel={R.prop("label")}
                            periods={periods}
                            {...dateCompareProps}
                        />
                    </span>
                    <span className="pull-right">
                        <components.Spacer direction="h" size={10} />
                        <components.Multiselect
                            allowedValues={siti}
                            filter={filterSito}
                            getLabel={getSitoLabel}
                            maxValues={2}
                            style={multiselectStyles.multiselect}
                            tagComponent={SitoTagComponent}
                            title="Punto di misurazione"
                            {...sitoInputProps}
                        />
                    </span>
                    <span className="pull-right">
                        <components.DropdownSelect
                            allowedValues={tipologie}
                            getKey={R.prop("key")}
                            getLabel={R.prop("label")}
                            style={{float: "left"}}
                            title="Quantità di interesse"
                            {...tipologiaInputProps}
                        />
                    </span>
                </bootstrap.Col>
                <bootstrap.Col sm={12} style={{height: "500px"}}>
                    <components.Spacer direction="v" size={32} />
                    <components.HistoricalGraph
                        dateCompare={dateCompareProps.value}
                        misure={this.props.collections.get("misure") || Immutable.Map()}
                        siti={sitoInputProps.value}
                        tipologia={tipologiaInputProps.value}
                        valori={valoreInputProps.value}
                    />
                </bootstrap.Col>
            </div>
        );
    }
});

module.exports = Radium(Chart);
