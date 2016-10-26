import React, {PropTypes} from "react";
import * as bootstrap from "react-bootstrap";
import {defaultTheme} from "lib/theme";

import {
    Button,
    FullscreenModal,
    Icon
} from "components";

const stylesFunction = ({colors}) => ({
    buttonIconStyle: {
        backgroundColor: colors.primary,
        border: "0px none",
        borderRadius: "100%",
        height: "50px",
        margin: "auto",
        width: "50px",
        marginLeft: "10px"
    },
    modalTitleStyle: {
        color: colors.white,
        display: "inherit",
        marginBottom: "50px",
        textAlign: "center",
        fontWeight: "400",
        fontSize: "28px"
    }
});

var DeleteWithConfirmButton = React.createClass({
    propTypes: {
        disabled: PropTypes.bool,
        onConfirm: PropTypes.func.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            showConfirmModal: false
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    closeModal: function () {
        this.setState({
            showConfirmModal: false
        });
    },
    openConfirmModal: function () {
        this.setState({
            showConfirmModal: true
        });
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div style={{display: "inline"}}>
                <bootstrap.OverlayTrigger
                    overlay={<bootstrap.Tooltip id="delete" className="buttonInfo">
                        {"Elimina"}
                    </bootstrap.Tooltip>}
                    placement="bottom"
                    rootClose={true}
                >
                    <Button
                        disabled={this.props.disabled}
                        onClick={this.openConfirmModal}
                        style={stylesFunction(theme).buttonIconStyle}
                    >
                        <Icon
                            color={theme.colors.iconHeader}
                            icon={"close"}
                            size={"28px"}
                            style={{lineHeight: "45px"}}
                        />
                    </Button>
                </bootstrap.OverlayTrigger>
                <FullscreenModal
                    onConfirm={() => {
                        this.props.onConfirm();
                        this.closeModal();
                    }}
                    onHide={this.closeModal}
                    renderConfirmButton={true}
                    show={this.state.showConfirmModal}
                >
                    <div style={{textAlign: "center"}}>
                        <div>
                            <label style={stylesFunction(theme).modalTitleStyle}>
                                {"Sei sicuro di voler cancellare questo elemento?"}
                            </label>
                        </div>
                    </div>
                </FullscreenModal>
            </div>
        );
    }
});

module.exports = DeleteWithConfirmButton;
