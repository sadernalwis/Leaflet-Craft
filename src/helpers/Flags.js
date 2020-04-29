import { DomUtil } from 'leaflet';
import { edgesKey, modesKey, instanceKey, notifyDeferredKey, polygons } from '../FreeDraw';
import { classesFor } from './Layer';

/**
 * @constant NONE
 * @type {Number}
 */
export const NONE = 0;



/**
 * @constant CREATE
 * @type {Number}
 */
export const CREATE = 1;

/**
 * @constant EDIT
 * @type {Number}
 */
export const EDIT = 2;

/**
 * @constant DELETE
 * @type {Number}
 */
export const DELETE = 4;

/**
 * @constant APPEND
 * @type {Number}
 */
export const APPEND = 8;

/**
 * @constant DELETEMARKERS
 * @type {Number}
 */
export const DELETEMARKERS = 16;

/**
 * @constant DELETEPOINT
 * @type {Number}
 */
export const DELETEPOINT = 32;

export const DISTANCE_FLAG = 64;

/**
 * @constant EDIT_APPEND
 * @type {Number}
 */
export const EDIT_APPEND = EDIT | APPEND;

/**
 * @constant ALL
 * @type {number}
 */
export const ALL = CREATE | EDIT | DELETE | APPEND | DELETEMARKERS | DELETEPOINT;

/**
 * @method modeFor
 * @param {Object} map
 * @param {Number} mode
 * @param {Object} options
 * @return {Number}
 */
export const modeFor = (map, mode, options) => {

    // Update the mode.
    map[modesKey] = mode;

    // Fire the updated mode.
    map[instanceKey].fire('mode', { mode });

    // Disable the map if the `CREATE` mode is a default flag.
    (mode & CREATE) ? (map.dragging.disable(),
    map.touchZoom.enable(),
    map.doubleClickZoom.enable(),
    map.scrollWheelZoom.enable()) : (mode & DELETEMARKERS ? (map.dragging.disable(),
    map.touchZoom.disable(),
    map.doubleClickZoom.disable(),
    map.scrollWheelZoom.disable()) : (mode & DISTANCE_FLAG) ? (map.dragging.disable(),
    map.touchZoom.disable(),
    map.doubleClickZoom.disable(),
    map.scrollWheelZoom.disable()) :  (map.dragging.enable(),
    map.touchZoom.enable(),
    map.doubleClickZoom.enable(),
    map.scrollWheelZoom.enable()));

    Array.from(polygons.get(map)).forEach(polygon => {

        polygon[edgesKey].forEach(edge => {

            // Modify the edge class names based on whether edit mode is enabled.
            ((mode & DELETEPOINT) || (mode & EDIT)) ? DomUtil.removeClass(edge._icon, 'disabled') : DomUtil.addClass(edge._icon, 'disabled');

        });

    });

    // Apply the conditional class names to the map container.
    classesFor(map, mode);

    // Fire the event for having manipulated the polygons if the `hasManipulated` is `true` and the
    // `notifyAfterEditExit` option is equal to `true`, and then reset the `notifyDeferredKey`.
    options && options.notifyAfterEditExit && map[notifyDeferredKey]();
    map[notifyDeferredKey] = () => {};

    return mode;

};
