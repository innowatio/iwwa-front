import Radium from "radium";
import React, {PropTypes} from "react";
import {Input} from "react-bootstrap";

import {Button, Icon} from "components";

import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

var MonitoringSearch = React.createClass({
    propTypes: {
        filterSensors: PropTypes.func.isRequired,
        style: PropTypes.object
    },
    contextTypes: {
        style: PropTypes.object,
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            standardSearchFilter: null,
            tagSearchFilter: null,
            tagsToSearch: [],
            wordsToSearch: []
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
                outline: "0px",
                outlineStyle: "none",
                outlineWidth: "0px",
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
    filterSensors: function () {
        this.props.filterSensors({
            tagsToFilter: this.state.tagsToSearch,
            wordsToFilter: this.state.wordsToSearch
        });
    },
    render: function () {
        let self = this;
        let divStyle = {
            ...styles(self.getTheme()).titlePage,
            ...self.props.style
        };
        let theme = self.getTheme();
        return (
            <div style={divStyle}>
                <div className="search-container" style={{paddingTop: "20px", textAlign: "center"}}>
                    <Radium.Style
                        rules={self.getSearchStyle()}
                        scopeSelector=".search-container"
                    />
                    <Input
                        addonAfter={
                            <Icon
                                color={theme.colors.white}
                                icon={"search"}
                                onClick={() => {
                                    let word = self.state.standardSearchFilter;
                                    if (word && word.trim().length > 0) {
                                        let newWords = self.state.wordsToSearch.slice();
                                        newWords.push(word);
                                        self.setState({wordsToSearch: newWords, standardSearchFilter: null});
                                    }
                                }}
                                size={"34px"}
                                style={{
                                    lineHeight: "10px",
                                    verticalAlign: "middle"
                                }}
                            />
                        }
                        className="input-search"
                        onChange={(input) => self.setState({standardSearchFilter: input.target.value})}
                        placeholder="Cerca"
                        type="text"
                        value={self.state.standardSearchFilter}
                    />

                    <Input
                        addonAfter={
                            <Icon
                                color={theme.colors.white}
                                icon={"tag"}
                                onClick={() => {
                                    let tag = self.state.tagSearchFilter;
                                    if (tag && tag.trim().length > 0) {
                                        let newTags = self.state.tagsToSearch.slice();
                                        newTags.push(tag);
                                        self.setState({tagsToSearch: newTags, tagSearchFilter: null});
                                    }
                                }}
                                size={"34px"}
                                style={{
                                    lineHeight: "10px",
                                    verticalAlign: "middle"
                                }}
                            />
                        }
                        className="input-search"
                        onChange={(input) => self.setState({tagSearchFilter: input.target.value})}
                        placeholder="Cerca per tag"
                        type="text"
                        value={self.state.tagSearchFilter}
                    />

                    <label style={{fontSize: "20px", fontWeight: "400", marginBottom: "10px"}}>
                        {"Riepilogo ricerca"}
                    </label>

                    <div style={{marginBottom: "30px"}}>
                        <div style={{textAlign: "left"}}>
                            {self.state.wordsToSearch.map(item => {
                                return (
                                    <label key={item} style={{
                                        margin:"0px 10px 10px 10px",
                                        fontSize: "16px",
                                        fontWeight: "300"
                                    }}
                                    >
                                        {item}
                                    </label>
                                );
                            })}
                        </div>

                        <div style={{textAlign: "left"}}>
                            {self.state.tagsToSearch.map(item => {
                                return (
                                    <label key={item} style={{
                                        border: "solid 1px",
                                        fontSize: "16px",
                                        fontWeight: "300",
                                        padding: "3px 10px 3px 10px",
                                        borderRadius: "35px",
                                        marginRight: "5px"
                                    }}
                                    >
                                        {item}
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{marginLeft: "20px"}}>
                        <Button
                            onClick={self.filterSensors}
                            style={{
                                color: theme.colors.white,
                                borderRadius: "30px",
                                fontWeight: "300",
                                width: "120px",
                                height: "45px",
                                lineHeight: "45px",
                                padding: "0",
                                fontSize: "20px",
                                border: "0px",
                                backgroundColor: theme.colors.buttonPrimary
                            }}
                        >
                            {"OK"}
                        </Button>
                        <Icon
                            color={theme.colors.white}
                            icon={"reset"}
                            onClick={() => self.setState(self.getInitialState())}
                            size={"35px"}
                            style={{
                                verticalAlign: "middle",
                                lineHeight: "20px"
                            }}

                        />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = MonitoringSearch;
