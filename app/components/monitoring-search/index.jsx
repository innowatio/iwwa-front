import Radium from "radium";
import React, {PropTypes} from "react";
import {FormControl, FormGroup, InputGroup} from "react-bootstrap";

import {AutoComplete, Button, Icon, TagList} from "components";

import {styles} from "lib/styles";
import {defaultTheme} from "lib/theme";

var MonitoringSearch = React.createClass({
    propTypes: {
        filterSensors: PropTypes.func.isRequired,
        filters: PropTypes.object.isRequired,
        searchButton: PropTypes.object,
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
    getSearchStyle: function () {
        const theme = this.getTheme();
        return {
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
            }
        };
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
                        rules={self.getSearchStyle()}
                        scopeSelector=".search-container"
                    />
                    <AutoComplete
                        onSelectSuggestion={suggestion => this.addValueToSearch(suggestion, "primaryTagSearchFilter", "primaryTagsToSearch")}
                        options={["Setyl", "Curno", "temperature", "Curlo"]}
                        placeholder={"Cerca per tag primari"}
                    />
                    <AutoComplete
                        onSelectSuggestion={suggestion => this.addValueToSearch(suggestion, "tagSearchFilter", "tagsToSearch")}
                        options={["Setyl", "Curno", "temperature", "Curlo"]}
                        placeholder={"Cerca per tag"}
                    />
                    {this.renderSearchInput(theme, "Cerca testo", "wordsSearchFilter", "wordsToSearch")}

                    <label style={{fontSize: "20px", fontWeight: "400", marginBottom: "10px"}}>
                        {"Riepilogo ricerca"}
                    </label>

                    <div style={{marginBottom: "30px"}}>
                        <TagList
                            tags={this.state.primaryTagsToSearch}
                            style={{textAlign: "left"}}
                        />
                        <TagList
                            tags={this.state.tagsToSearch}
                            style={{textAlign: "left"}}
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

                    <div style={{marginLeft: "20px"}}>
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
