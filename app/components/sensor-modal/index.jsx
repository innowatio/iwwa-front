import React, {PropTypes} from "react";
import TagsInput from "react-tagsinput";
import {reduxForm} from "redux-form";
import {FullscreenModal, ObjectSelect} from "components";
import {defaultTheme} from "lib/theme";

export const fields = ["name", "description", "unitOfMeasurement", "aggregationType", "siteRef", "clientRef", "tags", "alarmDelay"];

const potentialUnitsOfMeasurement = [
    {id: null, label: "-Choose the unit of measurement-"},
    {id: 1, label: "Celsius"},
    {id: 2, label: "Fahrenheit"},
    {id: 3, label: "Watt"}
];

const potentialAggregationTypes = [
    {id: null, label: "-Choose the aggregation type-"},
    {id: 1, label: "average"},
    {id: 2, label: "last"},
    {id: 3, label: "sum"},
    {id: 4, label: "occurences"}
];

const potentialAlarmDelays = [
    {id: null, label: "-Choose the alarm delay-"},
    {id: 1, label: "1 hour"},
    {id: 2, label: "2 hours"},
    {id: 3, label: "4 hours"},
    {id: 4, label: "8 hours"}
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
    if (!values.unitOfMeasurement || !values.unitOfMeasurement.id) {
        errors.unitOfMeasurement = "Required";
    }
    if (!values.aggregationType || !values.aggregationType.id) {
        errors.aggregationType = "Required";
    }
    return errors;
};

var SensorForm = React.createClass({
    propTypes: {
        closeForm: PropTypes.func.isRequired,
        fields: PropTypes.object.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        id: PropTypes.number,
        initialValues: PropTypes.object.isRequired,
        onSave: PropTypes.func.isRequired,
        resetForm: PropTypes.func.isRequired,
        showFullscreenModal: PropTypes.bool.isRequired,
        submitting: PropTypes.bool.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    saveForm: function (data) {
        this.props.onSave(data, this.props.id);
        this.props.closeForm();
    },
    render () {
        const {
            fields: {name, description, unitOfMeasurement, aggregationType, siteRef, clientRef, tags, alarmDelay},
            resetForm,
            handleSubmit
        } = this.props;
        let theme = this.getTheme();

        // TODO fix tags component
        tags.value = tags.value ? tags.value : [];

        // TODO refactor to create more field components

        return (
            <FullscreenModal
                backgroundColor={theme.colors.backgroundModalExport}
                onConfirm={handleSubmit(this.saveForm)}
                onHide={this.props.closeForm}
                onReset={resetForm}
                renderConfirmButton={true}
                show={this.props.showFullscreenModal}
            >
                <form className="form-horizontal">
                    <div className={"form-group" + (name.touched && name.error ? " has-error" : "")}>
                        <label className="col-xs-4 control-label">
                            {"Item name"}
                        </label>
                        <div className={"col-xs-" + (name.touched && name.error ? "5" : "8")}>
                            <input type="text" className="col-xs-8 form-control" placeholder="Insert item name" {...name}/>
                        </div>
                        {name.touched && name.error && <div className="col-xs-3 help-block">{name.error}</div>}
                    </div>
                    <div className={"form-group" + (description.touched && description.error ? " has-error" : "")}>
                        <label className="col-xs-4 control-label">
                            {"Description"}
                        </label>
                        <div className={"col-xs-" + (description.touched && description.error ? "5" : "8")}>
                            <textarea className="col-xs-8 form-control" placeholder="Insert a description" {...description}/>
                        </div>
                        {description.touched && description.error && <div className="col-xs-3 help-block">{description.error}</div>}
                    </div>
                    <div className={"form-group" + (unitOfMeasurement.touched && unitOfMeasurement.error ? " has-error" : "")}>
                        <label className="col-xs-4 control-label">
                            {"Unit of measurement"}
                        </label>
                        <div className={"col-xs-" + (unitOfMeasurement.touched && unitOfMeasurement.error ? "5" : "8")}>
                            <ObjectSelect options={potentialUnitsOfMeasurement} {...unitOfMeasurement}/>
                        </div>
                        {unitOfMeasurement.touched && unitOfMeasurement.error && <div className="col-xs-3 help-block">{unitOfMeasurement.error}</div>}
                    </div>
                    <div className={"form-group" + (aggregationType.touched && aggregationType.error ? " has-error" : "")}>
                        <label className="col-xs-4 control-label">
                            {"Aggregation type"}
                        </label>
                        <div className={"col-xs-" + (aggregationType.touched && aggregationType.error ? "5" : "8")}>
                            <ObjectSelect options={potentialAggregationTypes} {...aggregationType}/>
                        </div>
                        {aggregationType.touched && aggregationType.error && <div className="col-xs-3 help-block">{aggregationType.error}</div>}
                    </div>
                    <div className={"form-group"}>
                        <label className="col-xs-4 control-label">
                            {"Site reference"}
                        </label>
                        <div className={"col-xs-8"}>
                            <input type="text" className="col-xs-8 form-control" placeholder="Select site reference" {...siteRef}/>
                        </div>
                    </div>
                    <div className={"form-group"}>
                        <label className="col-xs-4 control-label">
                            {"Client reference"}
                        </label>
                        <div className={"col-xs-8"}>
                            <input type="text" className="col-xs-8 form-control" placeholder="Select client reference" {...clientRef}/>
                        </div>
                    </div>
                    <div className={"form-group"}>
                        <label className="col-xs-4 control-label">
                            {"Tags"}
                        </label>
                        <div className={"col-xs-8"}>
                            <TagsInput addOnBlur={true} {...tags} />
                        </div>
                    </div>
                    <div className={"form-group"}>
                        <label className="col-xs-4 control-label">
                            {"Alarm sending delay"}
                        </label>
                        <div className={"col-xs-8"}>
                            <ObjectSelect options={potentialAlarmDelays} {...alarmDelay}/>
                        </div>
                    </div>
                </form>
            </FullscreenModal>
        );
    }
});

module.exports = reduxForm({form: "sensor", fields, validate})(SensorForm);