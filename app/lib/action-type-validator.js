import {validate} from "tcomb-validation";

export default function actionTypeValidator (...types) {
    return (...args) => {
        for (var i = 0; i < types.length; i++) {
            const error = validate(args[i], types[i]).firstError();
            if (error) {
                throw error.message;
            }
        }
    };
}
