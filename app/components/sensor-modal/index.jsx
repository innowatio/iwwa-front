import React, {PropTypes} from "react";
import {Col} from "react-bootstrap";
import TagsInput from "react-tagsinput";
import {reduxForm} from "redux-form";
import {FullscreenModal, ObjectSelect} from "components";
import {defaultTheme} from "lib/theme";

export const fields = ["name", "description", "unitOfMeasurement", "siteRef", "clientRef", "tags"];

const potentialUnitsOfMeasurement = [
    {id: null, label: "-Choose the unit of measurement-"},
    {id: 1, label: "Celsius"},
    {id: 2, label: "Fahrenheit"},
    {id: 3, label: "Watt"}
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
        this.props.onSave(data, this.props.id);
        this.props.closeForm();
    },
    render () {
        const {
            fields: {name, description, unitOfMeasurement, siteRef, clientRef, tags},
            resetForm,
            handleSubmit
        } = this.props;
        let theme = this.getTheme();

        // TODO fix tags component
        tags.value = tags.value ? tags.value : [];

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
                <form className="form-horizontal" style={{margin: "0 15% 0 15%", padding: "10px", border: "solid white 1px", borderRadius: "20px", minHeight: "350px"}}>
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
                    </Col>
                    <Col md={6}>
                        <div className={"form-group" + (unitOfMeasurement.touched && unitOfMeasurement.error ? " has-error" : "")}>
                            <label className="col-xs-4 control-label">
                                {"Unit of measurement"}
                            </label>
                            <div className={"col-xs-" + (unitOfMeasurement.touched && unitOfMeasurement.error ? "5" : "8")}>
                                <ObjectSelect options={potentialUnitsOfMeasurement} {...unitOfMeasurement}/>
                            </div>
                            {unitOfMeasurement.touched && unitOfMeasurement.error && <div className="col-xs-3 help-block">{unitOfMeasurement.error}</div>}
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
                    </Col>
                </form>
            </FullscreenModal>
        );
    }
});

module.exports = reduxForm({form: "sensor", fields, validate})(SensorForm);