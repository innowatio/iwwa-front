import {contains, isArrayLike, prop} from "ramda";
import React, {PropTypes} from "react";

import components from "components";
import stringIt from "lib/string-it";
import icons from "lib/icons";
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

var AlarmNotificationModal = React.createClass({
    propTypes: {
        updateParentState: PropTypes.func.isRequired,
        value: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object]).isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            isOpen: false,
            value: this.props.value ? this.props.value : []
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
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
            if (contains(record.key, values)) {
                labels.push(record.label);
            }
        });
        return labels.join(" - ");
    },
    actionPutOrRemoveInArray: function (value) {
        var newValue = this.state.value;
        if (isArrayLike(value)) {
            newValue = value;
        } else {
            if (contains(value, newValue)) {
                newValue.splice(newValue.indexOf(value), 1);
            } else {
                newValue.push(value);
            }
        }
        if (newValue.length === 0) {
            newValue.push(prop("key", this.getNotificationOptions()[0]));
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
        const {colors} = this.getTheme();
        return (
            <span>
                <h4 style={{color: colors.primary}}>{stringIt.titleAlarmNotify}</h4>
                <div onClick={this.toggleModal} style={styles(this.getTheme()).divAlarmOpenModal}>
                    {this.labelParser()}
                    <img src={icons.iconArrowRight} style={{float: "right", width: "33px"}} />
                </div>
                <components.ModalOptionList
                    allowedValues={this.getNotificationOptions()}
                    getKey={prop("key")}
                    getLabel={prop("label")}
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

module.exports = AlarmNotificationModal;
