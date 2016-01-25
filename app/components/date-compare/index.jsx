import {equals, partial} from "ramda";
import React, {PropTypes} from "react";
import moment from "moment";

import * as colors from "lib/colors";
import * as components from "components";

var styles = {
    buttonCompare: {
        width: "200px",
        height: "40px",
        marginRight: "8px",
        marginBottom: "13px"
    }
};

var DateCompare = React.createClass({
    propTypes: {
        allowedValues: PropTypes.array.isRequired,
        closeModal: PropTypes.func,
        getKey: PropTypes.func,
        getLabel: PropTypes.func,
        onChange: PropTypes.func,
        period: PropTypes.object
    },
    getInitialState: function () {
        return {
            period: this.props.period || this.props.allowedValues[0]
        };
    },
    componentWillReceiveProps: function (props) {
        return this.getStateFromProps(props);
    },
    getStateFromProps: function (props) {
        this.setState({
            period: props.period || this.props.allowedValues[0]
        });
    },
    selectedCheckboxDate: function (allowedValue) {
        this.setState({
            period: allowedValue
        });
    },
    onClickButton: function () {
        this.props.closeModal();
        this.props.onChange(moment().valueOf(), this.state.period, "dateCompare");
    },
    renderDataCompare: function (allowedValue) {
        return (
            <components.Button
                active={equals(allowedValue, this.state.period)}
                key={this.props.getKey(allowedValue)}
                onClick={partial(this.selectedCheckboxDate, [allowedValue])}
                style={styles.buttonCompare}
                value={allowedValue}
            >
                {this.props.getLabel(allowedValue)}
            </components.Button>
        );
    },
    render: function () {
        return (
            <div>
                {this.props.allowedValues.map(this.renderDataCompare)}
                <components.Button
                    onClick={this.onClickButton}
                    style={{
                        background: colors.primary,
                        marginTop: "60px",
                        color: colors.white,
                        width: "230px",
                        height: "45px"
                    }}
                >
                    {"CONFERMA"}
                </components.Button>
            </div>
        );
    }
});

module.exports = DateCompare;
