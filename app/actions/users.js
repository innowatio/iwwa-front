import {getBasicObject} from "./utils";

export const SELECT_USER = "SELECT_USER";

export const selectUser = (user) => getBasicObject(SELECT_USER, user);