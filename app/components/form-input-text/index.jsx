import React, {PropTypes} from "react";
import {FormControl} from "react-bootstrap";

var FormInputText = React.createClass({
    propTypes: {
        field: PropTypes.object.isRequired,
        placeholder: PropTypes.string,
        style: PropTypes.object
    },
    render: function () {
        return (
            <FormControl
                type="text"
                className="form-control"
                placeholder={this.props.placeholder}
                style={this.props.style}
                {...this.props.field}
            />
        );
    }
});

module.exports = FormInputText;