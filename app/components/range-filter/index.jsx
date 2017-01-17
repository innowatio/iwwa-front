import React, {PropTypes} from "react";
import {Slider} from "antd";
import Radium from "radium";

import {defaultTheme} from "lib/theme";

class RangeFilter extends React.Component {

    static propTypes = {
        filter: PropTypes.object,
        onChange: PropTypes.func.isRequired,
        style: PropTypes.object
    }

    constructor (props) {
        super(props);
        this.state ={};
    }

    onChangeValue (event) {
        const {id, label} = this.props.filter;
        const filter = {
            id,
            label,
            selectedValue: event
        };
        this.setState(filter);
        this.props.onChange(filter);
    }

    getTheme () {
        return this.context.theme || defaultTheme;
    }

    render () {
        const {selectedValue} = this.state.filter ? this.state.filter : this.props.filter;
        const value = selectedValue ? selectedValue : [0, 0];
        const {colors} = this.getTheme();
        return (
            <div>
                <Slider range={true} defaultValue={value} max={2000}
                    onChange={(event) => this.onChangeValue(event)}
                />
                <Radium.Style
                    rules={{
                        "": {
                            height: "8px",
                            borderRadius: "4px",
                            border: "0px"
                        },
                        ".ant-slider-step": {
                            height: "8px"
                        },
                        ".ant-slider-handle:active": {
                            boxShadow: "none",
                            backgroundColor: colors.backgroundRangeFilter + " !important"
                        },
                        ".ant-slider-handle": {
                            backgroundColor: colors.buttonPrimary,
                            border: "0px",
                            marginTop: "-3px"
                        },
                        ".ant-slider-track": {
                            backgroundColor: colors.primary,
                            height: "8px"
                        }
                    }}
                    scopeSelector=".ant-slider"
                />
            </div>
        );
    }
}

module.exports = RangeFilter;
