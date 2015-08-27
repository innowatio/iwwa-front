var R              = require("ramda");
var Radium         = require("radium");
var React          = require("react");
var bootstrap      = require("react-bootstrap");

var colors = require("lib/colors");
var components = require("components/");

var Compare = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ]),
        style: React.PropTypes.object,
        value: React.PropTypes.array
    },
    getInitialState: function () {
        return {
            showModal: false,
            active: "activeSiteCompare",
            compare: " "
        };
    },
    close: function () {
        this.setState({
            showModal: false
        });
    },
    open: function (value) {
        this.setState({
            showModal: true,
            compare: value.label
        });
    },
    closeSuccess: function () {
        this.close();
    },
    reset: function () {
        // this.props.onChange(null);
    },
    handleSelect: function (select) {
        this.setState({
            active: select
        });
    },
    selectedChackboxDate: function (value) {
        this.setState({
            value: value
        });
    },
    getCompare: function () {
        return [
            {label: "Confronta punti di misurazione", key: "confronta siti"},
            {label: "Confronta periodi", key: "confronta periodi"}
        ];
    },
    headerTitleCompare: function () {
        return this.state.compare === this.getCompare()[0].label ?
        this.renderSitiTitle() :
        this.renderDataTitle();
    },
    modalCompare: function () {
        return this.state.compare === this.getCompare()[0].label ?
        this.renderSitiCompare() :
        this.renderDataCompare();
    },
    renderSitiTitle: function () {
        return (
            <div>
                <bootstrap.Modal.Title className="text-center" style={{color: colors.primary}}>
                    {"Voglio confrontare questi punti di misurazione"}
                </bootstrap.Modal.Title>
                <h5 className="text-center">{"Seleziona due punti"}</h5>
            </div>
        );
    },
    renderDataTitle: function () {
        return (
            <div>
                <bootstrap.Modal.Title className="text-center" style={{color: colors.primary}}>
                    {"Voglio confrontare i dati attuali con"}
                </bootstrap.Modal.Title>
                <h5 className="text-center">{"Seleziona una delle seguenti opzioni"}</h5>
            </div>
        );
    },
    renderSitiCompare: function () {
        return React.Children.map(this.props.children, function (child, index) {
            return (index === 0 ? child : null);
        });
    },
    renderDataCompare: function () {
        return React.Children.map(this.props.children, function (child, index) {
            return (index === 1 ? child : null);
        });
    },
    renderResetButton: function () {
        return this.props.value ? (
            <bootstrap.Button onClick={this.reset}>
                <components.Icon icon="times" />
            </bootstrap.Button>
        ) : null;
    },
    render: function () {
        var iconCompare = "/_assets/icons/os__compare.svg";
        return (
            <span>
                <bootstrap.ButtonGroup>
                    <components.Popover
                        title={<img src={iconCompare} style={{width: "75%"}} />}
                        tooltipId="tooltipCompare"
                        tooltipMessage={"Comparazione"}
                        tooltipPosition="left"
                    >
                        <components.DropdownButton
                            allowedValues={this.getCompare()}
                            getIcon={R.prop("icon")}
                            getKey={R.prop("key")}
                            getLabel={R.prop("label")}
                            onChange={this.open}
                        />
                    </components.Popover>
                    {this.renderResetButton()}
                </bootstrap.ButtonGroup>
                    <bootstrap.Modal
                        container={this}
                        onHide={this.close}
                        show={this.state.showModal}
                    >
                        <Radium.Style
                            rules={{
                                ".modal-content": {
                                    width: "656px"
                                }
                            }}
                            scopeSelector=".modal-dialog"
                        />
                        <bootstrap.Modal.Header
                            closeButton
                            style={{borderBottom: "none"}}
                        >
                            {this.headerTitleCompare()}
                        </bootstrap.Modal.Header>
                        <bootstrap.Modal.Body style={{textAlign: "center"}}>
                            {this.modalCompare()}
                        </bootstrap.Modal.Body>
                    </bootstrap.Modal>
            </span>
        );
    }
});

module.exports = Radium(Compare);
