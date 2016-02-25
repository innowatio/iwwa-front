export function allSensorsDecorator (theme) {
    return consumptionSensors(theme).concat(electricalSensors);
}

export const consumptionSensors = ({colors}) => [
    {
        label: "CO2",
        color: colors.co2,
        key: "co2",
        icon: "co2",
        iconColor: colors.iconSensors,
        iconClass: "co2",
        type: "co2",
        unit: "ppm"
    }, {
        label: "Umidità",
        color: colors.humidity,
        key: "humidity",
        icon: "humidity",
        iconClass: "humidity",
        iconColor: colors.iconSensors,
        type: "thl",
        unit: "%"
    }, {
        label: "Lux",
        color: colors.illuminance,
        key: "illuminance",
        icon: "lightbulb",
        iconColor: colors.iconSensors,
        iconClass: "lightbulb",
        type: "thl",
        unit: "lx"
    }, {
        label: "Temperatura",
        color: colors.temperature,
        iconColor: colors.iconSensors,
        iconClass: "thermometer",
        key: "temperature",
        icon: "thermometer",
        type: "thl",
        unit: "°C"
    }
];

export const electricalSensors = [
    {
        key: "activeEnergy",
        type: "pod",
        unit: "kWh"
    }, {
        key: "maxPower",
        type: "pod",
        unit: "kW"
    }, {
        key: "reactiveEnergy",
        type: "pod",
        unit: "kVARh"
    }, {
        key: "activeEnergy",
        type: "pod-anz",
        unit: "kWh"
    }, {
        key: "maxPower",
        type: "pod-anz",
        unit: "kW"
    }, {
        key: "reactiveEnergy",
        type: "pod-anz",
        unit: "kVARh"
    }
];
