import Radium from "radium";
import R from "ramda";
import React, {PropTypes} from "react";
import {reduxForm, Field} from "redux-form";

import {FormInputText, FullscreenModal} from "components";

import {styles} from "lib/styles";
import {defaultTheme} from "lib/theme";

const validate = values => {
    const errors = {};
    if (!values.email) {
        errors.email = "L'email è richiesta";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Inserisci un formato email corretto";
    }
    return errors;
};

var NewUserModal = React.createClass({
    propTypes: {
        handleSubmit: PropTypes.func.isRequired,
        onConfirm: PropTypes.func,
        onHide: PropTypes.func,
        show: PropTypes.bool
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    onConfirm: function (data) {
        this.props.onConfirm(data.email);
    },
    // this.props.onHide();
    renderFormInput: function (field) {
        const theme = this.getTheme();
        return (
            <div
                className={"form-group" + (field.meta.touched && field.meta.error ? " has-error" : "")}
                style={{width: "90%", margin: "5%"}}
            >
                <FormInputText
                    field={field.input}
                    placeholder="Indirizzo email"
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
        const {handleSubmit, onHide, show} = this.props;
        const theme = this.getTheme();
        return (
            <FullscreenModal
                onConfirm={handleSubmit(this.onConfirm)}
                onHide={onHide}
                renderConfirmButton={true}
                show={show}
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
                        {"Crea nuovo utente"}
                    </h3>
                    <Field
                        name="email"
                        component={this.renderFormInput}
                        type="email"
                    />
                </form>
            </FullscreenModal>
        );
    }
});

module.exports = reduxForm({form: "newUser", validate})(NewUserModal);
