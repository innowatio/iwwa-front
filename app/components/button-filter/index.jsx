import React, {PropTypes} from "react";
import * as bootstrap from "react-bootstrap";
import {is, partial} from "ramda";

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
    }
});

var ButtonFilter = React.createClass({
    propTypes: {
        filterList: PropTypes.arrayOf(PropTypes.object),
        onClickFilter: PropTypes.func.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderFilterTableCell: function (allowedValue, label, index) {
        return (
            <div key={index} onClick={partial(this.props.onClickFilter, [allowedValue, label])}>
                <bootstrap.Input
                    name={allowedValue.key}
                    type={"radio"}
                    value={label}
                />
                {label}
            </div>
        );
    },
    renderFilterCell: function (value) {
        const {colors} = this.getTheme();
        return (
            <div key={value.title}>
                <h5 style={{color: colors.mainFontColor}}>
                    {value.title}
                </h5>
                <bootstrap.ListGroup style={{paddingLeft: "30px"}}>
                    {
                        is(Array, value.label) ?
                        value.label.map(partial(this.renderFilterTableCell, [value])) :
                        this.renderFilterTableCell(value, value.label)
                    }
                </bootstrap.ListGroup>
            </div>
        );
    },
    renderFilter: function () {
        return (
            <div style={styles(this.getTheme()).filter}>
                {this.props.filterList.map(this.renderFilterCell)}
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
