import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";
import R from "ramda";

import {
    Icon,
    Popover,
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
        labelStyle: PropTypes.object,
        onChange: PropTypes.func.isRequired,
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
    getButtonSort: function () {
        return [
            {label: "Pod", key: "pod"},
            {label: "Id", key: "_id"},
            {label: "Nome", key: "name"},
            {label: "Provincia", key: "prov"},
            {label: "Data ultimo aggiornamento", key: "aggiornamento"},
            {label: "Piani", key: "piani"},
            {label: "Vetrine", key: "vetrine"},
            {label: "mq Comm", key: "mq"},
            {label: "mq PdV", key: "mq1"}
        ];
    },
    handleChange: function (sortBy, value) {
        this.setState({
            sortBy: {
                ...this.state.sortBy,
                [sortBy]: value
            }
        });
        this.props.onChange(sortBy.key);
    },
    renderSortByButtons: function () {
        const {colors} = this.getTheme();
        return (
            <DropdownSelect
                allowedValues={this.getButtonSort()}
                getKey={R.prop("key")}
                getHoverColor={() => {
                    return this.sortBy ? colors.buttonPrimary : colors.backgroundDropdown;
                }}
                getLabel={R.prop("label")}
                onChange={this.handleChange}
                title={"Visualizza in ordine di:"}
                style={{textAlign: "left"}}
                value={this.sortBy}
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
                <Popover
                    hideOnChange={true}
                    title={this.renderTitlePopover()}
                >
                    {this.renderSortByButtons()}
                </Popover>
            </div>
        );
    }
});

module.exports = ButtonSortBy;
