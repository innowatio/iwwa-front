import {Map} from "immutable";

export default function mergeSiteSensors (site, sensors) {
    const siteJS = site.toJS();
    return {
        ...siteJS,
        sensors: (siteJS.sensors || []).map((siteNode) => iteratedDecoration(siteNode, sensors))
    };
}


function iteratedDecoration (siteNode, sensors) {
    if (!siteNode) {
        return ;
    } else if (siteNode.children) {
        return {
            ...siteNode,
            ...(sensors.get(siteNode.id, Map())).toJS(),
            children: siteNode.children.map((child) => iteratedDecoration(child, sensors))
        };
    } else {
        return {
            ...siteNode,
            ...(sensors.get(siteNode.id, Map())).toJS()
        };
    }
}
