import React, {PropTypes} from "react";
import {Col, Input} from "react-bootstrap";
import Select from "react-select";
import TagsInput from "react-tagsinput";
import {reduxForm} from "redux-form";

import {FullscreenModal, SensorAggregator} from "components";

import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

export const fields = ["name", "description", "unitOfMeasurement", "siteRef", "clientRef", "tags"];

const potentialUnitsOfMeasurement = [
    {value: 1, label: "Celsius"},
    {value: 2, label: "Fahrenheit"},
    {value: 3, label: "Watt"}
];

const validate = values => {
    const errors = {};
    if (!values.name) {
        errors.name = "Required";
    } else if (values.name.length < 5) {
        errors.name = "Must be 5 characters or more";
    }
    if (!values.description) {
        errors.description = "Required";
    }
    if (!values.unitOfMeasurement) {
        errors.unitOfMeasurement = "Required";
    }
    return errors;
};

var SensorForm = React.createClass({
    propTypes: {
        addItemToFormula: PropTypes.func.isRequired,
        closeForm: PropTypes.func.isRequired,
        currentSensor: PropTypes.object,
        fields: PropTypes.object.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        id: PropTypes.string,
        initialValues: PropTypes.object,
        onSave: PropTypes.func.isRequired,
        resetForm: PropTypes.func.isRequired,
        sensorsToAggregate: PropTypes.array,
        showFullscreenModal: PropTypes.bool.isRequired,
        showSensorAggregator: PropTypes.bool.isRequired,
        submitting: PropTypes.bool.isRequired,
        title: PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    saveForm: function (data) {
        this.props.onSave(data, this.props.currentSensor.formulaItems, this.props.id);
        this.props.closeForm();
    },
    renderSensorAggregation: function () {
        if (this.props.showSensorAggregator || this.props.currentSensor.formulaItems.length > 0) {
            return (
                <SensorAggregator
                    addItemToFormula={this.props.addItemToFormula}
                    formulaItems={this.props.currentSensor.formulaItems}
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
    render: function () {
        const {
            fields: {name, description, unitOfMeasurement, siteRef, clientRef, tags},
            resetForm,
            handleSubmit
        } = this.props;
        let theme = this.getTheme();
        // TODO refactor to create more field components
        return (
            <FullscreenModal
                backgroundColor={theme.colors.backgroundContentModal}
                onConfirm={handleSubmit(this.saveForm)}
                onHide={this.props.closeForm}
                onReset={resetForm}
                renderConfirmButton={true}
                show={this.props.showFullscreenModal}
            >
                <form
                    className="form-horizontal"
                    style={{
                        margin: "0 15% 0 15%",
                        padding: "10px",
                        border: "solid white 1px",
                        borderRadius: "20px",
                        minHeight: "600px"
                    }}
                >
                    <h3
                        className="text-center"
                        style={{
                            color: theme.colors.mainFontColor,
                            fontSize: "24px",
                            fontWeight: "400",
                            marginBottom: "20px",
                            textTransform: "uppercase"
                        }}
                    >
                        {this.props.title}
                    </h3>
                    <Col md={6}>
                        <div className={"form-group" + (name.touched && name.error ? " has-error" : "")}>
                            <div className={"col-xs-" + (name.touched && name.error ? "9" : "12")}>
                                <Input
                                    type="text"
                                    className="col-xs-12 form-control" placeholder="Nome" style={styles(theme).inputLine}
                                    {...name}
                                />
                            </div>
                            {name.touched && name.error && <div className="col-xs-3 help-block">{name.error}</div>}
                        </div>
                        <div className={"form-group" + (description.touched && description.error ? " has-error" : "")}>
                            <div className={"col-xs-" + (description.touched && description.error ? "9" : "12")}>
                                <textarea className="col-xs-12 form-control" placeholder="Descrizione" style={{...styles(theme).inputLine, resize: "none"}}
                                    {...description}
                                />
                            </div>
                            {description.touched && description.error && <div className="col-xs-3 help-block">{description.error}</div>}
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className={"form-group" + (unitOfMeasurement.touched && unitOfMeasurement.error ? " has-error" : "")}>
                            <div className={"col-xs-" + (unitOfMeasurement.touched && unitOfMeasurement.error ? "9" : "12")}>
                                <Select
                                    autofocus={true}
                                    className="sensor-modal-select"
                                    name="unitOfMeasurement"
                                    onChange={unitOfMeasurement.onChange}
                                    options={potentialUnitsOfMeasurement}
                                    placeholder="Unità di misura"
                                    value={unitOfMeasurement.value}
                                />
                            </div>
                            {unitOfMeasurement.touched && unitOfMeasurement.error && <div className="col-xs-3 help-block">{unitOfMeasurement.error}</div>}
                        </div>
                        <div className={"form-group col-xs-12"}>
                            <Input type="text" className="col-xs-12 form-control" placeholder="Referenza sito" style={styles(theme).inputLine}
                                {...siteRef}
                            />
                        </div>
                        <div className={"form-group col-xs-12"}>
                            <Input type="text" className="col-xs-12 form-control" placeholder="Referenza cliente" style={styles(theme).inputLine}
                                {...clientRef}
                            />
                        </div>
                        <div className={"form-group col-xs-12"}>
                            <TagsInput
                                addOnBlur={true}
                                renderInput={this.renderTagInput}
                                onChange={tags.onChange}
                                value={tags.value || tags.initialValue}
                            />
                        </div>
                    </Col>
                    {this.renderSensorAggregation()}
                </form>
            </FullscreenModal>
        );
    }
});

module.exports = reduxForm({form: "sensor", fields, validate})(SensorForm);
