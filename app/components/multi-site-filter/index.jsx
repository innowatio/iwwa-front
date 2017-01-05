import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";
import * as bootstrap from "react-bootstrap";
import R from "ramda";
import {Collapse} from "antd";
import moment from "moment";
import Radium from "radium";

import {
    Icon,
    OptionsFilter,
    ButtonConfirmAndReset,
    Popover,
    RangeFilter,
    ValueFilter
} from "components";
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
        margin: "5px 10px",
        borderRadius: "100%",
        lineHeight: "4",
        backgroundColor: colors.secondary
    },
    filter: {
        overflow: "auto",
        margin: "0px",
        border: "1px solid " + colors.borderDropdown,
        backgroundColor: colors.backgroundDropdown,
        borderRadius: "6px",
        color: colors.mainFontColor,
        outline: "none",
        fontSize: "15px",
        paddingBottom: "10px"
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
        backgroundColor: colors.buttonPrimary,
        color: colors.white
    }
});

var MultiSiteFilter = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collectionFiltered: PropTypes.string,
        collections: React.PropTypes.any,
        filterList: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.string,
            options: PropTypes.arrayOf(PropTypes.shape({
                label: PropTypes.string,
                key: PropTypes.any
            })),
            filterFunc: PropTypes.func,
            selectedValue: PropTypes.any,
            filterType: PropTypes.string
        })),
        onConfirm: PropTypes.func.isRequired,
        onReset: PropTypes.func
    },
    contextTypes: {
        theme: PropTypes.object
    },

    getInitialState: function () {
        return {
            filterList: this.props.filterList
        };
    },

    mixin: [ReactPureRender],
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },

    getfilter: function (filterType, selectedValue, value) {
        switch (filterType) {
            case "range":
                if (R.sum(selectedValue)==0) {
                    return true;
                }
                return value >= selectedValue[0] && value <= selectedValue[1];
            case "optionsTime":
                if (!selectedValue) {
                    return true;
                }
                return moment().diff(moment(value), "days") <= selectedValue;
            case "number":
                if (selectedValue < 1) {
                    return true;
                }
                return parseInt(value)==parseInt(selectedValue);
            case "options":
                if (selectedValue==null) {
                    return true;
                }
                return value == selectedValue;
        }
        if (!selectedValue) {
            return true;
        }
        const input = selectedValue.trim().toLowerCase();
        return value.toLowerCase().includes(input);
    },

    onConfirmFilter: function () {
        const filterList = this.state.filterList;
        var fn;
        filterList.map(item => {
            const {id, selectedValue, isAttribute, filterType} = item;
            if (isAttribute) {
                fn = (x) => {
                    const filtered = x["attributes"].filter(att => {
                        return att.id==id;
                    })[0];
                    if (!filtered) {
                        return true;
                    }
                    return this.getfilter(filterType, selectedValue, filtered.value);
                };
            } else {
                fn = (x) => {
                    return this.getfilter(filterType, selectedValue, x[id]);
                };
            }
            item.filterFunc = fn;
        });
        this.props.onConfirm(filterList);
    },

    onChangeFilter: function (filter) {
        const {id, selectedValue} = filter;
        var newState = this.props.filterList.map(item => {
            if (item.id ==id) {
                item.selectedValue = selectedValue;
            }
            return item;
        });
        this.setState({filterList: newState});
    },

    renderFilterByType: function (value) {
        switch (value.filterType) {
            case "options":
            case "optionsTime":
                return (
                    <OptionsFilter filter={value} onChange={this.onChangeFilter}/>
                );
            case "range":
                return (
                    <RangeFilter filter={value} onChange={this.onChangeFilter}/>
                );
            default:
                return (
                    <ValueFilter filter={value} onChange={this.onChangeFilter}/>
                );
        }
    },

    renderHeader: function (value) {
        const {label} = value;
        return (
            <span>{label}</span>
        );
    },

    renderAccordion: function (value) {
        const {colors} = this.getTheme();
        const {id} = value;
        return (
            <Collapse accordion={true} key={id} style={{
                backgroundColor: colors.transparent,
                marginBottom: "0px",
                border: "0px",
                borderRadius: "0px",
                borderBottom: "1px solid " + colors.white
            }}>
                <Collapse.Panel header={this.renderHeader(value)} key={id}>
                    {this.renderFilterByType(value)}
                </Collapse.Panel>
            </Collapse>
        );
    },

    renderFilter: function () {
        const {colors} = this.getTheme();
        return (
            <div style={styles(this.getTheme()).filter}>
                <bootstrap.FormGroup className="collapsible-filter">
                    <Radium.Style
                        rules={{
                            ".ant-collapse": {
                                padding: "0px"
                            },
                            ".ant-radio-group label": {
                                width: "100% !important",
                                display: "inline-block"
                            },
                            ".ant-collapse > .ant-collapse-item > .ant-collapse-header": {
                                color: colors.white,
                                fontSize: "16px",
                                fontWeight: "300",
                                padding: "0px 30px 0px 10px",
                                height: "44px",
                                lineHeight: "44px"
                            },
                            ".ant-collapse > .ant-collapse-item > .ant-collapse-header .arrow": {
                                color: colors.white,
                                fontSize: "20px !important",
                                left: "85%",
                                width: "35px",
                                height: "auto",
                                lineHeight: "44px"
                            },
                            ".ant-collapse-content": {
                                backgroundColor: colors.transparent,
                                color: colors.white,
                                fontSize: "14px",
                                fontWeight: "300"
                            },
                            ".ant-radio-wrapper": {
                                fontSize: "14px",
                                fontWeight: "300"
                            },
                            ".ant-collapse-item:last-child > .ant-collapse-content": {
                                borderRadius: "0px"
                            },
                            ".ant-radio-wrapper:hover .ant-radio .ant-radio-inner, .ant-radio:hover .ant-radio-inner, .ant-radio-focused .ant-radio-inner": {
                                borderColor: colors.buttonPrimary
                            },
                            ".ant-radio-checked .ant-radio-inner": {
                                borderColor: colors.buttonPrimary
                            },
                            ".ant-radio-inner": {
                                width: "20px",
                                height: "20px"
                            },
                            ".ant-radio-inner:after": {
                                backgroundColor: colors.buttonPrimary,
                                left: "4px",
                                top: "4px",
                                width: "10px",
                                height: "10px",
                                borderRadius: "8px"
                            },
                            ".ant-collapse-content > .ant-collapse-content-box": {
                                paddingTop: "0px"
                            },
                            "input.form-control": {
                                backgroundColor: colors.transparent,
                                border: "0px",
                                borderBottom: "1px solid " + colors.white,
                                color: colors.secondary,
                                padding: "0px",
                                borderRadius: "0px"
                            },
                            "input.form-control:focus": {
                                boxShadow: "none",
                                WebkitBoxShadow: "none"
                            }
                            // "input[type='number']": {
                            //     border: "0px !important"
                            // }
                        }}
                        scopeSelector={".collapsible-filter"}
                    />
                    {this.props.filterList.map(this.renderAccordion)}
                </bootstrap.FormGroup>
                <ButtonConfirmAndReset
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
                <Icon
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
            <div style={{height: "auto", float: "right", position: "relative"}}>
                <Popover title={this.renderTitlePopover()}>
                    {this.renderFilter()}
                </Popover>
            </div>
        );
    }
});

module.exports = MultiSiteFilter;
