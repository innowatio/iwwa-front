import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";
import * as bootstrap from "react-bootstrap";
import R from "ramda";
import {Collapse} from "antd";
import moment from "moment";

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

    renderAccordion: function (value) {
        const {id, label} = value;
        return (
            <Collapse accordion={true} key={id}>
                <Collapse.Panel header={label} key={id}>
                    <div>{this.renderFilterByType(value)}</div>
                </Collapse.Panel>
            </Collapse>
        );
    },

    renderFilter: function () {
        return (
            <div style={styles(this.getTheme()).filter}>
                <bootstrap.FormGroup>
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
            <div style={{height: "auto", float: "right"}}>
                <Popover title={this.renderTitlePopover()} >
                    {this.renderFilter()}
                </Popover>
            </div>
        );
    }
});

module.exports = MultiSiteFilter;
