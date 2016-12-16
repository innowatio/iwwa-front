import React, {PropTypes} from "react";
import {partial, identity} from "ramda";
import ReactPureRender from "react-addons-pure-render-mixin";
import RadioGroup from "react-radio-group";
import R from "ramda";

import {
    Icon,
    Popover,
    ButtonGroupSelect
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
    },
    buttonGroupSelect: {
        background: colors.transparent,
        border: `1px solid ${colors.borderButtonCalendar}`,
        color: colors.mainFontColor,
        width: "17%",
        minWidth: "200px",
        height: "41px",
        marginRight: "8px",
        fontSize: "14px",
        fontWeight: "400"
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
            {label: "Id", key: "id"},
            {label: "Provincia", key: "prov"},
            {label: "Data ultimo aggiornamento", key: "aggiornamento"},
            {label: "Piani", key: "piani"},
            {label: "Vetrine", key: "vetrine"},
            {label: "mq Comm", key: "mq"},
            {label: "mq PdV", key: "mq1"}
        ];
    },
    handleChange: function (key, value) {
        console.log({
            key,
            value
        });
        this.setState({
            sortBy: {
                ...this.state.sortBy,
                [key]: value
            }
        });
    },
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
        const theme = this.getTheme();
        return (
            <div style={{height: "auto", float: "right"}}>
                <Popover title={this.renderTitlePopover()}>
                    <div style={styles(this.getTheme()).sortBy}>
                        {"Visualizza in ordine di:"}
                    </div>
                    <ButtonGroupSelect
                        allowedValues={this.getButtonSort()}
                        getKey={R.prop("key")}
                        getLabel={R.prop("label")}
                        onChange={(input) => console.log({input})}
                        style={styles(theme).buttonGroupSelect}
                        styleToMergeWhenActiveState={{
                            background: theme.colors.buttonPrimary,
                            color: theme.colors.white,
                            border: "none"
                        }}
                        value={[]}
                    />
                </Popover>
            </div>
        );
    }
});

module.exports = ButtonSortBy;
