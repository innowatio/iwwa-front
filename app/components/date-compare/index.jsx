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
        getKey: PropTypes.func,
        getLabel: PropTypes.func,
        onChange: PropTypes.func,
        period: PropTypes.object
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    selectedCheckboxDate: function (allowedValue) {
        console.log(allowedValue);
        this.props.onChange({
            dateOne: moment.utc().valueOf(),
            // Set the default period
            period: allowedValue
        });
    },
    renderDataCompare: function (allowedValue) {
        const active = equals(allowedValue, this.props.period);
        const theme = this.getTheme();
        return (
            <components.Button
                key={this.props.getKey(allowedValue)}
                onClick={partial(this.selectedCheckboxDate, [allowedValue])}
                style={merge(styles.buttonCompare,
                    {
                        color: active ? theme.colors.white : theme.colors.black,
                        backgroundColor: active ? theme.colors.lineReale : theme.colors.greyBackground
                    }
                )}
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
            </div>
        );
    }
});

module.exports = DateCompare;
