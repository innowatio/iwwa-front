import React, {PropTypes} from "react";
import {Col, Input} from "react-bootstrap";
import IPropTypes from "react-immutable-proptypes";
import Select from "react-select";
import Radium from "radium";
import R from "ramda";
import TagsInput from "react-tagsinput";
import {reduxForm} from "redux-form";

import {FullscreenModal, SensorAggregator} from "components";

import {potentialUnitsOfMeasurement} from "lib/sensors-utils";
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

export const fields = ["name", "description", "unitOfMeasurement", "siteId", "userId", "tags"];

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
        currentSensor: IPropTypes.map,
        fields: PropTypes.object.isRequired,
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
        return [
            {type: "add", key: "plus"},
            {type: "minus", key: "minus"},
            {type: "delete", key: "multiply"},
            {type: "divide", key: "divide"}
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
        if (this.props.showSensorAggregator || this.props.sensorState.formulaItems.length > 0) {
            return (
                <SensorAggregator
                    allSensors={this.props.allSensors}
                    addItemToFormula={this.props.addItemToFormula}
                    formulaItems={this.props.sensorState.formulaItems}
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
    render: function () {
        const {
            fields: {name, description, unitOfMeasurement, siteId, userId, tags},
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
                        <div className={"form-group" + (name.touched && name.error ? " has-error" : "")} style={{marginBottom: "15px", padding:"1px"}}>
                            <div className={"col-xs-12"}>
                                <Input
                                    type="text"
                                    className="form-control" placeholder="Nome"
                                    style={R.merge(styles(theme).inputLine, {color: theme.colors.buttonPrimary})}
                                    {...name}
                                />
                            </div>
                            {name.touched && name.error && <div className="col-xs-12 help-block">{name.error}</div>}
                        </div>
                        <div className={"form-group" + (description.touched && description.error ? " has-error" : "")}>
                            <div className={"col-xs-12"}>
                                <label style={{
                                    width: "100%",
                                    color: theme.colors.textGrey,
                                    fontSize: "16px",
                                    fontWeight: "300",
                                    marginTop: "10px"
                                }}
                                >
                                    {"Descrizione"}
                                </label>
                                <textarea
                                    className="form-control"
                                    style={{...styles(theme).inputLine,
                                        resize: "none",
                                        margin: "0",
                                        padding: "5px 0px",
                                        height: "133px"
                                    }}
                                    {...description}
                                />
                            </div>
                            {description.touched && description.error && <div className="col-xs-12 help-block">{description.error}</div>}
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className={"form-group" + (unitOfMeasurement.touched && unitOfMeasurement.error ? " has-error" : "")}>
                            <div
                                className={"col-xs-12"}
                                style={{marginBottom: "20px"}}
                            >
                                <Radium.Style
                                    rules={styles(theme).sensorModalSelect}
                                    scopeSelector=".sensor-modal-select"
                                />
                                <Select
                                    autofocus={true}
                                    className="sensor-modal-select"
                                    name="unitOfMeasurement"
                                    onChange={unitOfMeasurement.onChange}
                                    options={potentialUnitsOfMeasurement}
                                    placeholder="Unità di misura"
                                    value={unitOfMeasurement.value}
                                />
                                {unitOfMeasurement.touched && unitOfMeasurement.error &&
                                    <div className="col-xs-12 help-block">{unitOfMeasurement.error}</div>
                                }
                            </div>

                        </div>
                        <div className={"form-group col-xs-12"} style={{marginBottom: "20px"}}>
                            <Input type="text" className="form-control" placeholder="Referenza sito" style={styles(theme).inputLine}
                                {...siteId}
                            />
                        </div>
                        <div className={"form-group col-xs-12"} style={{marginBottom: "20px"}}>
                            <Input type="text" className="form-control" placeholder="Referenza cliente" style={styles(theme).inputLine}
                                {...userId}
                            />
                        </div>
                        <div className={"tags-wrp form-group col-xs-12"} style={{marginBottom: "15px"}}>
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
