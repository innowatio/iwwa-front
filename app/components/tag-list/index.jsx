import React, {PropTypes} from "react";

import {defaultTheme} from "lib/theme";

import {Icon} from "components";

const styles = (theme) => ({
    labelPrimaryTag: {
        padding: "0px 10px",
        borderRadius: "35px",
        marginRight: "5px",
        fontSize: "13px",
        color: theme.colors.primaryTagsColor,
        border: "solid 1px " + theme.colors.primaryTagsColor
    },
    labelPrimaryTagHover: {
        padding: "0px 10px",
        borderRadius: "35px",
        marginRight: "5px",
        color: theme.colors.white,
        border: "solid 1px " + theme.colors.white
    },
    labelTag: {
        padding: "0px 10px",
        borderRadius: "35px",
        marginRight: "5px",
        fontSize: "13px",
        color: theme.colors.mainFontColor,
        border: "solid 1px " + theme.colors.mainFontColor
    }
});


var TagList = React.createClass({
    propTypes: {
        className: PropTypes.string,
        containerStyle: PropTypes.object,
        isSelected: PropTypes.bool,
        onClickRemove: PropTypes.func,
        primaryTags: PropTypes.any,
        tagIcon: PropTypes.bool,
        tags: PropTypes.any
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
                    lineHeight: "50px",
                    marginRight: "10px"
                }}
            />
        ) : null;
    },
    renderTagRemoveIcon: function (value) {
        return this.props.onClickRemove ? (
            <div
                style={{
                    cursor: "pointer",
                    marginRight: "10px",
                    fontWeight: "300",
                    display: "inline-block",
                    fontSize: "16px",
                    lineHeight: "18px"
                }}
                onClick={() => this.props.onClickRemove(value)}
            >
                {"×"}
            </div>
        ) : null;
    },
    renderTag: function (style, value) {
        return (
            <label
                style={style}
                key={value}
            >
                {this.renderTagRemoveIcon(value)}
                <span style={{fontWeight: "300"}}>
                    {value}
                </span>
            </label>
        );
    },
    renderTags: function (theme) {
        let tags = [];
        if (this.props.primaryTags) {
            this.props.primaryTags.forEach(primaryTag => {
                const style = this.props.isSelected ? styles(theme).labelPrimaryTagHover : styles(theme).labelPrimaryTag;
                tags.push(this.renderTag(style, primaryTag));
            });
        }
        if (this.props.tags) {
            this.props.tags.forEach(tag => {
                tags.push(this.renderTag(styles(theme).labelTag, tag));
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
