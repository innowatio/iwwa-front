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
            value: "Ieri e oggi"
        };
    },
    close: function () {
        this.setState({
            showModal: false
        });
    },
    open: function () {
        this.setState({
            showModal: true
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
                    <components.Button bsStyle="link" onClick={this.open}>
                        <img src={iconCompare} style={{width: "22px"}}/>
                    </components.Button>
                    {this.renderResetButton()}
                </bootstrap.ButtonGroup>
                <bootstrap.Modal
                    container={this}
                    onHide={this.close}
                    show={this.state.showModal}
                >
                    <bootstrap.Modal.Header closeButton>
                        <bootstrap.Modal.Title className="text-center" style={{color: colors.primary}}>
                            {"Cosa vuoi confrontare?"}
                        </bootstrap.Modal.Title>
                    </bootstrap.Modal.Header>
                    <bootstrap.Modal.Body>
                        <bootstrap.TabbedArea defaultActiveKey={1} justified>
                              <bootstrap.TabPane eventKey={1} tab="Punti di misurazione">{this.renderSitiCompare()}</bootstrap.TabPane>
                              <bootstrap.TabPane eventKey={2} tab="Periodi">{this.renderDataCompare()}</bootstrap.TabPane>
                        </bootstrap.TabbedArea>
                    </bootstrap.Modal.Body>
                    <bootstrap.Modal.Footer>
                        <components.Button onClick={this.close}>
                            {"Cancel"}
                        </components.Button>
                        <components.Button onClick={this.closeSuccess}>
                            {"Apply"}
                        </components.Button>
                    </bootstrap.Modal.Footer>
                </bootstrap.Modal>
            </span>
        );
    }
});

module.exports = Radium(Compare);
