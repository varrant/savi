/**
 * events
 * @author ydr.me
 * @create 2016-04-18 13:50
 */

'use strict';

var Class =  require('blear.classes.class');
var typeis = require('blear.utils.typeis');
var array =  require('blear.utils.array');
var object = require('blear.utils.object');
var access = require('blear.utils.access');

var reBlank = /\s+/g;

/**
 * 遍历事件名称
 * @param ev
 * @param fn
 */
var eachEvents = function (ev, fn) {
    var evs = ev.split(reBlank);

    array.map(evs, fn);
};
var defaults = {};
var ONCE_TIME_LISTENER_KEY = '__classes/events.once__';

var Events = Class.extend({
    className: 'Events',
    constructor: function () {
        var the = this;

        Events.parent(the);
        the[_listeners] = {};
    },


    /**
     * 监听事件
     * @param ev {String} 事件名称，使用空格区分多个事件名
     * @param fn {Function} 回调函数
     * @returns {Events}
     */
    on: function (ev, fn) {
        var the = this;

        eachEvents(ev, function (_ev) {
            the[_addEventListener](_ev, fn);
        });

        return the;
    },


    /**
     * 一次性监听
     * @param ev {String} 事件名称，使用空格区分多个事件名
     * @param fn {Function} 回调函数
     * @returns {Events}
     */
    once: function (ev, fn) {
        var the = this;

        eachEvents(ev, function (_ev) {
            fn[ONCE_TIME_LISTENER_KEY] = true;
            the[_addEventListener](_ev, fn);
        });

        return the;
    },


    /**
     * 取消事件监听
     * @param ev {String} 事件名称，使用空格区分多个事件名
     * @param [fn] {Function} 回调函数，函数回空移除所有回调
     * @returns {Events}
     */
    un: function (ev, fn) {
        var the = this;

        eachEvents(ev, function (_ev) {
            the[_removeEventListener](_ev, fn);
        });

        return the;
    },


    /**
     * 触发事件
     * @param ev {String} 事件名称，使用空格区分多个事件名
     * @returns {Boolean}
     */
    emit: function (ev/*arguments*/) {
        var the = this;
        var args = access.args(arguments).slice(1);
        var emitResult = true;

        // 必须同步运行
        eachEvents(ev, function (_ev) {
            var _emitResult = the[_emitEvent](_ev, args);

            if (_emitResult === false && emitResult === true) {
                emitResult = false;
            }
        });

        return emitResult;
    },


    /**
     * 获取事件监听的长度
     * @param [ev] {String} 可以指定一个事件
     * @returns {number}
     */
    size: function (ev) {
        var the = this;
        var size = 0;

        object.each(the[_listeners], function (_ev, listeners) {
            if (ev) {
                if (ev === _ev) {
                    size += listeners.length;
                    return false;
                }
            } else {
                size += listeners.length;
            }
        });

        return size;
    },


    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        the[_listeners] = {};
    }
});

var _listeners = Events.sole();
var _addEventListener = Events.sole();
var _removeEventListener = Events.sole();
var _emitEvent = Events.sole();
var pro = Events.prototype;

/**
 * addEventListener
 * @param ev
 * @param fn
 */
pro[_addEventListener] = function (ev, fn) {
    var the = this;

    if (typeis.Function(fn)) {
        var listeners = the[_listeners][ev] = the[_listeners][ev] || [];
        listeners.push(fn);
    }
};

/**
 * removeEventListener
 * @param ev
 * @param [fn]
 */
pro[_removeEventListener] = function (ev, fn) {
    var the = this;
    var listeners = the[_listeners][ev];

    if (!listeners) {
        return;
    }

    if (!fn) {
        the[_listeners][ev] = [];
        return;
    }

    array.each(listeners, function (index, listener) {
        if (listener === fn) {
            listeners.splice(index, 1);
            return false;
        }
    });
};


/**
 * emitEvent
 * @param ev
 * @param args
 */
pro[_emitEvent] = function (ev, args) {
    var the = this;
    var listeners = the[_listeners][ev];
    var emitResult = true;

    if (!listeners) {
        return emitResult;
    }

    array.each(listeners, function (index, listener) {
        // 这种情况应该不会发生
        // if (!listener) {
        //     return;
        // }

        // once listener
        if (listener[ONCE_TIME_LISTENER_KEY]) {
            listeners.splice(index, 1);
        }

        var _emitResult = listener.apply(the, args);

        if (_emitResult === false && emitResult === true) {
            emitResult = false;
        }
    });

    return emitResult;
};

Events.defaults = defaults;
module.exports = Events;