import React, {PropTypes} from "react";

import {defaultTheme} from "lib/theme";

import {Icon} from "components";

var TagList = React.createClass({
    propTypes: {
        className: PropTypes.string,
        style: PropTypes.object,
        tagIcon: PropTypes.bool,
        tags: PropTypes.any.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderTagIcon: function (theme) {
        return this.props.tagIcon ? (
            <Icon
                color={theme.colors.mainFontColor}
                icon={"tag"}
                size={"27px"}
                style={{
                    verticalAlign: "middle",
                    lineHeight: "49px",
                    marginRight: "10px"
                }}
            />
        ) : null;
    },
    renderTags: function (theme) {
        let tags = [];
        if (this.props.tags) {
            this.props.tags.forEach((tag) => {
                tags.push(
                    <label style={{
                        border: "solid 1px " + theme.colors.white,
                        color: theme.colors.white,
                        padding: "2px 10px 2px 10px",
                        borderRadius: "35px",
                        marginRight: "5px"
                    }}>
                        {tag}
                    </label>
                );
            });
        }
        return tags;
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div className={this.props.className} style={this.props.style}>
                {this.renderTagIcon(theme)}
                {this.renderTags(theme)}
            </div>
        );
    }
});

module.exports = TagList;
