import React from "react";
import {Style} from "radium";
import * as bootstrap from "react-bootstrap";

import components from "components";

var Filter = React.createClass({
    render: function () {
        const {colors} = this.getTheme();
        return (
            <div className="search-container">
                <Style
                    rules={{
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
                    }}
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
                    placeholder="Ricerca"
                    type="text"
                />
            </div>
        );
    }
});

module.exports = Filter;
