import {contains, isArrayLike, prop} from "ramda";
import React, {PropTypes} from "react";

import components from "components";
import stringIt from "lib/string-it";
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

var styleH3 = ({colors}) => ({
    fontSize: "20px",
    lineHeight: "20px",
    fontWeight: "400",
    color: colors.mainFontColor
});

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
        const theme = this.getTheme();
        return (
            <div>
                <h3 style={styleH3(theme)}>{stringIt.titleAlarmNotify}</h3>
                <div onClick={this.toggleModal} style={styles(theme).divAlarmOpenModal}>
                    {this.labelParser()}
                    <components.Icon
                        color={theme.colors.iconArrow}
                        icon={"arrow-right"}
                        size={"38px"}
                        style={{
                            float: "right",
                            verticalAlign: "middle",
                            lineHeight: "20px"
                        }}
                    />

                </div>
                <components.ModalOptionList
                    allowedValues={this.getNotificationOptions()}
                    getKey={prop("key")}
                    getLabel={prop("label")}
                    header={"Seleziona tipo di notifica"}
                    isModalOpen={this.state.isOpen}
                    onClickConfirm={this.onClickConfirm}
                    onClickReset={this.toggleModal}
                    toggleModal={this.toggleModal}
                    value={this.state.value}
                />
            </div>
        );
    }
});

module.exports = AlarmNotificationModal;
