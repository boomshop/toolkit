 /* toolkit provides different widgets, implements and modules for 
 * building audio based applications in webbrowsers.
 * 
 * Invented 2013 by Markus Schmidt <schmidt@boomshop.net>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General
 * Public License along with this program; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, 
 * Boston, MA  02110-1301  USA
 */
"use strict";
(function(w){
function dragstart(e, drag) {
    var O = this.options;
    if (!O.active) return;
    if (typeof e.button != "undefined" && e.button > 0) return;
    this._xstart = e.pageX;
    this._ystart = e.pageY;
    this._xpos   = O.element.offsetLeft;
    this._ypos   = O.element.offsetTop;
    TK.add_class(O.element, "toolkit-dragging");
    /* @event: dragstart; DOMEvent, Widget; The user starts dragging this item */
    this.fire_event("dragstart", e);
}
function dragend(e, drag) {
    if (!this.options.active) return;
    if (typeof e.button != "undefined" && e.button > 0) return;
    /* @event: dragstop; DOMEvent, Widget; The user ends dragging this item */
    this.fire_event("dragstop", e);
}
function dragging(e, drag) {
    var O = this.options;
    if (!O.active) return;
    if (typeof e.button != "undefined" && e.button > 0) return;
    var x = this._xpos + e.pageX - this._xstart;
    var y = this._ypos + e.pageY - this._ystart;
    if (O.min.x !== false) x = Math.max(O.min.x, x);
    if (O.max.x !== false) x = Math.min(O.max.x, x);
    if (O.min.y !== false) y = Math.max(O.min.y, y);
    if (O.max.y !== false) y = Math.min(O.max.y, y);
    O.element.style.top = y + "px";
    O.element.style.left = x + "px";
    TK.remove_class(O.element, "toolkit-dragging");
    /* @event: dragging; DOMEvent, Widget; The user is dragging this item */
    this.fire_event("dragging", e, x, y);
}
function set_handle() {
    var h = this.options.handle;
    if (this.drag)
        this.drag.destroy();
    var range = new Range({});
    this.drag = new DragValue({
        element: h,
        range: function () { return range; },
        onStartdrag  : this._dragstart,
        onStopdrag   : this._dragend,
        onDragging   : this._dragging
    });
}
w.Drag = $class({
    /* @class: Drag
     * @description: Drag enables dragging of absolutely positioned
     * elements on the screen.
     * @option: element; DOMNode; undefined; The element to drag
     * @option: handle; DOMNode|Bool; undefined; A DOM node to be used as a handle. If not set the element is used.
     * @option: active; Bool; true; Enable or disable dragging
     * @option: min; Object; {x: -1, y: -1}; Object containing x and y determining the minimum position. A value of false means no minimum.
     * @option: max; Object; {x: -1, y: -1}; Object containing x and y determining the maximum position. A value of false means no maximum.
     * @extends: Widget */
    _class: "Drag",
    Extends: Widget,
    options: {
        element   : null,
        handle    : null,
        active    : true,
        min       : {x: -1, y: -1},
        max       : {x: -1, y: -1}
    },
    initialize: function (options) {
        Widget.prototype.initialize.call(this, options);
        this._dragging = dragging.bind(this);
        this._dragstart = dragstart.bind(this);
        this._dragend = dragend.bind(this);
        this.set("handle", this.options.handle);
    },
    // GETTERS & SETTERS
    set: function (key, value) {
        if (key === "handle" && !value)
            value = this.options.element;

        Widget.prototype.set.call(this, key, value);

        if (key === "handle") set_handle.call(this);
    }
});
})(this);
