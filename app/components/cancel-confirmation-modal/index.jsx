import React, {PropTypes} from "react";
import {defaultTheme} from "lib/theme";

import {
    FullscreenModal
} from "components";

const stylesFunction = ({colors}) => ({
    modalTitleStyle: {
        color: colors.mainFontColor,
        display: "inherit",
        marginBottom: "50px",
        textAlign: "center",
        fontWeight: "400",
        fontSize: "28px"
    }
});

var CancelConfirmationModal = React.createClass({
    propTypes: {
        onConfirm: PropTypes.func.isRequired,
        onHide: PropTypes.func.isRequired,
        show: PropTypes.bool.isRequired,
        title: PropTypes.string
    },
    getInitialState: function () {
        return {
            showConfirmModal: false
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        const {title, show, onConfirm, onHide} = this.props;
        return (
            <FullscreenModal
                onHide={onHide}
                onConfirm={onConfirm}
                renderConfirmButton={true}
                show={show}
            >
                <div style={{textAlign: "center"}}>
                    <label style={stylesFunction(this.getTheme()).modalTitleStyle}>
                        {title ? title : "Sei sicuro di voler annullare l'operazione di assegnazione?"}
                    </label>
                </div>
            </FullscreenModal>
        );
    }
});

module.exports = CancelConfirmationModal;
