var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");

var colors     = require("lib/colors");
var components = require("components");
var measures   = require("lib/measures");

var AlarmRepetitionModal = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.array,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        header: React.PropTypes.object,
        modalState: React.PropTypes.bool,
        toggleModal: React.PropTypes.func,
        value: React.PropTypes.array
    },
    getInitialState: function () {
        return {
            isOpen: this.props.modalState
        };
    },
    renderAlarmRepetitionGroupItems: function (value) {
        var active = R.contains(this.props.getKey(value), this.props.value);
        return (
            <bootstrap.ListGroupItem
                key={this.props.getKey(value)}
                onClick={R.partial(value.action, this.props.getKey(value))}
                style={{
                    color: colors.greySubTitle,
                    textAlign: "left"
                }}
            >
                {this.props.getLabel(value)}
                <components.Icon icon="check" style={{float: "right", visibility: active ? "visible" : "hidden"}}/>
            </bootstrap.ListGroupItem>
        );
    },
    render: function () {
        var repetitionItems = this.props.allowedValues.map(this.renderAlarmRepetitionGroupItems);
        return (
            <div>
                <bootstrap.Modal
                    container={this}
                    enforceFocus={false}
                    onHide={this.props.toggleModal}
                    show={this.props.modalState}
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
                    <bootstrap.Modal.Header
                        closeButton
                        style={{borderBottom: "none"}}
                    >
                        {this.props.header}
                    </bootstrap.Modal.Header>
                    <bootstrap.Modal.Body style={{textAlign: "center"}}>
                        <bootstrap.ListGroup>
                            {repetitionItems.toArray ? repetitionItems.toArray() : repetitionItems}
                        </bootstrap.ListGroup>
                    </bootstrap.Modal.Body>
                </bootstrap.Modal>
            </div>
        );
    }
});

module.exports = Radium(AlarmRepetitionModal);
