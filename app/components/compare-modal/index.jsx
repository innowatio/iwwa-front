var bootstrap           = require("react-bootstrap");
var R                   = require("ramda");
var Radium              = require("radium");
var React               = require("react");

var components = require("components/");
var measures   = require("lib/measures");
import {defaultTheme} from "lib/theme";

var Compare = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ]),
        style: React.PropTypes.object,
        value: React.PropTypes.array
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            showModal: false,
            active: "activeSiteCompare",
            compare: " "
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    addCloseModalToChild: function (child) {
        var closeAction = this.close;
        return React.cloneElement(child, {
            closeModal: closeAction
        });
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
        const {colors} = this.getTheme();
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
        const {colors} = this.getTheme();
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
        var closeModal = this.addCloseModalToChild;
        return React.Children.map(this.props.children, function (child, index) {
            return (index === 0 ? closeModal(child) : null);
        });
    },
    renderDataCompare: function () {
        var closeModal = this.addCloseModalToChild;
        return React.Children.map(this.props.children, function (child, index) {
            return (index === 1 ? closeModal(child) : null);
        });
    },
    render: function () {
        return (
            <span>
                <bootstrap.ButtonGroup>
                    <components.Popover
                        hideOnChange={true}
                        title={
                            <components.Icon
                                color={this.getTheme().colors.iconCompare}
                                icon={"confront"}
                                size={"34px"}
                                style={{
                                    float: "right",
                                    verticalAlign: "middle",
                                    lineHeight: "20px"
                                }}
                            />
                        }
                        tooltipId="tooltipCompare"
                        tooltipMessage={"Comparazione"}
                        tooltipPosition="top"
                    >
                        <components.DropdownButton
                            allowedValues={this.getCompare()}
                            getIcon={R.prop("icon")}
                            getKey={R.prop("key")}
                            getLabel={R.prop("label")}
                            onChange={this.open}
                        />
                    </components.Popover>
                </bootstrap.ButtonGroup>
                <bootstrap.Modal
                    container={this}
                    enforceFocus={false}
                    onHide={this.close}
                    show={this.state.showModal}
                >
                    <Radium.Style
                        rules={{
                            ".modal-content": {
                                width: measures.modalWidthLarge
                            }
                        }}
                        scopeSelector=".modal-dialog"
                    />
                    <bootstrap.Modal.Header
                        closeButton={true}
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
