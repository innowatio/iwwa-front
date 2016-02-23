var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var Modal = bootstrap.Modal;

var components = require("components");
var measures   = require("lib/measures");
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
                        color: colors.greySubTitle,
                        textAlign: "left"
                    }}
                >
                    {this.props.getLabel(value)}
                    <components.Icon
                        color={this.getTheme().colors.iconFlag}
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
    render: function () {
        const {colors} = this.getTheme();
        var repetitionItems = this.props.allowedValues.map(this.renderGroupItems);
        return (
            <div>
                <Modal
                    container={this}
                    onHide={this.props.toggleModal}
                    show={this.props.isModalOpen}
                >
                    <Radium.Style
                        rules={{
                            ".modal-content": {
                                width: measures.modalWidthMedium,
                                left: "calc(50% - 400px / 2)"
                            }
                        }}
                        scopeSelector=".modal-dialog"
                    />
                    <Modal.Header
                        closeButton={true}
                        style={{borderBottom: "none"}}
                    >
                        {this.props.header}
                    </Modal.Header>
                    <Modal.Body style={{textAlign: "center"}}>
                        <bootstrap.ListGroup>
                            {repetitionItems.toArray ? repetitionItems.toArray() : repetitionItems}
                        </bootstrap.ListGroup>
                    </Modal.Body>
                    <Modal.Footer style={{textAlign: "center"}}>
                        <components.Button
                            onClick={this.props.onClickConfirm}
                            style={{
                                background: colors.primary,
                                color: colors.white,
                                height: "45px"
                            }}
                        >
                            {"CONFERMA"}
                        </components.Button>
                        <components.Button
                            onClick={this.props.onClickReset}
                            style={{
                                background: colors.greyBackground,
                                color: colors.primary,
                                height: "45px"
                            }}
                        >
                            {"RESET"}
                        </components.Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
});

module.exports = Radium(ModalOptionList);
