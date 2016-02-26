import React from "react";
import Icon from "components/icon";
import TagsInput from "react-tagsinput";
import {reduxForm} from "redux-form";
import {ObjectSelect} from "components";

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
        fields: React.PropTypes.object.isRequired,
        handleSubmit: React.PropTypes.func.isRequired,
        id: React.PropTypes.number,
        initialValues: React.PropTypes.object.isRequired,
        navigateTo: React.PropTypes.func.isRequired,
        onSave: React.PropTypes.func.isRequired,
        resetForm: React.PropTypes.func.isRequired,
        submitting: React.PropTypes.bool.isRequired
    },

    saveForm: function (data) {
        this.props.onSave(data, this.props.id);
        this.props.navigateTo("/");
    },

    render () {
        const {
            fields: {name, description, unitOfMeasurement, aggregationType, siteRef, clientRef, tags, alarmDelay},
            resetForm,
            handleSubmit,
            submitting
        } = this.props;

        console.log(tags);
        // TODO fix tags component
        tags.value = tags.value ? tags.value : [];

        // TODO refactor to create more field components

        return (
            <form className="form-horizontal" onSubmit={handleSubmit(this.saveForm)}>
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
                <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-lg" style={{margin: 10}} disabled={submitting}>
                        {submitting ? <Icon className="fa fa-cog fa-spin"/> : <Icon className="fa fa-paper-plane"/>} {"Submit"}
                    </button>
                    <button type="button" className="btn btn-default btn-lg" style={{margin: 10}} disabled={submitting}
                        onClick={resetForm}
                    >
                        {"Clear Values"}
                    </button>
                </div>
            </form>
        );
    }
});

export default reduxForm({form: "sensor", fields, validate})(SensorForm);