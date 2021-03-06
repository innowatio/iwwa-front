import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";
import R from "ramda";

import {
    Icon,
    PopoverScrollable,
    DropdownSelect
} from "components";

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
        margin: "5px 10px",
        borderRadius: "100%",
        lineHeight: "4",
        backgroundColor: colors.secondary
    }
});

var ButtonSortBy = React.createClass({
    propTypes: {
        activeSortBy: PropTypes.object,
        descending: PropTypes.bool,
        labelStyle: PropTypes.object,
        onChange: PropTypes.func.isRequired,
        sortByList: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            sortBy: PropTypes.arrayOf(PropTypes.shape({
                label: PropTypes.string,
                key: PropTypes.string
            })),
            key: PropTypes.string
        })),
        sortKey: PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            sortBy: this.getInitialSelectedValue(),
            selectedButton: null,
            value: undefined
        };
    },
    mixin: [ReactPureRender],
    getInitialSelectedValue: function () {
        return "";
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getIconSortBy: function (allowedValues) {
        const {colors} = this.getTheme();
        const type = (allowedValues || {}).type;
        const order = (allowedValues.key === this.props.sortKey && !this.props.descending) ? "desc" : "asc";
        return (
            <Icon
                color={colors.mainFontColor}
                icon={`${type || "number"}-${order || "asc"}`}
                size={"30px"}
                style={{
                    float: "right",
                    display: "inline",
                    verticalAlign: "text-top",
                    marginLeft: "10px"
                }}
            />
        );
    },
    getButtonSort: function () {
        return [
            {label: "Pod", key: "pod", type: "text"},
            {label: "Id", key: "_id", type: "text"},
            {label: "Nome", key: "name", type: "text"},
            {label: "Provincia", key: "prov", type: "text"},
            {label: "Data ultimo aggiornamento", key: "lastUpdate", type: "number"},
            {label: "Piani", key: "piani", type: "number"},
            {label: "Vetrine", key: "vetrine", type: "number"},
            {label: "Mq Comm", key: "mq", type: "number"},
            {label: "Mq PdV", key: "mq1", type: "number"}
        ];
    },
    renderSortByButtons: function () {
        const activeValue = this.getButtonSort().find((value) => {
            return this.props.sortKey === value.key;
        });
        return (
            <DropdownSelect
                allowedValues={this.getButtonSort()}
                getKey={R.prop("key")}
                getIcon={this.getIconSortBy}
                getLabel={R.prop("label")}
                onChange={(sortBy) => this.props.onChange(sortBy.key)}
                title={"Visualizza in ordine di:"}
                style={{textAlign: "left", padding: "5px 10px"}}
                value={activeValue}
            />
        );
    },
    renderTitlePopover: function () {
        const {colors} = this.getTheme();
        return (
            <span style={styles(this.getTheme()).titleButtonPopover}>
                <Icon
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
                <PopoverScrollable
                    hideOnChange={true}
                    title={this.renderTitlePopover()}
                >
                    {this.renderSortByButtons()}
                </PopoverScrollable>
            </div>
        );
    }
});

module.exports = ButtonSortBy;
