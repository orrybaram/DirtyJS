/* jshint globalstrict: true */
'use strict';

function initWatchVal() {};

function Scope() {
    this.$$watchers = [];
}

Scope.prototype.$watch = function(watchFn, listenerFn) {
    var watcher = {
        watchFn: watchFn,
        listenerFn: listenerFn || function() {},
        last: initWatchVal
    }
    this.$$watchers.push(watcher);
};

Scope.prototype.$$digestOnce = function() {
    var self = this;
    var newValue, oldValue, dirty;
    this.$$watchers.forEach(function(watcher) {

        oldValue = watcher.last;
        newValue = watcher.watchFn(self);

        if (oldValue !== newValue) {
            watcher.last = newValue;
            watcher.listenerFn(
                newValue, (oldValue === initWatchVal ? newValue : oldValue),
                self
            );
            dirty = true;
        }
    })
    return dirty;
}

Scope.prototype.$digest = function() {
    var dirty;
    var ttl = 10;
    do {
        dirty = this.$$digestOnce();
        if(dirty && !(ttl--)) {
        	throw "10 digest iterations reached"
        }
    } while (dirty);

    

};
