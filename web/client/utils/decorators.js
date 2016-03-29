'use strict';

import galt from 'data/index.js'

Object.defineProperty(exports, '__esModule', {
    value: true
});

function isFunction(x) {
    return typeof x === 'function';
};

function isPojo(target) {
    var Ctor = target.constructor;
    return !!target && typeof target === 'object' && Object.prototype.toString.call(target) === '[object Object]' && isFunction(Ctor) && (Ctor instanceof Ctor || target.type === 'AltStore');
}

function isPromise(obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function eachObject(f, o) {
    o.forEach(function (from) {
        Object.keys(Object(from)).forEach(function (key) {
            f(key, from[key]);
        });
    });
}

function assign(target) {
    for (var _len = arguments.length, source = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        source[_key - 1] = arguments[_key];
    }

    eachObject(function (key, value) {
        return target[key] = value;
    }, source);
    return target;
}


/* istanbul ignore next */
function NoopClass() {}
var builtInProto = Object.getOwnPropertyNames(NoopClass.prototype);

function addMeta(description, decoration) {
    description.value.alt = description.value.alt || {};
    (0, assign)(description.value.alt, decoration);
    return description;
}

function decorate(context) {
    context = context || galt;
    return function (Store) {
        var proto = Store.prototype;
        var publicMethods = {};
        var bindListeners = {};

        Object.getOwnPropertyNames(proto).forEach(function (name) {
            if (builtInProto.indexOf(name) !== -1) return;

            var meta = proto[name].alt;
            if (!meta) {
                return;
            }

            /* istanbul ignore else */
            if (meta.actions) {
                bindListeners[name] = meta.actions;
            } else if (meta.actionsWithContext) {
                bindListeners[name] = meta.actionsWithContext(context);
            } else if (meta.publicMethod) {
                publicMethods[name] = proto[name];
            }
        });

        Store.config = (0, assign)({
            bindListeners: bindListeners,
            publicMethods: publicMethods
        }, Store.config);

        return Store;
    };
}

function createActions(alt) {
    alt = alt || galt;
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return function (Actions) {
        return alt.createActions.apply(alt, [Actions, {}].concat(args));
    };
}

function createStore(alt) {
    alt = alt || galt;
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
    }

    return function (Store) {
        return alt.createStore.apply(alt, [decorate(alt)(Store), undefined].concat(args));
    };
}

function bind() {
    for (var _len3 = arguments.length, actionIds = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        actionIds[_key3] = arguments[_key3];
    }

    return function (obj, name, description) {
        return addMeta(description, { actions: actionIds });
    };
}

function bindWithContext(fn) {
    return function (obj, name, description) {
        return addMeta(description, { actionsWithContext: fn });
    };
}

function expose(obj, name, description) {
    return addMeta(description, { publicMethod: true });
}

function datasource() {
    var source = assign.apply(undefined, arguments);
    return function (Store) {
        Store.config = (0, assign)({ datasource: source }, Store.config);
        return Store;
    };
}

/**
 * @copyright 2015, Andrey Popp <8mayday@gmail.com>
 *
 * The decorator may be used on classes or methods
 * ```
 * @autobind
 * class FullBound {}
 *
 * class PartBound {
 *     @autobind
 *     method () {}
 * }
 * ```
 */
function autobind(...args) {
    if (args.length === 1) {
        return boundClass(...args);
    } else {
        return boundMethod(...args);
    }
}

/**
 * Use boundMethod to bind all methods on the target.prototype
 */
function boundClass(target) {
    // (Using reflect to get all keys including symbols)
    let keys;
    // Use Reflect if exists
    if (typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function') {
        keys = Reflect.ownKeys(target.prototype);
    } else {
        keys = Object.getOwnPropertyNames(target.prototype);
        // use symbols if support is provided
        if (typeof Object.getOwnPropertySymbols === 'function') {
            keys = keys.concat(Object.getOwnPropertySymbols(target.prototype));
        }
    }

    keys.forEach(key => {
        // Ignore special case target method
        if (key === 'constructor') {
            return;
        }

        let descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);

        // Only methods need binding
        if (typeof descriptor.value === 'function') {
            Object.defineProperty(target.prototype, key, boundMethod(target, key, descriptor));
        }
    });
    return target;
}

/**
 * Return a descriptor removing the value and returning a getter
 * The getter will return a .bind version of the function
 * and memoize the result against a symbol on the instance
 */
function boundMethod(target, key, descriptor) {
    let fn = descriptor.value;

    if (typeof fn !== 'function') {
        throw new Error(`@autobind decorator can only be applied to methods not: ${typeof fn}`);
    }

    return {
        configurable: true,
        get() {
            if (this === target.prototype || this.hasOwnProperty(key)) {
                return fn;
            }

            let boundFn = fn.bind(this);
            Object.defineProperty(this, key, {
                value: boundFn,
                configurable: true,
                writable: true
            });
            return boundFn;
        }
    };
}

exports.decorate = decorate;
exports.createActions = createActions;
exports.createStore = createStore;
exports.bind = bind;
exports.bindWithContext = bindWithContext;
exports.expose = expose;
exports.datasource = datasource;

exports.Actions = createActions;
exports.Store = createStore;
exports.Handles = bind;
exports.Event = autobind;
