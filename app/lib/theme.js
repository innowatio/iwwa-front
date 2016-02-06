import ReactTheme from "react-theme";

import {colorsDarkTheme} from "./colors-dark-theme";
import {colorsLightTheme} from "./colors-light-theme";

export const theme = new ReactTheme();

theme.setSource("dark", () => ({
    colors: colorsDarkTheme
}));

theme.setSource("light", () => ({
    colors: colorsLightTheme
}));

export const defaultTheme = {
    colors: colorsDarkTheme
};
