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
function visibility_change() {
    if (document.hidden) {
        this.hide();
    } else {
        this.show();
    }
}
function resized() {
    if (!this.resize_event) {
        this.resize_event = true;
        TK.S.add(this.resize.bind(this));
    }
}
w.Root = $class({
    Extends: Container,
    initialize: function (options) {
        Container.prototype.initialize.call(this, options);
        this._resize_cb = resized.bind(this);
        this._visibility_cb = visibility_change.bind(this);
        this.resize_event = false;
        w.addEventListener("resize", this._resize_cb);
        document.addEventListener("visibilitychange", this._visibility_cb, false)
    },
    initialized: function () {
        Container.prototype.initialized.call(this);
        if (!document.hidden) this.show();
    },
    resize: function() {
        this.resize_event = false;
        Container.prototype.resize.call(this);
    },
    destroy: function () {
        Container.prototype.destroy.call(this);
        w.removeEventListener("resize", this._resize_cb);
        document.removeEventListener("visibilitychange", this._visibility_cb)
        this._resize_cb = this._visibility_cb = 0;
    },
});
})(this);
