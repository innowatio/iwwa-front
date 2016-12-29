import React, {PropTypes} from "react";
import {Style} from "radium";
import * as bootstrap from "react-bootstrap";

import components from "components";
import {defaultTheme} from "lib/theme";

const defaultStyles = ({colors}) => ({
    "": {
        marginTop: "22px",
        marginBottom: "22px"
    },
    ".input-search": {
        height: "60px",
        fontSize: "20px",
        borderRight: "0px",
        borderTopLeftRadius: "20px",
        borderBottomLeftRadius: "20px",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderColor: colors.borderInputSearch,
        backgroundColor: colors.backgroundInputSearch,
        color: colors.mainFontColor
    },
    ".form-control:focus": {
        borderColor: colors.borderInputSearch,
        outline: "none",
        boxShadow: "none",
        WebkitBoxShadow: "none"
    },
    ".input-group-addon": {
        backgroundColor: colors.backgroundInputSearch,
        borderColor: colors.borderInputSearch,
        borderTopRightRadius: "20px",
        borderBottomRightRadius: "20px",
        cursor: "pointer"
    }
});

class InputFilter extends React.Component {

    static propTypes = {
        inputValue: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        style: PropTypes.object
    }

    static contextTypes = {
        theme: PropTypes.object
    }

    constructor (props) {
        super(props);
        this.state = {
            inputValue: ""
        };
    }

    componentWillMount () {
        const {inputValue} = this.props;
        if (inputValue) {
            this.state = {
                inputValue
            };
            this.props.onChange(inputValue);
        }
    }

    componentWillReceiveProps (nextProps) {
        this.state = {
            inputValue: nextProps.inputValue
        };
    }

    getTheme () {
        return this.context.theme || defaultTheme;
    }

    onChangeValue (event) {
        this.setState({inputValue: event.target.value});
        this.props.onChange(event.target.value);
    }

    render () {
        const {colors} = this.getTheme();
        const searchStyle = this.props.style ? this.props.style : defaultStyles(this.getTheme());
        return (
            <div className="search-container">
                <Style
                    rules={searchStyle}
                    scopeSelector=".search-container"
                />
                <bootstrap.FormGroup style={{display: "table"}}>
                    <bootstrap.FormControl
                        className="input-search"
                        onChange={(event) => this.onChangeValue(event)}
                        placeholder="Ricerca"
                        type="text"
                        value={this.state.inputValue}
                    />
                    <bootstrap.InputGroup.Addon>
                        <components.Icon
                            color={colors.iconInputSearch}
                            icon={"search"}
                            size={"34px"}
                            style={{
                                lineHeight: "10px",
                                verticalAlign: "middle"
                            }}
                        />
                    </bootstrap.InputGroup.Addon>
                </bootstrap.FormGroup>
            </div>
        );
    }
}

module.exports = InputFilter;
