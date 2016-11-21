import React, {PropTypes} from "react";
import {
    FormControl,
    FormGroup,
    InputGroup
} from "react-bootstrap";

import {
    Icon
} from "components";

var SearchFilter = React.createClass({
    propTypes: {
        onSubmit: PropTypes.func.isRequired,
        placeholder: PropTypes.string.isRequired
    },
    getInitialState: function () {
        return {
            value: ""
        };
    },
    render: function () {
        const {placeholder, onSubmit} = this.props;
        return (
            <FormGroup>
                <InputGroup>
                    <FormControl
                        className="input-search"
                        onChange={(event) => {
                            this.setState({
                                value: event.target.value
                            });
                        }}
                        type="text"
                        value={this.state.value}
                        placeholder={placeholder}
                    />
                    <InputGroup.Addon>
                        <Icon
                            color={"white"}
                            icon={"search"}
                            onClick={() => {
                                if (this.state.value) {
                                    onSubmit(this.state.value);
                                    this.setState({
                                        value: ""
                                    });
                                }
                            }}
                            size={"34px"}
                        />
                    </InputGroup.Addon>
                </InputGroup>
            </FormGroup>
        );
    }
});

module.exports = SearchFilter;
