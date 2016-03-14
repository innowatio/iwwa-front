var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");

var components = require("components");
import {defaultTheme} from "lib/theme";

var ModalOptionList = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.array,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        header: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.object]),
        isModalOpen: React.PropTypes.bool,
        onClickConfirm: React.PropTypes.func,
        onClickReset: React.PropTypes.func,
        toggleModal: React.PropTypes.func,
        value: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object])
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            value: this.props.value ? this.props.value : []
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderGroupItems: function (value) {
        const {colors} = this.getTheme();
        const active = R.contains(this.props.getKey(value), this.props.value);
        if (React.isValidElement(value)) {
            return value;
        } else {
            return (
                <bootstrap.ListGroupItem
                    key={this.props.getKey(value)}
                    onClick={R.partial(value.action, [this.props.getKey(value)])}
                    style={{
                        backgroundColor: colors.transparent,
                        borderTop: "0",
                        borderRight: "0",
                        borderLeft: "0",
                        textAlign: "left",
                        borderRadius: "0",
                        fontSize: "16px",
                        outline: "none",
                        borderBottom: "1px solid " + colors.borderContentModal,
                        color: active ? colors.iconFlag : colors.mainFontColor
                    }}
                >
                    {this.props.getLabel(value)}
                    <components.Icon
                        color={colors.iconFlag}
                        icon={"flag"}
                        size={"28px"}
                        style={{
                            lineHeight: "20px",
                            float: "right",
                            visibility: active ? "visible" : "hidden"
                        }}
                    />
                </bootstrap.ListGroupItem>
            );
        }
    },
    renderModalBody: function () {
        const {colors} = this.getTheme();
        var repetitionItems = this.props.allowedValues.map(this.renderGroupItems);
        return (
            <div style={{
                width: "55%",
                margin: "0 auto",
                border: "1px solid " + colors.borderContentModal,
                backgroundColor: colors.backgroundContentModal,
                borderRadius: "20px"
            }}
            >
                <h4 style={{
                    color: colors.mainFontColor,
                    textAlign: "center",
                    padding: "20px 0px",
                    margin: "0px",
                    borderBottom: "1px solid " + colors.borderContentModal
                }}
                >{this.props.header}</h4>
                <bootstrap.ListGroup>
                    {repetitionItems.toArray ? repetitionItems.toArray() : repetitionItems}
                </bootstrap.ListGroup>
            </div>
        );
    },
    render: function () {
        return (
            <div style={{
                margin: "38px"
            }}
            >
                <components.FullscreenModal
                    children={this.renderModalBody()}
                    container={this}
                    onConfirm={this.props.onClickConfirm}
                    onHide={this.props.toggleModal}
                    onReset={this.props.onClickReset}
                    renderConfirmButton={true}
                    show={this.props.isModalOpen}
                >
                </components.FullscreenModal>
            </div>
        );
    }
});

module.exports = Radium(ModalOptionList);
