import Radium from "radium";
import React, {PropTypes} from "react";
import {FormControl, FormGroup, InputGroup} from "react-bootstrap";
import IPropTypes from "react-immutable-proptypes";

import {AutoComplete, Button, Icon, TagList} from "components";

import {getSensorsTags} from "lib/sensors-utils";
import {styles} from "lib/styles";
import {defaultTheme} from "lib/theme";

const inputStyle = (colors) => ({
    height: "60px",
    lineHeight: "45px",
    marginBottom: "20px",
    fontSize: "20px",
    textAlign: "left",
    borderTopLeftRadius: "20px",
    borderBottomLeftRadius: "20px",
    borderTopRightRadius: "20px",
    borderBottomRightRadius: "20px",
    backgroundColor: colors.iconSearchUser,
    outline: "0px",
    outlineStyle: "none",
    outlineWidth: "0px",
    color: colors.white
});

var MonitoringSearch = React.createClass({
    propTypes: {
        filterSensors: PropTypes.func.isRequired,
        filters: PropTypes.object.isRequired,
        searchButton: PropTypes.object,
        sensors: IPropTypes.map.isRequired,
        style: PropTypes.object
    },
    contextTypes: {
        style: PropTypes.object,
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            primaryTagSearchFilter: "",
            primaryTagsToSearch: [],
            tagSearchFilter: "",
            tagsToSearch: [],
            wordsSearchFilter: "",
            wordsToSearch: []
        };
    },
    componentDidMount: function () {
        this.updateFilter("primaryTagsToSearch", this.props.filters.primaryTagsToFilter);
        this.updateFilter("tagsToSearch", this.props.filters.tagsToFilter);
        this.updateFilter("wordsToSearch", this.props.filters.wordsToFilter);
    },
    updateFilter: function (stateFilter, value) {
        let obj = {};
        obj[stateFilter] = value;
        this.setState(obj);
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    resetFilters: function () {
        this.setState(this.getInitialState(), this.filterSensors);
    },
    filterSensors: function () {
        this.props.filterSensors({
            primaryTagsToFilter: this.state.primaryTagsToSearch,
            tagsToFilter: this.state.tagsToSearch,
            wordsToFilter: this.state.wordsToSearch
        });
    },
    addValueToSearch: function (value, filterField, searchValuesField) {
        if (value && value.trim().length > 0) {
            let newValues = this.state[searchValuesField].slice();
            newValues.push(value);
            let obj = {};
            obj[filterField] = "";
            obj[searchValuesField] = newValues;
            this.setState(obj, this.filterSensors);
        }
    },
    renderSearchButton: function (theme) {
        return this.props.searchButton ? (
            <Button
                onClick={this.props.searchButton.onClick}
                style={{
                    color: theme.colors.white,
                    borderRadius: "30px",
                    fontWeight: "300",
                    width: "120px",
                    height: "45px",
                    lineHeight: "45px",
                    padding: "0px",
                    fontSize: "20px",
                    border: "0px",
                    backgroundColor: theme.colors.buttonPrimary
                }}
            >
                {this.props.searchButton.label}
            </Button>
        ) : null;
    },
    renderSearchInput: function (theme, inputPlaceholder, filterField, searchValuesField) {
        let self = this;
        return (
            <FormGroup style={{display: "inline-table"}}>
                <FormControl
                    className="input-search"
                    onChange={input => {
                        this.updateFilter(filterField, input.target.value);
                    }}
                    placeholder={inputPlaceholder}
                    type="text"
                    value={self.state[filterField]}
                    style={{fontWeight: "300"}}
                />
                <InputGroup.Addon>
                    <Icon
                        color={theme.colors.white}
                        icon={"search"}
                        onClick={() => this.addValueToSearch(this.state[filterField], filterField, searchValuesField)}
                        size={"34px"}
                        style={{
                            lineHeight: "10px",
                            verticalAlign: "middle"
                        }}
                    />
                </InputGroup.Addon>
            </FormGroup>
        );
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
                <div className="search-container" style={{paddingTop: "20px", textAlign: "center", width: "100%"}}>
                    <Radium.Style
                        rules={{
                            ".input-search": {
                                height: "60px",
                                fontSize: "20px",
                                borderRight: "0px",
                                borderTopLeftRadius: "20px",
                                borderBottomLeftRadius: "20px",
                                borderTopRightRadius: "0px",
                                borderBottomRightRadius: "0px",
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
                            },
                            ".Select-control > span.Select-multi-value-wrapper > .Select-placeholder": {
                                lineHeight: "55px"
                            },
                            ".Select-control": {
                                outline: "0px",
                                outlineStyle: "none",
                                outlineWidth: "0px",
                                overflow: "hidden",
                                position: "relative",
                                width: "100%",
                                backgroundColor: theme.colors.transparent,
                                color: theme.colors.white,
                                fontSize: "16px",
                                fontWeight: "300",
                                padding: "0px"
                            },
                            ".Select-noresults": {
                                boxSizing: "border-box",
                                color: theme.colors.white,
                                fontSize: "15px",
                                fontWeight: "300",
                                cursor: "default",
                                display: "block",
                                padding: "8px 10px"
                            },
                            ".Select-arrow-zone > .Select-arrow": {
                                borderColor: `${theme.colors.white} ${theme.colors.transparent} ${theme.colors.transparent}`
                            },
                            ".Select-control:not(.is-searchable) > .Select-input": {
                                outline: "0px",
                                outlineStyle: "none",
                                outlineWidth: "0px",
                                borderColor: theme.colors.borderInputSearch,
                                boxShadow: "none"
                            },
                            ".is-focused:not(.is-open) > .Select-control": {
                                outline: "0px",
                                outlineStyle: "none",
                                outlineWidth: "0px",
                                borderColor: theme.colors.borderInputSearch,
                                boxShadow: "none"
                            },
                            ".form-control:focus": {
                                outline: "0px",
                                outlineStyle: "none",
                                outlineWidth: "0px",
                                borderColor: theme.colors.borderInputSearch,
                                boxShadow: "none"
                            },
                            ".Select-menu-outer": {
                                boxShadow: "none",
                                boxSizing: "border-box",
                                maxHeight: "200px",
                                position: "absolute",
                                top: "100%",
                                width: "90%",
                                left: "50%",
                                marginLeft: "-45%",
                                zIndex: "1",
                                WebkitOverflowScrolling: "touch",
                                backgroundColor: theme.colors.backgroundPopover,
                                border: "1px solid " + theme.colors.borderInputSearch,
                                borderRadius: "15px",
                                color: theme.colors.mainFontColor,
                                overflow: "hidden"
                            },
                            ".Select-menu": {
                                maxHeight: "198px",
                                overflowY: "auto"
                            },
                            ".Select-input": {
                                padding: "0px 10px"
                            },
                            ".Select-value-label": {
                                color: theme.colors.white + "!important"
                            },
                            ".Select-option": {
                                boxSizing: "border-box",
                                backgroundColor: theme.colors.transparent,
                                borderBottom: "1px solid " + theme.colors.borderInputSearch,
                                color: theme.colors.mainFontColor + "!important",
                                fontSize: "15px",
                                fontWeight: "300",
                                cursor: "pointer",
                                display: "block",
                                padding: "8px 10px"
                            },
                            ".Select-option:last-child": {
                                borderBottomRightRadius: "9px",
                                borderBottomLeftRadius: "9px",
                                borderBottom: "0px"
                            },
                            ".Select-option.is-selected, .Select-option:hover": {
                                backgroundColor: theme.colors.buttonPrimary,
                                color: theme.colors.white
                            }
                        }}
                        scopeSelector=".search-container"
                    />
                    <AutoComplete
                        onSelectSuggestion={({value}) => this.addValueToSearch(value, "primaryTagSearchFilter", "primaryTagsToSearch")}
                        options={getSensorsTags(this.props.sensors, "primaryTags")}
                        placeholder={"Cerca per tag primari"}
                        style={inputStyle(theme.colors)}
                    />
                    <AutoComplete
                        onSelectSuggestion={({value}) => this.addValueToSearch(value, "tagSearchFilter", "tagsToSearch")}
                        options={getSensorsTags(this.props.sensors, "tags")}
                        placeholder={"Cerca per tag"}
                        style={inputStyle(theme.colors)}
                    />
                    {this.renderSearchInput(theme, "Cerca testo", "wordsSearchFilter", "wordsToSearch")}

                    <div style={{width: "100%", fontSize: "20px", fontWeight: "400", marginBottom: "10px"}}>
                        <label>{"Riepilogo ricerca"}</label>
                    </div>

                    <div style={{float: "left", textAlign: "left", marginBottom: "30px"}}>
                        <TagList
                            tags={this.state.primaryTagsToSearch}
                        />
                        <TagList
                            tags={this.state.tagsToSearch}
                        />
                        <div style={{textAlign: "left"}}>
                            {self.state.wordsToSearch.map(item => {
                                return (
                                    <label key={item} style={{
                                        margin:"0px 10px 10px 10px",
                                        fontSize: "16px",
                                        fontWeight: "300"
                                    }}>
                                        {item}
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{float: "left", display: "block", width: "100%"}}>
                        {this.renderSearchButton(theme)}
                        <Icon
                            color={theme.colors.white}
                            icon={"reset"}
                            onClick={this.resetFilters}
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
