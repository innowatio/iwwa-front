import Immutable from "immutable";
import IPropTypes from "react-immutable-proptypes";
import React from "react";

import {
    Button,
    CollectionItemList,
    Icon,
    SectionToolbar,
    UserRow
} from "components";

import {getDragDropContext} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";
import {getUsername} from "lib/users-utils";

const lazyLoadButtonStyle = ({colors}) => ({
    width: "230px",
    height: "45px",
    lineHeight: "43px",
    backgroundColor: colors.buttonPrimary,
    fontSize: "14px",
    color: colors.white,
    textTransform: "uppercase",
    fontWeight: "400",
    margin: "10px auto 40px auto",
    borderRadius: "30px",
    cursor: "pointer",
    textAlign: "center"
});

const stylesFunction = (theme) => ({
    buttonIconStyle: {
        backgroundColor: theme.colors.buttonPrimary,
        border: "0px none",
        borderRadius: "100%",
        height: "50px",
        margin: "auto",
        width: "50px",
        marginLeft: "10px"
    }
});

var Users = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("users");
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    searchFilter: function (element, search) {
        return (
            getUsername(element).toLowerCase().indexOf(search.toLowerCase()) >= 0
        );
    },
    renderUserList: function (element) {
        return (
            <UserRow
                user={element}
            />
        );
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <SectionToolbar>
                    <div style={{float: "left", marginTop: "3px"}}>
                        <Button
                            style={stylesFunction(theme).buttonIconStyle}
                            disabled={true}
                        >
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"add"}
                                size={"28px"}
                                style={{lineHeight: "45px"}}
                            />
                        </Button>
                    </div>
                    <div style={{float: "right", marginTop: "3px"}}>
                        <Button
                            style={stylesFunction(theme).buttonIconStyle}
                            disabled={true}
                        >
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"gauge"}
                                size={"28px"}
                                style={{lineHeight: "45px"}}
                            />
                        </Button>
                        <Button
                            style={stylesFunction(theme).buttonIconStyle}
                            disabled={true}
                        >
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"edit"}
                                size={"28px"}
                                style={{lineHeight: "45px"}}
                            />
                        </Button>
                        <Button
                            style={stylesFunction(theme).buttonIconStyle}
                            disabled={true}
                        >
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"edit"}
                                size={"28px"}
                                style={{lineHeight: "45px"}}
                            />
                        </Button>
                        <Button
                            style={stylesFunction(theme).buttonIconStyle}
                            disabled={true}
                        >
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"delete"}
                                size={"28px"}
                                style={{lineHeight: "45px"}}
                            />
                        </Button>
                    </div>
                </SectionToolbar>

                <div className="table-user">
                    <div style={{width: "98%", position: "relative", left: "1%", marginTop: "20px"}}>
                        <CollectionItemList
                            collections={this.props.collections.get("users") || Immutable.Map()}
                            filter={this.searchFilter}
                            headerComponent={this.renderUserList}
                            hover={true}
                            initialVisibleRow={10}
                            lazyLoadButtonStyle={lazyLoadButtonStyle(theme)}
                            lazyLoadLabel={"Carica altri"}
                            showFilterInput={true}
                        />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = getDragDropContext(Users);
