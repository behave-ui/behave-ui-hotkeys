# behave-ui-hotkeys
A Marionette Behavior that allows you to add hotkey functionality to any view.

## Usage:

```shell
npm install --save behave-ui-hotkeys
```

Then just require and use as you would any other behavior:

```js
var Hotkeys = require('behave-ui-hotkeys'),
    _ = require('underscore');

var View = Marionette.ItemView.extend({
    template: _.template('<h1>Hotkeys!!</h1>'),
    behaviors: {
        Hotkeys: {
            behaviorClass: Hotkeys,
            hotkeys: {
               'cmd:alt:y': 'viewMethod'
            },
            attachToDocument: false
        }
    },
    initialize: function() {
        this.on('hotkey:cmd:alt:y', function() {
            // hotkey fired!
        });
    },
    viewMethod: function(e) {
        // hotkey fired!
    }
});
```

NOTES:

 - You can use only one code (f1, 4, a, s, delete, pageup, etc), but as many helper keys (cmd, ctrl, alt, shift) as you would like
 - Codes are case insensitive, F1 will become f1, DELETE will become delete, etc...
 - If you specify a view method that does not exist, it will just call event
 - If you do not want to call a view method pass an empty string as the value, i.e.
 - If element type is not a focusable element, div, p, etc behavior adds tabindex attr to element
 - If you set `attachToDocument` to true, then behavior adds listener to document instead of root view

```js
hotkeys: {
    'ctrl:alt:o': 'open', // will fire event: 'hotkey:ctrl:alt:o', will call: this.view.open()
    'ctrl:alt:p': '' // will only fire event: 'hotkey:ctrl:alt:p', will not call any method
}
```

List of accepted codes:

- backspace
- tab
- enter
- return
- pause
- esc
- space
- pageup
- pagedown
- end
- home
- left
- up
- right
- down
- delete
- 0
- 1
- 2
- 3
- 4
- 5
- 6
- 7
- 8
- 9
- a
- b
- c
- d
- e
- f
- g
- h
- i
- j
- k
- l
- m
- n
- o
- p
- q
- r
- s
- t
- u
- v
- w
- x
- y
- z
- +
- \-
- f1
- f2
- f3
- f4
- f5
- f6
- f7
- f8
- f9
- f10
- f11
- f12

## Dev

To setup the dev environment just run `npm install`
You can then run `grunt watch` to automagically run tests and jshint

## Test

To run tests run either `npm test` or `grunt test`, former is an alias for the latter.

## Release History

- 0.0.1 - Initial Release
- 0.0.2 - Syntax highlighting added to readme
- 0.0.3 - Add focus functionality to non-focusable elements
- 0.0.4 - Clean up readme, cleaned up code
- 0.0.5 - Added `attachToDocument` functionality
- 0.0.6 - Moved from `keypress` to `keydown` event
- 0.0.7 - Moved from `keypress` to `keydown` event for `document` eventListener
- 0.0.8 - Fixed incorrect call to `tag` attribute on view el, should be `tagName`
- 0.0.9 - Changed from `onAttach` to `onRender` for attaching event handlers
- 0.0.10 - Removed duplicate dependencies
- 0.0.11 - Changed return keycode from `13` to `10`
- 0.0.12 - Revert previous change
