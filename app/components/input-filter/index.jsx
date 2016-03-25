import React, {PropTypes} from "react";
import {Style} from "radium";
import * as bootstrap from "react-bootstrap";

import components from "components";
import {defaultTheme} from "lib/theme";

const defaultStyles = ({colors}) => ({
    ".input-search": {
        height: "60px",
        fontSize: "20px",
        borderRight: "0px",
        borderTopLeftRadius: "20px",
        borderBottomLeftRadius: "20px",
        backgroundColor: colors.backgroundInputSearch,
        outline: "none !important",
        color: colors.white
    },
    ".input-group-addon": {
        backgroundColor: colors.backgroundInputSearch,
        borderTopRightRadius: "20px",
        borderBottomRightRadius: "20px",
        cursor: "pointer"
    }
});

var InputFilter = React.createClass({
    propTypes: {
        inputValue: PropTypes.string.isRequired,
        onChangeFilter: PropTypes.func.isRequired,
        style: PropTypes.object
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        const {colors} = this.getTheme();
        const searchStyle = this.props.style ? this.props.style : defaultStyles(this.getTheme());
        return (
            <div className="search-container">
                <Style
                    rules={searchStyle}
                    scopeSelector=".search-container"
                />
                <bootstrap.Input
                    addonAfter={
                        <components.Icon
                            color={colors.iconInputSearch}
                            icon={"search"}
                            size={"34px"}
                            style={{
                                lineHeight: "10px",
                                verticalAlign: "middle"
                            }}
                        />
                    }
                    className="input-search"
                    onChange={event => this.props.onChangeFilter(event.target.value)}
                    placeholder="Ricerca"
                    type="text"
                    value={this.props.inputValue}
                />
            </div>
        );
    }
});

module.exports = InputFilter;
