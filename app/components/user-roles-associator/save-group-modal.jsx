import Radium from "radium";
import R from "ramda";
import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {reduxForm, Field, SubmissionError} from "redux-form";

import {FormInputText, FullscreenModal} from "components";

import {styles} from "lib/styles";
import {defaultTheme} from "lib/theme";

var SaveGroupModal = React.createClass({
    propTypes: {
        allGroups: IPropTypes.map,
        handleSubmit: PropTypes.func.isRequired,
        onHide: PropTypes.func,
        saveAndAssignGroupToUsers: PropTypes.func.isRequired,
        show: PropTypes.bool,
        usersState: PropTypes.object.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    confirmGroupName: function (name) {
        const {onHide, saveAndAssignGroupToUsers, usersState} = this.props;
        saveAndAssignGroupToUsers(usersState.selectedUsers, name, usersState.selectedRoles);
        onHide();
    },
    validateGroup: function ({name}) {
        return new Promise(resolve => setTimeout(resolve, 1)).then(() => {
            if (!name) {
                throw new SubmissionError({name: "Il nome è richiesto", _error: "error"});
            } else if (name.length < 3) {
                throw new SubmissionError({name: "Dev'essere di 3 o più caratteri"});
            }
            const selectedRoles = this.props.usersState.selectedRoles.sort().toString();
            this.props.allGroups.forEach(group => {
                if (group.get("name").toLowerCase() === name.toLowerCase()) {
                    throw new SubmissionError({name: "C'è già un profilo con lo stesso nome"});
                }
                if (selectedRoles === group.get("roles").toJS().sort().toString()) {
                    throw new SubmissionError({name: "C'è già un profilo ('" + group.get("name") + "') con le stesse funzionalità"});
                }
            });
            this.confirmGroupName(name);
        });
    },
    renderFormInput: function (field) {
        const theme = this.getTheme();
        return (
            <div
                className={"form-group" + (field.meta.touched && field.meta.error ? " has-error" : "")}
                style={{width: "90%", margin: "5%"}}
            >
                <FormInputText
                    field={field.input}
                    placeholder="Assegna un nome a questo profilo"
                    style={R.merge(styles(theme).inputLine, {
                        color: theme.colors.buttonPrimary
                    })}
                    type={field.type}
                />
                {field.meta.touched && field.meta.error && <div className="help-block">{field.meta.error}</div>}
            </div>
        );
    },
    render: function () {
        const {handleSubmit} = this.props;
        const theme = this.getTheme();
        return (
            <FullscreenModal
                onConfirm={handleSubmit(this.validateGroup)}
                onHide={this.props.onHide}
                renderConfirmButton={true}
                show={this.props.show}
            >
                <form className="form-fields">
                    <Radium.Style
                        rules={styles(theme).formFields}
                        scopeSelector={".form-fields"}
                    />
                    <h3
                        className="text-center"
                        style={{
                            color: theme.colors.mainFontColor,
                            fontSize: "24px",
                            fontWeight: "400",
                            marginBottom: "20px",
                            textTransform: "uppercase",
                            paddingBottom: "20px",
                            borderBottom: "1px solid " + theme.colors.borderContentModal
                        }}
                    >
                        {"Nome profilo"}
                    </h3>
                    <Field
                        name="name"
                        component={this.renderFormInput}
                        type="text"
                    />
                </form>
            </FullscreenModal>
        );
    }
});

module.exports = reduxForm({form: "groupName"})(SaveGroupModal);
