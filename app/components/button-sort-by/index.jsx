import React, {PropTypes} from "react";
import {partial, identity} from "ramda";
import Radium from "radium";
import ReactPureRender from "react-addons-pure-render-mixin";
import RadioGroup from "react-radio-group";
// import get from "lodash.get";

import components from "components";
import {defaultTheme} from "lib/theme";

const styles = ({colors}) => ({
    iconSortBy: {
        verticalAlign: "middle",
        lineHeight: "20px",
        textAlign: "center"
    },
    titleButtonPopover: {
        display: "inline-block",
        width: "50px",
        height: "50px",
        borderRadius: "100%",
        lineHeight: "4",
        backgroundColor: colors.secondary
    },
    sortBy: {
        overflow: "auto",
        margin: "0px",
        border: "1px solid " + colors.borderDropdown,
        backgroundColor: colors.backgroundDropdown,
        borderRadius: "10px",
        color: colors.mainFontColor,
        outline: "none",
        fontSize: "15px",
        padding: "15px 10px"
    },
    labelStyle: {
        marginBottom: "0px",
        fontWeight: "300",
        cursor: "pointer",
        paddingLeft: "30px",
        color: colors.mainFontColor
    },
    radioStyle: {
        visibility: "hidden"
    }
});

var RadioButton = React.createClass({
    propTypes: {
        label: PropTypes.string,
        labelStyle: PropTypes.object,
        onClick: PropTypes.func,
        radioComponent: PropTypes.element.isRequired,
        value: PropTypes.object
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    mixin: [ReactPureRender],
    onClick: function () {
        this.props.onClick(this.props.value.key);
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        const {colors} = this.getTheme();
        return (
            /*
            *
                We need to styling to the radio button, so we hide the input radio and
                we use the label to graphicate it using CSS.
            *
            */
            <div onClick={this.onClick} style={{
                padding: "2px 0px",
                borderBottom: "1px solid " + colors.borderDropdown
            }}>
                <div className="radio-style">
                    <Radium.Style
                        rules={{
                            "": {
                                position: "relative",
                                clear: "both",
                                width: "28px",
                                height: "28px",
                                background: colors.radioButtonBackground,
                                border: "1px solid " + colors.radioButtonBorder,
                                margin: "5px 0px",
                                WebkitBorderRadius: "50px",
                                MozBorderRadius: "50px",
                                borderRadius: "50px"
                            },
                            "input[type='radio'] + label span": {
                                width: "300px"
                            },
                            "input[type='radio'] + label": {
                                cursor: "pointer",
                                position: "absolute",
                                width: "20px",
                                height: "20px",
                                backgroundColor: colors.buttonPrimary,

                                WebkitBorderRadius: "50px",
                                MozBorderRadius: "50px",
                                borderRadius: "50px",
                                left: "4px",
                                top: "4px"
                            },
                            "input[type='radio'] + label:after": {
                                opacity: "0",
                                transition: "opacity 0.2s ease-in-out",
                                content: "''",
                                position: "absolute",
                                width: "16px",
                                height: "16px",
                                backgroundColor: colors.buttonPrimary,

                                WebkitBorderRadius: "50px",
                                MozBorderRadius: "50px",
                                borderRadius: "50px",
                                top: "1px",
                                left: "1px"
                            },
                            "input[type='radio']:checked + label:after, input[type='radio'] + label:hover::after": {
                                opacity: "1"
                            }
                        }}
                        scopeSelector=".radio-style"
                    />
                    {this.props.radioComponent}
                    <label style={this.props.labelStyle}>
                        <div style={{width:"200px"}}>{this.props.label}</div>
                    </label>
                </div>
            </div>
        );
    }
});

var ButtonSortBy = React.createClass({
    propTypes: {
        activeSortBy: PropTypes.object,
        labelStyle: PropTypes.object,
        sortByList: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            sortBy: PropTypes.arrayOf(PropTypes.shape({
                label: PropTypes.string,
                key: PropTypes.string
            })),
            key: PropTypes.string
        }))
    },
    contextTypes: {
        theme: PropTypes.object
    },
    // getInitialState: function () {
    //     return {
    //         sortBy: this.getInitialSelectedValue()
    //     };
    // },
    // mixin: [ReactPureRender],
    // getInitialSelectedValue: function () {
    //     return this.props.sortByList.reduce((acc, item) => {
    //         return {
    //             ...acc,
    //             [item.key]: get(`this.props.activeSortBy.${item.key}`) || item.sortBy[0].key
    //         };
    //     }, {});
    // },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    // handleChange: function (key, value) {
    //     this.setState({
    //         sortBy: {
    //             ...this.state.sortBy,
    //             [key]: value
    //         }
    //     });
    // },
    renderSortByTableCell: function (Radio, sortByKey, sortBy, index) {
        const inputRadio = <Radio value={sortBy.key} style={styles(this.getTheme()).radioStyle} />;
        return (
            <RadioButton
                key={index}
                label={sortBy.label}
                labelStyle={this.props.labelStyle || styles(this.getTheme()).labelStyle}
                onClick={partial(this.handleChange, [sortByKey])}
                radioComponent={inputRadio}
                value={sortBy.key}
            />
        );
    },
    renderSortByCell: function (value) {
        return (
            <div key={value.key}>
                <RadioGroup
                    name={value.key}
                    selectedValue={this.state.sortBy[value.key]}
                    onChange={identity}
                >
                    {Radio =>(
                        <div style={{width: "260px"}}>
                            {value.sortBy.map(partial(this.renderSortByTableCell, [Radio, value.key]))}
                        </div>
                    )}
                </RadioGroup>
            </div>
        );
    },
    renderSortBy: function () {
        return (
            <div style={styles(this.getTheme()).sortBy}>
                {this.props.sortByList.map(this.renderSortByCell)}
            </div>
        );
    },
    renderTitlePopover: function () {
        const {colors} = this.getTheme();
        return (
            <span style={styles(this.getTheme()).titleButtonPopover}>
                <components.Icon
                    color={colors.iconSortBy}
                    icon={"sort-by"}
                    size={"32px"}
                    style={styles(this.getTheme()).iconSortBy}
                />
            </span>
        );
    },
    render: function () {
        return (
            <div style={{height: "auto", float: "right"}}>
                <components.Popover title={this.renderTitlePopover()}>
                    <div style={styles(this.getTheme()).sortBy}>
                        {"Ordina per:"}
                    </div>
                </components.Popover>
            </div>
        );
    }
});

module.exports = ButtonSortBy;
