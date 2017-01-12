import React, {PropTypes} from "react";

import {
    Button,
    TagList
} from "components";
import {defaultTheme} from "lib/theme";

import SearchFilters from "./search-filter";

var SearchPanel = React.createClass({
    propTypes: {
        confirmLabel: PropTypes.string,
        onAddFilter: PropTypes.func.isRequired,
        onConfirm: PropTypes.func.isRequired,
        onReset: PropTypes.func.isRequired,
        searchFields: PropTypes.array.isRequired,
        searchFilters: PropTypes.array.isRequired
    },
    contextTypes: {
        style: PropTypes.object,
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderSearchInputFields: function () {
        const {
            onAddFilter,
            searchFields
        } = this.props;
        return searchFields.map(searchField => {
            return (
                <SearchFilters
                    onSubmit={(value) => {
                        onAddFilter({
                            filter: searchField.key,
                            value
                        });
                    }}
                    key={searchField.key}
                    placeholder={searchField.title}
                />
            );
        });
    },
    renderReset: function () {
        const theme = this.getTheme();
        const {
            onReset,
            searchFilters
        } = this.props;
        return searchFilters.length > 0 ? (
            <Button
                onClick={onReset}
                style={{
                    color: theme.colors.white,
                    borderRadius: "30px",
                    fontWeight: "300",
                    height: "45px",
                    lineHeight: "45px",
                    paddingTop: "0px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    fontSize: "20px",
                    border: "0px",
                    backgroundColor: theme.colors.buttonPrimary
                }}
            >
                {"Reset"}
            </Button>
        ) : null;
    },
    render: function () {
        const theme = this.getTheme();
        const {
            confirmLabel,
            onConfirm,
            searchFilters
        } = this.props;
        return (
            <div className="search-container">
                {this.renderSearchInputFields()}
                <label style={{fontSize: "18px", fontWeight: "300", marginBottom: "10px"}}>
                    {"Riepilogo ricerca"}
                </label>
                <TagList
                    tags={searchFilters}
                    style={{textAlign: "left"}}
                />
                <Button
                    onClick={onConfirm}
                    style={{
                        color: theme.colors.white,
                        borderRadius: "30px",
                        fontWeight: "300",
                        height: "45px",
                        lineHeight: "45px",
                        paddingTop: "0px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        fontSize: "20px",
                        border: "0px",
                        backgroundColor: theme.colors.buttonPrimary
                    }}
                >
                    {confirmLabel ? confirmLabel.toUpperCase() : "OK"}
                </Button>
                {this.renderReset()}
            </div>
        );
    }
});

module.exports = SearchPanel;
