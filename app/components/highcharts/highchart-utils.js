export function getYLabel (key, color) {
    switch (key) {
        case "activeEnergy":
            return {
                labels: {
                    format: "{value} kWh",
                    style: {color}
                },
                title: {text: null}
            };
        case "maxPower":
            return {
                labels: {
                    format: "{value} kW",
                    style: {color}
                },
                title: {text: null}
            };
        case "reactiveEnergy":
            return {
                labels: {
                    format: "{value} kVARh",
                    style: {color}
                },
                title: {text: null}
            };
        case "temperature":
            return {
                labels: {
                    format: "{value} °C",
                    style: {color}
                },
                opposite: true,
                gridLineWidth: 0,
                title: {text: null}
            };
        case "humidity":
            return {
                labels: {
                    format: "{value} %",
                    style: {color}
                },
                opposite: true,
                title: {text: null}
            };
        case "illuminance":
            return {
                labels: {
                    format: "{value} Lux",
                    style: {color}
                },
                opposite: true,
                title: {text: null}
            };
        case "co2":
            return {
                labels: {
                    format: "{value} ppm",
                    style: {color}
                },
                opposite: true,
                title: {text: null}
            };
        default:
            return {};
    }
}
