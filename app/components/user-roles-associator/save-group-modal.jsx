import Radium from "radium";
import R from "ramda";
import React, {PropTypes} from "react";
import {reduxForm} from "redux-form";

import {FormInputText, FullscreenModal} from "components";

import {styles} from "lib/styles";
import {defaultTheme} from "lib/theme";

const fields = ["name"];

const validate = values => {
    const errors = {};
    if (!values.name) {
        errors.name = "Required";
    } else if (values.name.length < 3) {
        errors.name = "Must be 3 characters or more";
    }
    //TODO aggiungere validazione di profilo doppio (sia il nome che i ruoli!!)
    return errors;
};

var SaveGroupModal = React.createClass({
    propTypes: {
        fields: PropTypes.object.isRequired,
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
    confirmGroupName: function (data) {
        const {onHide, saveAndAssignGroupToUsers, usersState} = this.props;
        saveAndAssignGroupToUsers(usersState.selectedUsers, data.name, usersState.selectedRoles);
        this.setState({showSaveGroupModal: false});
        onHide();
    },
    render: function () {
        const {
            fields: {name},
            handleSubmit
        } = this.props;
        const theme = this.getTheme();
        return (
            <FullscreenModal
                onConfirm={handleSubmit(this.confirmGroupName)}
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
                    <div className={"form-group" + (name.touched && name.error ? " has-error" : "")} style={{marginBottom: "15px", padding:"1px"}}>
                        <div className={"col-xs-12"}>
                            <FormInputText
                                field={name}
                                placeholder="Assegna un nome a questo profilo"
                                style={R.merge(styles(theme).inputLine, {
                                    color: theme.colors.buttonPrimary,
                                    padding: "20px",
                                    margin: "5%",
                                    width: "90%"
                                })}
                            />
                        </div>
                        {name.touched && name.error && <div className="col-xs-12 help-block">{name.error}</div>}
                    </div>
                </form>
            </FullscreenModal>
        );
    }
});

module.exports = reduxForm({form: "groupName", fields, validate})(SaveGroupModal);