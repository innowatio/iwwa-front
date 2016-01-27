export const gaugeStyle = {

    ".gauge": {
        width: "200px",
        height: "100px",
        position: "relative",
        overflow: "hidden"
    },

    ".inner": {
        width: "200px",
        height: "100px",
        display: "block",
        backgroundColor: "#444444",
        borderRadius: "200px 200px 0 0",
        zIndex: 1
    },
    ".innerafter": {
        content: "",
        width: "120px",
        height: "60px",
        top: "40px",
        left: "40px",
        backgroundColor: "#2a2a2a",
        borderRadius: "200px 200px 0 0",
        position: "absolute",
        zIndex: 3
    },

    ".spinner": {
        width: "200px",
        height: "100px",
        backgroundColor: "#70b37d",
        position: "absolute",
        zIndex: 2,
        WebkitTransformOrigin: "top center",
        MsTransformOrigin: "top center",
        transformOrigin: "top center",
        WebkitTransform: "rotate(0deg)",
        MsTransform: "rotate(0deg)",
        transform: "rotate(0deg)",
        WebkitTransition: "-webkit-transform 800ms ease",
        transition: "transform 800ms ease",
        // WebkitTransform: "translateZ(0)",
        //       transform: "translateZ(0)",
        borderRadius: "0 0 200px 200px"
    },
    ".spinner .alt": {
        backgroundColor: "#e14e54"
    },

    ".gauge-cont": {
        display: "inline-block",
        position: "relative",
        width: "200px",
        height: "100px",
        marginLeft: "30px"
    },
    ".gauge-cont:first-child": {
        margin: 0
    },

    ".pointer": {
        display: "block",
        width: "6px",
        height: "105px",
        backgroundColor: "#fff",
        borderRadius: "4px 4px 0 0",
        position: "absolute",
        zIndex: 4,
        bottom: "0px",
        left: "97px",
        WebkitTransform: "rotate(-90deg)",
        MsTransform: "rotate(-90deg)",
        transform: "rotate(-90deg)",
        WebkitTransformOrigin: "center bottom",
        MsTransformOrigin: "center bottom",
        transformOrigin: "center bottom",
        WebkitTransition: "-webkit-transform 800ms ease",
        transition: "transform 800ms ease"
    },

    ".pointer-knob": {
        width: "20px",
        height: "20px",
        backgroundColor: "#fff",
        position: "absolute",
        left: "90px",
        bottom: "-10px",
        zIndex: 5,
        borderRadius: "20px"
    }

};
