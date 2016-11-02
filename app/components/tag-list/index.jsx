import React, {PropTypes} from "react";

import {defaultTheme} from "lib/theme";

import {Icon} from "components";

const styles = (theme) => ({
    labelPrimaryTag: {
        padding: "0px 10px 2px 10px",
        borderRadius: "35px",
        marginRight: "5px",
        color: theme.colors.primaryTagsColor,
        border: "solid 1px " + theme.colors.primaryTagsColor
    },
    labelPrimaryTagHover: {
        padding: "0px 10px 2px 10px",
        borderRadius: "35px",
        marginRight: "5px",
        color: theme.colors.white,
        border: "solid 1px " + theme.colors.white
    },
    labelTag: {
        padding: "0px 10px 2px 10px",
        borderRadius: "35px",
        marginRight: "5px",
        color: theme.colors.white,
        border: "solid 1px " + theme.colors.white
    }
});


var TagList = React.createClass({
    propTypes: {
        className: PropTypes.string,
        containerStyle: PropTypes.object,
        isSelected: PropTypes.bool,
        primaryTags: PropTypes.any.isRequired,
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
        if (this.props.primaryTags) {
            this.props.primaryTags.forEach((primaryTags) => {
                tags.push(
                    <label style={
                        this.props.isSelected ?
                        styles(theme).labelPrimaryTagHover :
                        styles(theme).labelPrimaryTag
                    }>
                        {primaryTags}
                    </label>
                );
            });
        }
        if (this.props.tags) {
            this.props.tags.forEach((tag) => {
                tags.push(
                    <label style={styles(theme).labelTag}>
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
            <div className={this.props.className} style={this.props.containerStyle}>
                {this.renderTagIcon(theme)}
                {this.renderTags(theme)}
            </div>
        );
    }
});

module.exports = TagList;
