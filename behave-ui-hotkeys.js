/**
 * Behave-ui-hotkeys
 * - A Marionette behavior to allow easy definitions of hotkeys on a view
 */

(function (factory) {

  // Set up the behavior appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone', 'backbone.marionette'], factory);
  }

  // Next for Node.js or CommonJS.
  else if (typeof exports === 'object') {
    module.exports = factory(require('underscore'), require('backbone'), require('backbone.marionette'));
  }

  // Finally, as a browser global.
  else {
    window.Hotkeys = factory(_, Backbone, Marionette);
  }

}(function (_, Backbone, Marionette) {
    'use strict';

    var Hotkeys, keyMap, lookup;

    Hotkeys = Marionette.Behavior.extend({
        defaults: {
            hotkeys: {},
            attachToDocument: false
        },
        events: function() {
            var events = {};
            if (!this.options.attachToDocument) {
                events = { 'keydown': '_processHotkeys' };
            }
            return events;
        },
        initialize: function() {
            var errorMessage;

            if (!_.isObject(this.options.hotkeys)) {
                errorMessage = 'behave-ui-hotkeys :: hotkeys option must be an object';
                throw new Error(errorMessage);
            }

            this.hotkeys = [];
            _(this.options.hotkeys).each(this._buildHotkeyCache.bind(this));
        },
        onRender: function() {
            if (this.options.attachToDocument) {
                this._processHotkeys = this._processHotkeys.bind(this);
                Backbone.$(document).on('keydown', this._processHotkeys);
            }

            // make non-focusable elements focusable
            if (!/(input|textarea|select)/.test(this.view.el.tagName.toLowerCase())) {
                this.view.$el
                    .attr('tabindex', 0)
                    .css('outline', '0px solid transparent');
            }
        },
        _processHotkeys: function(e) {
            var data = {
                code: e.which,
                cmd: e.metaKey,
                ctrl: e.ctrlKey,
                alt: e.altKey,
                shift: e.shiftKey
            };

            _.chain(this.hotkeys)
                .filter(function(hk) {
                    return data.code === hk.code &&
                                data.cmd === hk.cmd &&
                                data.ctrl === hk.ctrl &&
                                data.alt === hk.alt &&
                                data.shift === hk.shift;
                }.bind(this))
                .each(function(hk) {
                    this.view.trigger('hotkey:' + hk.hotkey);
                    if (this.view[hk.method]) this.view[hk.method](e);
                }.bind(this));
        },
        _buildHotkeyCache: function(method, hotkey) {
            var cmd = false,
                ctrl = false,
                alt = false,
                shift = false,
                errorMessage = 'behave-ui-hotkeys :: invalid hotkey(s)',
                code;

            hotkey = hotkey.toLowerCase().trim();
            _(hotkey.split(':')).each(function(k) {
                switch (k) {
                    case 'cmd':
                        cmd = true;
                        break;
                    case 'ctrl':
                        ctrl = true;
                        break;
                    case 'alt':
                        alt = true;
                        break;
                    case 'shift':
                        shift = true;
                        break;
                    default:
                        code = lookup(k);
                        break;
                }
            });

            this.hotkeys.push({
                hotkey: hotkey,
                method: method,
                code: code,
                cmd: cmd,
                ctrl: ctrl,
                alt: alt,
                shift: shift
            });
        },
        onBeforeDestroy: function() {
            if (this.options.attachToDocument) {
                Backbone.$(document).off('keydown', this._processHotkeys);
            }
        }
    });


    keyMap = {
        "backspace" : 8,
        "tab"       : 9,
        "enter"     : 13,
        "return"    : 13,
        "pause"     : 19,
        "esc"       : 27,
        "space"     : 32,
        "pageup"    : 33,
        "pagedown"  : 34,
        "end"       : 35,
        "home"      : 36,
        "left"      : 37,
        "up"        : 38,
        "right"     : 39,
        "down"      : 40,
        "delete"    : 46,
        "0"         : 48,
        "1"         : 49,
        "2"         : 50,
        "3"         : 51,
        "4"         : 52,
        "5"         : 53,
        "6"         : 54,
        "7"         : 55,
        "8"         : 56,
        "9"         : 57,
        "a"         : 65,
        "b"         : 66,
        "c"         : 67,
        "d"         : 68,
        "e"         : 69,
        "f"         : 70,
        "g"         : 71,
        "h"         : 72,
        "i"         : 73,
        "j"         : 74,
        "k"         : 75,
        "l"         : 76,
        "m"         : 77,
        "n"         : 78,
        "o"         : 79,
        "p"         : 80,
        "q"         : 81,
        "r"         : 82,
        "s"         : 83,
        "t"         : 84,
        "u"         : 85,
        "v"         : 86,
        "w"         : 87,
        "x"         : 88,
        "y"         : 89,
        "z"         : 90,
        "+"         : 107,
        "-"         : 109,
        "f1"        : 112,
        "f2"        : 113,
        "f3"        : 114,
        "f4"        : 115,
        "f5"        : 116,
        "f6"        : 117,
        "f7"        : 118,
        "f8"        : 119,
        "f9"        : 120,
        "f10"       : 121,
        "f11"       : 122,
        "f12"       : 123
    };

    lookup = function(hotkey) {
        return hotkey && keyMap[hotkey];
    };

  return Hotkeys;

}));
