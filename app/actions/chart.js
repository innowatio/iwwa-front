export const SELECT_SINGLE_SITE = "SELECT_SINGLE_SITE";
export const SELECT_TYPE = "SELECT_TYPE";
export const SELECT_ENVIRONMENTAL = "SELECT_ENVIRONMENTAL";
export const SELECT_SOURCES = "SELECT_SOURCES";
export const SELECT_MULTIPLE_SITE = "SELECT_MULTIPLE_SITE";
export const SELECT_DATE_RANGES = "SELECT_DATE_RANGES";
export const SELECT_DATA_RANGES_COMPARE = "SELECT_DATA_RANGES_COMPARE";
export const REMOVE_ALL_COMPARE = "REMOVE_ALL_COMPARE";

/**
*   A click on select-tree component for the choice of site
*   @param {string} site - id site of the site
*/
export function selectSingleSite (siteId) {
    return {
        type: SELECT_SINGLE_SITE,
        payload: siteId
    };
}

/**
*   A click on button select component for the choice of type
*   @param {object} type - data type
*/
export function selectType (type) {
    return {
        type: SELECT_TYPE,
        payload: type
    };
}

/**
*   A click on select environmental component for the choice of environmental
*   variable
*   @param {object} type - environmental variable
*/
export function selectEnvironmental (type) {
    return {
        type: SELECT_ENVIRONMENTAL,
        payload: type
    };
}

/**
*   A click on select source button
*   @param {object} source - source of the data
*/
export function selectSource (sources) {
    return {
        type: SELECT_SOURCES,
        payload: sources
    };
}

/**
*   A click on select source button
*   @param {object} source - source of the data
*/
// export function selectSourceCompare (sources) {
//     return {
//         type: SELECT_SOURCES,
//         payload: sources
//     };
// }

/**
*   A click on site-compare-modal
*   @param {array} sites - id site of the two sites
*/
export function selectMultipleSite (sitesId) {
    return {
        type: SELECT_MULTIPLE_SITE,
        payload: sitesId
    };
}

/**
*   A click on dateFilter modal
*   @param {object: {start, end}} dateRanges - range of the date
*/
export function selectDateRanges (dateRanges) {
    return {
        type: SELECT_DATE_RANGES,
        payload: dateRanges
    };
}

/**
*   A click on date-compare-modal modal
*   @param {object: {start, end}} dateRanges - beginning date for the two temporal range and
*       temporal period to visualize.
*
*/
export function selectDateRangesCompare (dateRanges) {
    return {
        type: SELECT_DATA_RANGES_COMPARE,
        payload: dateRanges
    };
}

export function removeAllCompare () {
    return {
        type: REMOVE_ALL_COMPARE
    };
}
