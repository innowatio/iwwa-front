import * as bootstrap from "react-bootstrap";
import {equals, partial, merge} from "ramda";
import React, {PropTypes} from "react";
import Radium from "radium";
import components from "components";
import {defaultTheme} from "lib/theme";
import {styles} from "lib/styles";
import moment from "lib/moment";

const stylesFunction = (theme) => ({
    buttonsWrap: {
        width: "80%",
        margin: "50px auto",
        minHeight: "300px",
        borderRadius: "20px",
        backgroundColor: theme.colors.backgroundContentModal,
        border: `1px solid ${theme.colors.borderContentModal}`,
        padding: "16px"
    }
});

var DateCompare = React.createClass({
    propTypes: {
        allowedValues: PropTypes.array.isRequired,
        getKey: PropTypes.func,
        getLabel: PropTypes.func,
        onChange: PropTypes.func,
        period: PropTypes.object,
        title: PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    selectedCheckboxDate: function (allowedValue) {
        this.props.onChange({
            dateOne: moment().valueOf(),
            // Set the default period
            period: allowedValue
        });
    },
    renderDataCompare: function (allowedValue) {
        const active = equals(allowedValue, this.props.period);
        const theme = this.getTheme();
        return (
            <bootstrap.Col
                className="button-compare"
                key={this.props.getKey(allowedValue)}
                lg={3}
                md={4}
                xs={12}
            >
                <Radium.Style
                    rules={{
                        ".btn-default": {
                            width: "100%",
                            background: theme.colors.transparent,
                            border: `1px solid ${theme.colors.borderButtonCalendar}`,
                            color: theme.colors.mainFontColor,
                            height: "40px",
                            borderRadius: "20px",
                            marginRight: "8px",
                            marginBottom: "13px",
                            boxShadow: "none"
                        },
                        ".btn-default:hover": {
                            background: theme.colors.buttonPrimary + "!important",
                            border: "none",
                            color: theme.colors.white + "!important"
                        }
                    }}
                    scopeSelector={".button-compare"}
                />
                <components.Button
                    onClick={partial(this.selectedCheckboxDate, [allowedValue])}
                    style={merge(stylesFunction(theme).buttonCompare,
                        {
                            fontWeight: "400",
                            color: active ? theme.colors.white : theme.colors.mainFontColor,
                            backgroundColor: active ? theme.colors.buttonPrimary : theme.colors.backgroundSelectButton,
                            borderColor: active ? theme.colors.transparent : theme.colors.borderSelectButton
                        }
                    )}
                    value={allowedValue}
                >
                    {this.props.getLabel(allowedValue)}
                </components.Button>
            </bootstrap.Col>
        );
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <h3 className="text-center" style={styles(theme).titleFullScreenModal}>
                    {this.props.title}
                </h3>
                <div style={stylesFunction(theme).buttonsWrap}>
                    {this.props.allowedValues.map(this.renderDataCompare)}
                </div>
            </div>
        );
    }
});

module.exports = DateCompare;
