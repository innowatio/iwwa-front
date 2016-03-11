import Radium from "radium";
import React, {PropTypes} from "react";
import {Input} from "react-bootstrap";
import {Button, Icon} from "components";

import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

const buttonStyle = ({colors}) => ({
    background: colors.secondary,
    border: "0px none",
    borderRadius: "100%",
    height: "50px",
    margin: "auto",
    width: "50px"
});

var MonitoringSearch = React.createClass({
    propTypes: {
        style: PropTypes.object
    },
    contextTypes: {
        style: PropTypes.object,
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            standardSearchFilter: null,
            tagSearchFilter: null
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getSearchStyle: function () {
        let theme = this.getTheme();
        return {
            ".input-search": {
                height: "60px",
                fontSize: "20px",
                borderRight: "0px",
                borderTopLeftRadius: "20px",
                borderBottomLeftRadius: "20px",
                backgroundColor: theme.colors.iconSearchUser,
                outline: "none !important",
                color: theme.colors.white
            },
            ".input-group-addon:last-child": {
                backgroundColor: theme.colors.iconSearchUser,
                borderTopRightRadius: "20px",
                borderBottomRightRadius: "20px",
                cursor: "pointer"
            }
        };
    },
    render: function () {
        let divStyle = {
            ...styles(this.getTheme()).titlePage,
            ...this.props.style
        };
        let theme = this.getTheme();

        return (
            <div style={divStyle}>
                <div className="search-container" style={{paddingTop: "20px", textAlign: "center"}}>
                    <Radium.Style
                        rules={this.getSearchStyle()}
                        scopeSelector=".search-container"
                    />
                    <Input
                        addonAfter={
                            <Icon
                                color={theme.colors.iconInputSearch}
                                icon={"search"}
                                size={"34px"}
                                style={{
                                    lineHeight: "10px",
                                    verticalAlign: "middle"
                                }}
                            />
                        }
                        className="input-search"
                        onChange={(input) => this.setState({standardSearchFilter: input.target.value})}
                        placeholder="Cerca"
                        type="text"
                        value={this.state.standardSearchFilter}
                    />

                    <Radium.Style
                        rules={this.getSearchStyle()}
                        scopeSelector=".search-container"
                    />
                    <Input
                        addonAfter={
                            <Icon
                                color={theme.colors.iconInputSearch}
                                icon={"tag"}
                                size={"34px"}
                                style={{
                                    lineHeight: "10px",
                                    verticalAlign: "middle"
                                }}
                            />
                        }
                        className="input-search"
                        onChange={(input) => this.setState({tagSearchFilter: input.target.value})}
                        placeholder="Cerca per tag"
                        type="text"
                        value={this.state.tagSearchFilter}
                    />

                    <label>
                        {"Riepilogo ricerca"}
                    </label>

                    <div>
                        <Button>
                            {"OK"}
                        </Button>
                        <Button style={buttonStyle(theme)}>
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"reset"}
                                size={"28px"}
                                style={{lineHeight: "20px"}}
                            />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = MonitoringSearch;