import React, {PropTypes} from "react";
import {Col, Input} from "react-bootstrap";
import IPropTypes from "react-immutable-proptypes";
import Select from "react-select";
import Radium from "radium";
import TagsInput from "react-tagsinput";
import {reduxForm} from "redux-form";

import {FullscreenModal, SensorAggregator} from "components";

import {potentialUnitsOfMeasurement} from "lib/sensors-utils";
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

export const fields = ["name", "description", "unitOfMeasurement", "siteRef", "clientRef", "tags"];

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
        allSensors: IPropTypes.map,
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
                    allSensors={this.props.allSensors}
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
                backgroundColor={theme.colors.backgroundModal}
                onConfirm={handleSubmit(this.saveForm)}
                onHide={this.props.closeForm}
                onReset={resetForm}
                renderConfirmButton={true}
                show={this.props.showFullscreenModal}
            >
                <form
                    style={{
                        margin: "0 15% 0 15%",
                        border: "1px solid " + theme.colors.borderContentModal,
                        borderRadius: "20px",
                        minHeight: "600px",
                        height: "auto !important",
                        maxHeight: "auto !important",
                        backgroundColor: theme.colors.backgroundContentModal
                    }}
                >
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
                        <div className={"form-group" + (name.touched && name.error ? " has-error" : "")}>
                            <div className={"col-xs-" + (name.touched && name.error ? "9" : "12")}>
                                <Input
                                    type="text"
                                    className="form-control" placeholder="Nome" style={styles(theme).inputLine}
                                    {...name}
                                />
                            </div>
                            {name.touched && name.error && <div className="col-xs-3 help-block">{name.error}</div>}
                        </div>
                        <div className={"form-group" + (description.touched && description.error ? " has-error" : "")}>
                            <div className={"col-xs-" + (description.touched && description.error ? "9" : "12")}>
                                <textarea
                                    className="form-control"
                                    placeholder="Descrizione"
                                    style={{...styles(theme).inputLine,
                                        resize: "vertical",
                                        margin: "0",
                                        padding: "5px 10px",
                                        minHeight: "35px",
                                        height: "auto !important"
                                    }}
                                    {...description}
                                />
                            </div>
                            {description.touched && description.error && <div className="col-xs-3 help-block">{description.error}</div>}
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className={"form-group" + (unitOfMeasurement.touched && unitOfMeasurement.error ? " has-error" : "")}>
                            <div
                                className={"col-xs-" + (unitOfMeasurement.touched && unitOfMeasurement.error ? "9" : "12")}
                                style={{marginBottom: "25px"}}
                            >
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
                            {unitOfMeasurement.touched && unitOfMeasurement.error &&
                                <div className="col-xs-3 help-block">{unitOfMeasurement.error}</div>
                            }
                        </div>
                        <div className={"form-group col-xs-12"}>
                            <Input type="text" className="form-control" placeholder="Referenza sito" style={styles(theme).inputLine}
                                {...siteRef}
                            />
                        </div>
                        <div className={"form-group col-xs-12"}>
                            <Input type="text" className="form-control" placeholder="Referenza cliente" style={styles(theme).inputLine}
                                {...clientRef}
                            />
                        </div>
                        <div className={"tags-wrp form-group col-xs-12"}>
                            <Radium.Style
                                rules={{
                                    ".react-tagsinput": {
                                        fontSize: "20px",
                                        overflow: "hidden",
                                        paddingLeft: "5px",
                                        paddingTop: "5px"
                                    },
                                    ".react-tagsinput-tag": {
                                        backgroundColor: theme.colors.transparent,
                                        borderRadius: "20px",
                                        border: "1px solid " + theme.colors.mainFontColor,
                                        color: theme.colors.mainFontColor,
                                        display: "inline-block",
                                        fontSize: "16px",
                                        fontWeight: "300",
                                        marginBottom: "5px",
                                        marginRight: "5px",
                                        padding: "3px 5px"
                                    },
                                    ".react-tagsinput-remove": {
                                        cursor: "pointer"
                                    },
                                    ".react-tagsinput-tag a::before": {
                                        content: " ×",
                                        color: theme.colors.mainFontColor
                                    },
                                    ".react-tagsinput-tag a:hover": {
                                        textDecoration: "none"
                                    },
                                    ".react-tagsinput-input": {
                                        background: "transparent",
                                        border: "0px",
                                        color: theme.colors.mainFontColor,
                                        fontSize: "16px",
                                        fontWeight: "300",
                                        marginBottom: "6px",
                                        marginTop: "1px",
                                        outline: "none",
                                        padding: "5px",
                                        width: "80px"
                                    }
                                }}
                                scopeSelector={".tags-wrp"}
                            />
                            <TagsInput
                                addOnBlur={true}
                                renderInput={this.renderTagInput}
                                onChange={tags.onChange}
                                value={tags.value || tags.initialValue}
                            />
                        </div>
                    </Col>
                    {this.renderSensorAggregation()}
                    <div style={{clear: "both", height: "20px"}}></div>
                </form>
            </FullscreenModal>
        );
    }
});

module.exports = reduxForm({form: "sensor", fields, validate})(SensorForm);
