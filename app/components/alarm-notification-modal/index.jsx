var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");

var colors     = require("lib/colors");
var components = require("components");
var stringIt   = require("lib/string-it");
var styles     = require("lib/styles");
var icons      = require("lib/icons");

var AlarmNotificationModal = React.createClass({
    propTypes: {
        updateParentState: React.PropTypes.func.isRequired,
        value: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object]).isRequired
    },
    getInitialState: function () {
        return {
            isOpen: false,
            value: this.props.value ? this.props.value : []
        };
    },
    getNotificationOptions: function () {
        return [
            {label: "Email", key: "mail", action: this.actionPutOrRemoveInArray},
            // {label: "Sms", key: "sms", action: this.actionPutOrRemoveInArray},
            {label: "Notifiche App", key: "push", action: this.actionPutOrRemoveInArray}
        ];
    },
    labelParser: function () {
        var labels = [];
        var values = this.props.value;
        this.getNotificationOptions().map(function (record) {
            if (R.contains(record.key, values)) {
                labels.push(record.label);
            }
        });
        return labels.join(" - ");
    },
    actionPutOrRemoveInArray: function (value) {
        var newValue = this.state.value;
        if (R.isArrayLike(value)) {
            newValue = value;
        } else {
            if (R.contains(value, newValue)) {
                newValue.splice(newValue.indexOf(value), 1);
            } else {
                newValue.push(value);
            }
        }
        if (newValue.length === 0) {
            newValue.push(R.prop("key", this.getNotificationOptions()[0]));
        }
        this.setState({value: newValue});
    },
    onClickConfirm: function () {
        var stateValue = {};
        stateValue.notification = this.state.value;
        this.props.updateParentState(stateValue);
        this.toggleModal();
    },
    toggleModal: function () {
        this.setState({isOpen: !this.state.isOpen});
    },
    render: function () {
        return (
            <span>
                <h4 style={{color: colors.primary}}>{stringIt.titleAlarmNotify}</h4>
                <div onClick={this.toggleModal} style={styles.divAlarmOpenModal}>
                    {this.labelParser()}
                    <img src={icons.iconArrowRight} style={{float: "right", width: "33px"}} />
                </div>
                <components.ModalOptionList
                    allowedValues={this.getNotificationOptions()}
                    getKey={R.prop("key")}
                    getLabel={R.prop("label")}
                    header={<h4 style={{color: colors.primary}}>{"Seleziona tipo di notifica"}</h4>}
                    isModalOpen={this.state.isOpen}
                    onClickConfirm={this.onClickConfirm}
                    onClickReset={this.toggleModal}
                    toggleModal={this.toggleModal}
                    value={this.state.value}
                />
            </span>
        );
    }
});

module.exports = Radium(AlarmNotificationModal);
