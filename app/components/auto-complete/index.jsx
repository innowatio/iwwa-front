import parse from "autosuggest-highlight/parse";
import Radium from "radium";
import React, {PropTypes} from "react";
import Autosuggest from "react-autosuggest";

import {defaultTheme} from "lib/theme";

var AutoComplete = React.createClass({
    propTypes: {
        onSelectSuggestion: PropTypes.func.isRequired,
        options: PropTypes.array.isRequired,
        placeholder: PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            value: "",
            suggestions: []
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    onChange: function (event, {newValue}) {
        this.setState({value: newValue});
    },
    getStyle: function () {
        const {colors} = this.getTheme();
        return {
            ".react-autosuggest__container": {
                position: "relative"
            },
            ".react-autosuggest__input": {
                height: "60px",
                width: "100%",
                fontSize: "20px",
                borderRight: "0px",
                borderRadius: "20px",
                backgroundColor: colors.iconSearchUser,
                outline: "0px",
                outlineStyle: "none",
                outlineWidth: "0px",
                color: colors.white
            },
            ".react-autosuggest__input:focus": {
                outline: "none"
            },
            ".react-autosuggest__container--open .react-autosuggest__input": {
                borderBottomLeftRadius: "0",
                borderBottomRightRadius: "0"
            },
            ".react-autosuggest__suggestions-container": {
                display: "none"
            },
            ".react-autosuggest__container--open .react-autosuggest__suggestions-container": {
                display: "block",
                position: "absolute",
                top: "51px",
                width: "280px",
                border: "1px solid #aaa",
                backgroundColor: "#fff",
                fontFamily: "Helvetica, sans-serif",
                fontWeight: "300",
                fontSize: "16px",
                borderBottomLeftRadius: "4px",
                borderBottomRightRadius: "4px",
                zIndex: "2"
            },
            ".react-autosuggest__suggestions-list": {
                margin: "0",
                padding: "0",
                listStyleType: "none"
            },
            ".react-autosuggest__suggestion": {
                cursor: "pointer",
                padding: "10px 20px"
            },
            ".react-autosuggest__suggestion:not(:first-child)": {
                borderTop: "1px solid #ddd"
            },
            ".react-autosuggest__suggestion--focused": {
                backgroundColor: "#0C7EAF",
                color: "#fff"
            },
            ".suggestion-content": {
                display: "flex",
                alignItems: "center",
                backgroundRepeat: "no-repeat"
            },
            ".name": {
                marginLeft: "68px",
                lineHeight: "45px"
            },
            ".highlight": {
                color: "#ee0000",
                fontWeight: "bold"
            },
            ".react-autosuggest__suggestion--focused .highlight": {
                color: "#120000"
            }
        };
    },
    getSuggestions: function (value) {
        const inputValue = value.trim().toLowerCase();
        return inputValue.length === 0 ? [] : this.props.options.filter(opt => opt.toLowerCase().indexOf(inputValue) >= 0);
    },
    getSuggestionValue: function (suggestion) {
        this.props.onSelectSuggestion(suggestion);
        return "";
    },
    onSuggestionsFetchRequested: function ({value}) {
        this.setState({suggestions: this.getSuggestions(value)});
    },
    onSuggestionsClearRequested: function () {
        this.setState({suggestions: []});
    },
    match: function (text, query) {
        return query
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter(function (word) {
                return word.length > 0;
            })
            .reduce(function (result, word) {
                let hasMore = true;
                text = text.toLowerCase();
                while (hasMore) {
                    var wordLen = word.length;
                    var regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
                    var index = text.search(regex);
                    if (index > -1) {
                        result.push([index, index + wordLen]);
                        text =
                            text.slice(0, index) +
                            (new Array(wordLen + 1)).join(" ") +
                            text.slice(index + wordLen);
                    } else {
                        hasMore = false;
                    }
                }
                return result;
            }, [])
            .sort(function (match1, match2) {
                return match1[0] - match2[0];
            });
    },
    renderSuggestion: function (suggestion, {query}) {
        const matches = this.match(suggestion, query);
        const parts = parse(suggestion, matches);
        return (
            <span className="name">
                {
                    parts.map((part, index) => {
                        const className = part.highlight ? "highlight" : null;
                        return (
                            <span className={className} key={index}>{part.text}</span>
                        );
                    })
                }
            </span>
        );
    },
    render: function () {
        const {value, suggestions} = this.state;
        const inputProps = {
            placeholder: this.props.placeholder,
            value,
            onChange: this.onChange
        };
        return (
            <div>
                <Radium.Style rules={this.getStyle()} />
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                />
            </div>
        );
    }
});

module.exports = AutoComplete;