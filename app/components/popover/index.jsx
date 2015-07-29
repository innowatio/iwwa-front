var Radium     = require("radium");
var React       = require("react");
var bootstrap  = require("react-bootstrap");

var components = require("components/");

var Popover = React.createClass({
    propTypes: {
        children: React.PropTypes.element,
        title: React.PropTypes.element
    },
    renderOverlay: function () {
        return (
            <bootstrap.Popover className="multiselect-popover">
                <Radium.Style
                    rules={{
                        "": {
                            padding: "0px"
                        },
                        ".popover-content": {
                            padding: "0px",
                            cursor: "pointer"
                        },
                        ".rw-widget": {
                            border: "0px"
                        },
                        ".rw-popup": {
                            padding: "0px"
                        }
                    }}
                    scopeSelector=".multiselect-popover"
                />
                {this.props.children}
            </bootstrap.Popover>
        );
    },
    render: function () {
        return (
            <bootstrap.OverlayTrigger
                overlay={this.renderOverlay()}
                placement="bottom"
                rootClose={true}
                trigger="click"
            >
                <components.Button  bsStyle="link">
                    {this.props.title}
                </components.Button>
            </bootstrap.OverlayTrigger>
        );
    }
});

module.exports = Radium(Popover);
