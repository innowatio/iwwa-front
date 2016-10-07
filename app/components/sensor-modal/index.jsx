import React, {PropTypes} from "react";
import {Col} from "react-bootstrap";
import IPropTypes from "react-immutable-proptypes";
import Select from "react-select";
import Radium from "radium";
import TagsInput from "react-tagsinput";
import {reduxForm, Field} from "redux-form";

import {FormInputText, FullscreenModal, SensorAggregator, TagList} from "components";

import {hasRole, VIEW_FORMULA_DETAILS} from "lib/roles-utils";
import {potentialUnitsOfMeasurement} from "lib/sensors-utils";
import {styles} from "lib/styles";
import {defaultTheme} from "lib/theme";

const validate = values => {
    const errors = {};
    if (!values.name) {
        errors.name = "Campo Richiesto";
    } else if (values.name.length < 5) {
        errors.name = "Dev'essere di 5 o più caratteri";
    }
    if (!values.description) {
        errors.description = "Campo Richiesto";
    }
    if (!values.unitOfMeasurement) {
        errors.unitOfMeasurement = "Campo Richiesto";
    }
    return errors;
};

var SensorForm = React.createClass({
    propTypes: {
        addItemToFormula: PropTypes.func.isRequired,
        allSensors: IPropTypes.map,
        asteroid: PropTypes.object,
        closeForm: PropTypes.func.isRequired,
        currentSensor: IPropTypes.map,
        handleSubmit: PropTypes.func.isRequired,
        initialValues: PropTypes.object,
        onSave: PropTypes.func.isRequired,
        removeItemFromFormula: PropTypes.func.isRequired,
        resetForm: PropTypes.func.isRequired,
        sensorState: PropTypes.object,
        sensorsToAggregate: PropTypes.array,
        showFullscreenModal: PropTypes.bool.isRequired,
        showSensorAggregator: PropTypes.bool.isRequired,
        submitting: PropTypes.bool.isRequired,
        title: PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getSensorOperator: function () {
        const theme = this.getTheme();
        return [
            {type: "add", key: "plus", backgroundColor: theme.colors.iconOperatorBg1},
            {type: "minus", key: "minus", backgroundColor: theme.colors.iconOperatorBg1},
            {type: "multiply", key: "multiply", backgroundColor: theme.colors.iconOperatorBg1},
            {type: "divide", key: "divide", backgroundColor: theme.colors.iconOperatorBg1},
            {type: "open-braket", key: "open-braket", backgroundColor: theme.colors.iconOperatorBg2},
            {type: "close-braket", key: "close-braket", backgroundColor: theme.colors.iconOperatorBg2},
            {type: "circumflex", key: "circumflex", backgroundColor: theme.colors.iconOperatorBg2},
            {type: "square-root", key: "square-root", backgroundColor: theme.colors.iconOperatorBg2},
            {type: "delta", key: "delta", backgroundColor: theme.colors.iconOperatorBg2},
            {type: "add-1y", key: "add-1y", backgroundColor: theme.colors.iconOperatorBg3},
            {type: "add-1m", key: "add-1m", backgroundColor: theme.colors.iconOperatorBg3},
            {type: "add-1w", key: "add-1w", backgroundColor: theme.colors.iconOperatorBg3},
            {type: "add-1d", key: "add-1d", backgroundColor: theme.colors.iconOperatorBg3},
            {type: "add-15m", key: "add-15m", backgroundColor: theme.colors.iconOperatorBg3},
            {type: "remove-1y", key: "remove-1y", backgroundColor: theme.colors.iconOperatorBg3},
            {type: "remove-1m", key: "remove-1m", backgroundColor: theme.colors.iconOperatorBg3},
            {type: "remove-1w", key: "remove-1w", backgroundColor: theme.colors.iconOperatorBg3},
            {type: "remove-1d", key: "remove-1d", backgroundColor: theme.colors.iconOperatorBg3},
            {type: "remove-15m", key: "remove-15m", backgroundColor: theme.colors.iconOperatorBg3}
        ];
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    saveForm: function (data) {
        this.props.onSave(data, this.props.sensorState.formulaItems, this.props.currentSensor);
        this.props.closeForm();
    },
    renderSensorAggregation: function () {
        let {showSensorAggregator, sensorState, currentSensor} = this.props;
        if (showSensorAggregator || sensorState.formulaItems.length > 0 ||
            (currentSensor && currentSensor.get("formulas") && currentSensor.get("formulas").size == 1)) {
            return (
                <SensorAggregator
                    allSensors={this.props.allSensors}
                    addItemToFormula={this.props.addItemToFormula}
                    formulaItems={sensorState.formulaItems}
                    operators={this.getSensorOperator()}
                    removeItemFromFormula={this.props.removeItemFromFormula}
                    sensors={this.props.sensorsToAggregate}
                />
            );
        }
    },
    renderTagInput: function (props) {
        return (
            <input type="text" placeholder="Tags" {...props} />
        );
    },
    renderInputTextField: function (field) {
        const theme = this.getTheme();
        return (
            <div className={"form-group" + (field.meta.touched && field.meta.error ? " has-error" : "")} style={{marginBottom: "15px", padding:"1px"}}>
                <div className={"col-xs-12"}>
                    <FormInputText
                        field={field.input}
                        placeholder={field.label}
                        style={styles(theme).inputLine}
                        type="text"
                    />
                </div>
                {field.meta.touched && field.meta.error && <div className="col-xs-12 help-block">{field.meta.error}</div>}
            </div>
        );
    },
    renderTextAreaField: function (field) {
        const theme = this.getTheme();
        return (
            <div className={"form-group" + (field.meta.touched && field.meta.error ? " has-error" : "")}>
                <div className={"col-xs-12"}>
                    <label style={{
                        width: "100%",
                        color: theme.colors.textGrey,
                        fontSize: "16px",
                        fontWeight: "300",
                        marginTop: "10px"
                    }}>
                        {field.label}
                    </label>
                    <textarea
                        className="form-control"
                        style={{...styles(theme).inputLine,
                            resize: "none",
                            margin: "0px",
                            padding: "5px 0px",
                            height: "133px"
                        }}
                        {...field.input}
                    />
                </div>
                {field.meta.touched && field.meta.error && <div className="col-xs-12 help-block">{field.meta.error}</div>}
            </div>
        );
    },
    renderSelectInputField: function (field) {
        const theme = this.getTheme();
        return (
            <div className={"form-group" + (field.meta.touched && field.meta.error ? " has-error" : "")}>
                <div
                    className={"col-xs-12"}
                    style={{marginBottom: "20px"}}
                >
                    <Radium.Style
                        rules={styles(theme).sensorModalSelect}
                        scopeSelector=".sensor-modal-select"
                    />
                    <Select
                        className="sensor-modal-select"
                        name="unitOfMeasurement"
                        onChange={field.input.onChange}
                        options={potentialUnitsOfMeasurement}
                        placeholder={field.label}
                        value={field.input.value}
                    />
                    {field.meta.touched && field.meta.error && <div className="col-xs-12 help-block">{field.meta.error}</div>}
                </div>
            </div>
        );
    },
    renderTagListField: function (field) {
        return (
            <TagList
                className={"tags-wrp form-group col-xs-12"}
                style={{marginBottom: "15px"}}
                tagIcon={true}
                tags={field.input.value}
            />
        );
    },
    renderTagsInputField: function (field) {
        return (
            <div className={"tags-wrp form-group col-xs-12"} style={{marginBottom: "15px"}}>
                <TagsInput
                    addOnBlur={true}
                    renderInput={this.renderTagInput}
                    onChange={field.input.onChange}
                    value={field.input.value || field.input.initialValue}
                />
            </div>
        );
    },
    render: function () {
        const {
            resetForm,
            handleSubmit
        } = this.props;
        const theme = this.getTheme();
        // TODO try to see if redux-form change is avoidable
        return (
            <FullscreenModal
                backgroundColor={theme.colors.backgroundModal}
                onConfirm={handleSubmit(this.saveForm)}
                onHide={this.props.closeForm}
                onReset={resetForm}
                renderConfirmButton={true}
                show={this.props.showFullscreenModal}
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
                        {this.props.title}
                    </h3>
                    <Col md={6}>
                        <Field
                            name="name"
                            label="Nome"
                            component={this.renderInputTextField}
                        />
                        <Field
                            name="description"
                            label="Descrizione"
                            component={this.renderTextAreaField}
                        />
                    </Col>
                    <Col md={6}>
                        <Field
                            name="unitOfMeasurement"
                            label="Unità di misura"
                            component={this.renderSelectInputField}
                        />
                        <Field
                            name="siteId"
                            label="Referenza sito"
                            component={this.renderInputTextField}
                        />
                        <Field
                            name="userId"
                            label="Referenza cliente"
                            component={this.renderInputTextField}
                        />
                        <Field
                            name="primaryTags"
                            component={this.renderTagListField}
                        />
                        <Field
                            name="tags"
                            component={this.renderTagsInputField}
                        />
                    </Col>
                    {hasRole(this.props.asteroid, VIEW_FORMULA_DETAILS) ? this.renderSensorAggregation() : null}
                    <div style={{clear: "both", height: "20px"}}></div>
                </form>
            </FullscreenModal>
        );
    }
});

module.exports = reduxForm({form: "sensor", validate})(SensorForm);
