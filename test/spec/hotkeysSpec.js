var Marionette = require('backbone.marionette'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    Hotkeys = require('../../behave-ui-hotkeys'),
    viewDefaults,
    View;

viewDefaults = {
    template: _.template('<h1>Hotkeys Behavior</h1>'),
    model: new Backbone.Model(),
    behaviors: {
        Hotkeys: {
            behaviorClass: Hotkeys,
            hotkeys: {
                 'delete': 'destroy',
                 'ctrl:cmd:s': 'save',
                 'ctrl:o': 'openFilePicker'
            }
        }
    },
    save: function() { this.model.save(); },
    openFilePicker: function(e) { e.preventDefault(); }
};

View = Marionette.ItemView.extend(viewDefaults);

describe('Hotkeys Behavior', function() {
    var behavior;

    beforeEach(function() {
        this.view = new View({ model: new Backbone.Model() });
        behavior = this.view._behaviors[0];
    });

    it('has a `hotkeys` property that is a hash of hotkeys and correspsonding view methods',
            function() {

        expect(behavior.options.hotkeys).toBeDefined();
        expect(_.isObject(behavior.options.hotkeys)).toBeTruthy();
    });

    it('has a `attachToDocument` property that determines whether or not the event should be attached to the view or the document',
            function() {

        expect(behavior.options.attachToDocument).toBeDefined();
        expect(_.isObject(behavior.options.attachToDocument)).toBeFalsy();
    });

    it('has a `_buildHotkeyCache` method that is called on initialize',
            function() {

        expect(behavior._buildHotkeyCache).toBeDefined();
    });

    describe('the `_buildHotkeyCache` method', function() {
        var expected;

        beforeEach(function() {
            expected = {
                hotkey: 'ctrl:cmd:s',
                method: 'save',
                ctrl: true,
                cmd: true,
                shift: false,
                alt: false,
                code: 83
            };
        });

        it('will create a `hotkeys` property that stores all the hotkeys', function() {
            expect(behavior.hotkeys).toBeDefined();
            expect(_.isArray(behavior.hotkeys)).toBeTruthy();
            expect(behavior.hotkeys[1]).toEqual(expected);
        });
    });

    it('has a `_processHotkeys` method that is called on it\'s view\'s keydown event',
            function() {

        expect(behavior._processHotkeys).toBeDefined();
    });

    describe('the `_processHotkeys` method', function() {
        var evt;

        beforeEach(function() {
            evt = {
                which: 83,
                metaKey: true,
                ctrlKey: true,
                altKey: false,
                shiftKey: false
            };
        });

        it('will trigger a view event who\'s namespace matches the hotkey combo',
                function() {

            spyOn(this.view, 'trigger');
            spyOn(this.view.model, 'save');
            behavior._processHotkeys(evt);
            expect(this.view.trigger).toHaveBeenCalledWith('hotkey:ctrl:cmd:s');
        });

        it('will call a view method if one was specified in the hash, and pass in the event',
                function() {

            spyOn(this.view, 'save');
            spyOn(this.view.model, 'save');
            behavior._processHotkeys(evt);
            expect(this.view.save).toHaveBeenCalledWith(evt);
        });
    });

    describe('events attached to `document`', function() {
        var viewOptions,
            DocumentView,
            evt;

        viewOptions = _.clone(viewDefaults);
        viewOptions.behaviors.Hotkeys.attachToDocument = true;
        DocumentView = Marionette.ItemView.extend(viewOptions);
        evt = {
            which: 79,
            metaKey: false,
            ctrlKey: true,
            altKey: false,
            shiftKey: false
        };

        beforeEach(function() {
            this.view = new DocumentView({ model: new Backbone.Model() });
            this.view.render();
        });

        it('will call the event callback after rendering', function() {
            spyOn(this.view, 'openFilePicker');
            Backbone.$(document).trigger(Backbone.$.Event('keydown', evt));
            expect(this.view.openFilePicker).toHaveBeenCalled();
        });

        it('will not call the event callback after destroying', function() {
            spyOn(this.view, 'openFilePicker');
            this.view.destroy();
            Backbone.$(document).trigger(Backbone.$.Event('keydown', evt));
            expect(this.view.openFilePicker).not.toHaveBeenCalled();
        });
    });
});
