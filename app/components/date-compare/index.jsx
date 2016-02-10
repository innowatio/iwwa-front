import {equals, partial, merge} from "ramda";
import React, {PropTypes} from "react";
import moment from "moment";

import components from "components";
import {defaultTheme} from "lib/theme";

const styles = {
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
    contextTypes: {
        theme: PropTypes.object
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
            period: props.period || props.allowedValues[0]
        });
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    selectedCheckboxDate: function (allowedValue) {
        this.setState({
            period: allowedValue
        });
    },
    onClickButton: function () {
        this.props.closeModal();
        this.props.onChange(moment.utc().valueOf(), this.state.period, "dateCompare");
    },
    renderDataCompare: function (allowedValue) {
        const active = equals(allowedValue, this.state.period);
        const theme = this.getTheme();
        return (
            <components.Button
                key={this.props.getKey(allowedValue)}
                onClick={partial(this.selectedCheckboxDate, [allowedValue])}
                style={merge(
                    styles.buttonCompare,
                    {
                        color: active ? theme.colors.white : theme.colors.black,
                        backgroundColor: active ? theme.colors.lineReale : theme.colors.greyBackground
                    })}
                value={allowedValue}
            >
                {this.props.getLabel(allowedValue)}
            </components.Button>
        );
    },
    render: function () {
        const {colors} = this.getTheme();
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
