import React, {PropTypes} from "react";
import {partial} from "ramda";
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
    titlePopoverStyle: {
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
        fontWeight: "300"
    },
    labelStyle: {
        width: "100%",
        marginBottom: "0px",
        cursor: "pointer"
    },
    confirmButtonStyle: {
        width: "50%",
        backgroundColor: colors.buttonPrimary
    }
});

var RadioButton = React.createClass({
    propTypes: {
        label: PropTypes.string,
        labelStyle: PropTypes.object,
        radioComponent: PropTypes.element.isRequired
    },
    mixin: [ReactPureRender],
    render: function () {
        return (
            <label style={this.props.labelStyle}>
                {this.props.radioComponent}
                {this.props.label}
            </label>
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
        onConfirm: PropTypes.func.isRequired
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
                [key]: value
            }
        });
    },
    onConfirmFilter: function () {
        this.props.onConfirm(this.state.filter);
    },
    renderFilterTableCell: function (Radio, filter, index) {
        const inputRadio = <Radio value={filter.key} />;
        return (
            <RadioButton
                key={index}
                label={filter.label}
                labelStyle={this.props.labelStyle || styles(this.getTheme()).labelStyle}
                radioComponent={inputRadio}
            />
        );
    },
    renderFilterCell: function (value) {
        const {colors} = this.getTheme();
        return (
            <div key={value.key}>
                <h5 style={{color: colors.mainFontColor}}>
                    {value.title}
                </h5>
                <RadioGroup
                    name={value.key}
                    selectedValue={this.state.filter[value.key]}
                    onChange={partial(this.handleChange, [value.key])}
                >
                    {Radio =>(
                        <div>
                            {value.filter.map(partial(this.renderFilterTableCell, [Radio]))}
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
                />
            </div>
        );
    },
    renderTitlePopover: function () {
        const {colors} = this.getTheme();
        return (
            <span style={styles(this.getTheme()).titlePopoverStyle}>
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
