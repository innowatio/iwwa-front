import React, {PropTypes} from "react";
import {partial, identity} from "ramda";
import Radium from "radium";
import ReactPureRender from "react-addons-pure-render-mixin";
import RadioGroup from "react-radio-group";
import get from "lodash.get";

import components from "components";
import {defaultTheme} from "lib/theme";

const styles = ({colors}) => ({
    iconFilter: {
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
    filter: {
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
        paddingLeft: "30px"
    },
    radioStyle: {
        visibility: "hidden"
    },
    confirmButtonStyle: {
        width: "auto",
        height: "45px",
        lineHeight: "45px",
        border: "0px",
        padding: "0px 20px",
        fontSize: "14px",
        backgroundColor: colors.buttonPrimary
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
    mixin: [ReactPureRender],
    onClick: function () {
        this.props.onClick(this.props.value.key);
    },
    render: function () {
        return (
            <div onClick={this.onClick} style={{padding: "2px 0px", borderBottom: "1px solid #ffffff"}} >
                <div className="radio-style">
                    <Radium.Style
                        rules={{
                            "": {
                                position: "relative",
                                clear: "both",
                                width: "28px",
                                height: "28px",
                                background: "#ffffff",
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
                                background: "#ec4882",

                                WebkitBorderRadius: "50px",
                                MozBorderRadius: "50px",
                                borderRadius: "50px",
                                top: "2px",
                                left: "2px"
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

var ButtonFilter = React.createClass({
    propTypes: {
        activeFilter: PropTypes.object.isRequired,
        collectionFiltered: PropTypes.string,
        filterList: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            filter: PropTypes.arrayOf(PropTypes.shape({
                label: PropTypes.string,
                key: PropTypes.string
            })),
            key: PropTypes.string
        })),
        labelStyle: PropTypes.object,
        onConfirm: PropTypes.func.isRequired,
        onReset: PropTypes.func
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            filter: this.getInitialSelectedValue()
        };
    },
    mixin: [ReactPureRender],
    getInitialSelectedValue: function () {
        return this.props.filterList.reduce((acc, item) => {
            return {
                ...acc,
                [item.key]: get(`this.props.activeFilter.${item.key}`) || item.filter[0].key
            };
        }, {});
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    handleChange: function (key, value) {
        this.setState({
            filter: {
                ...this.state.filter,
                [key]: value
            }
        });
    },
    onConfirmFilter: function () {
        this.props.onConfirm(this.state.filter);
    },
    renderFilterTableCell: function (Radio, filterKey, filter, index) {
        const inputRadio = <Radio value={filter.key} style={styles(this.getTheme()).radioStyle} />;
        return (
            <RadioButton
                key={index}
                label={filter.label}
                labelStyle={this.props.labelStyle || styles(this.getTheme()).labelStyle}
                onClick={partial(this.handleChange, [filterKey])}
                radioComponent={inputRadio}
                value={filter}
            />
        );
    },
    renderFilterCell: function (value) {
        const {colors} = this.getTheme();
        return (
            <div key={value.key}>
                <h5 style={{color: colors.mainFontColor, fontSize: "18px"}}>
                    {value.title}
                </h5>
                <RadioGroup
                    name={value.key}
                    selectedValue={this.state.filter[value.key]}
                    onChange={identity}
                >
                    {Radio =>(
                        <div style={{width: "260px"}}>
                            {value.filter.map(partial(this.renderFilterTableCell, [Radio, value.key]))}
                        </div>
                    )}
                </RadioGroup>
            </div>
        );
    },
    renderFilter: function () {
        return (
            <div style={styles(this.getTheme()).filter}>
                {this.props.filterList.map(this.renderFilterCell)}
                <components.ButtonConfirmAndReset
                    confirmButtonStyle={styles(this.getTheme()).confirmButtonStyle}
                    labelConfirmButton={"APPLICA FILTRI"}
                    onConfirm={this.onConfirmFilter}
                    onReset={this.props.onReset}
                />
            </div>
        );
    },
    renderTitlePopover: function () {
        const {colors} = this.getTheme();
        return (
            <span style={styles(this.getTheme()).titleButtonPopover}>
                <components.Icon
                    color={colors.iconFilter}
                    icon={"filter"}
                    size={"38px"}
                    style={styles(this.getTheme()).iconFilter}
                />
            </span>
        );
    },
    render: function () {
        return (
            <div style={{marginTop: "20px", height: "auto", marginBottom: "20px", float: "right"}}>
                <components.Popover title={this.renderTitlePopover()} >
                    {this.renderFilter()}
                </components.Popover>
            </div>
        );
    }
});

module.exports = ButtonFilter;
