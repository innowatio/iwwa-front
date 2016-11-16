import React, {PropTypes} from "react";
import Select from "react-select";
import Highlighter from "react-highlight-words";

import {defaultTheme} from "lib/theme";

var AutoComplete = React.createClass({
    propTypes: {
        onSelectSuggestion: PropTypes.func.isRequired,
        options: PropTypes.array.isRequired,
        placeholder: PropTypes.string,
        style: PropTypes.object
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {};
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderOption: function (option) {
        return (
            <Highlighter
                highlightStyle={{fontWeight: "bold"}}
                searchWords={[this._inputValue]}
                textToHighlight={option.label}
            />
        );
    },
    render: function () {
        return (
            <Select
                clearAllText={"Cancella tutto"}
                clearValueText={"Cancella il valore"}
                noResultsText={"Nessun risultato trovato"}
                onChange={this.props.onSelectSuggestion}
                onInputChange={inputValue => this._inputValue = inputValue}
                optionRenderer={this.renderOption}
                {...this.props}
            />
        );
    }
});

module.exports = AutoComplete;