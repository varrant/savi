/**
 * 对象相关
 * @author 云淡然
 * @updated 2016年11月26日15:47:34
 */


'use strict';

var typeis = require('blear.utils.typeis');

/**
 * 返回对象的键名
 * @param obj {object} 对象
 * @returns {Array}
 */
exports.keys = function (obj) {
    return Object.keys(obj);
};


/**
 * 判断是否为纯对象
 * @ref jquery@1.x
 * @param obj
 * @returns {boolean}
 */
exports.isPlain = function (obj) {
    if (!obj || !typeis.Object(obj)) {
        return false;
    }

    try {
        for (var key in obj) {
            if (!hasOwn(obj, key)) {
                return false;
            }
        }
    }
    catch (e) {
        /* istanbul ignore next */
        return false;
    }

    return true;
};


/**
 * 判断对象是否有自身属性，即静态属性
 * @param object {Object} 对象
 * @param key {String} 键名
 * @returns {boolean}
 */
var hasOwn = exports.hasOwn = function (object, key) {
    // 因为 Object.create(null) 返回的对象是没有原型的，
    // 所以必须使用 Object.prototype.hasOwnProperty 来进行判断
    return Object.prototype.hasOwnProperty.call(object, key);
};


/**
 * 对象的遍历
 * @param object {*} 待遍历对象
 * @param callback {Function} 遍历回调，返回 false 时退出遍历
 * @returns {*}
 */
var each = exports.each = function (obj, callback) {
    for (var i in obj) {
        if (hasOwn(obj, i)) {
            if (callback.call(obj[i], i, obj[i]) === false) {
                break;
            }
        }
    }

    return obj;
};


/**
 * 定义一个对象的属性
 * @type {Function}
 * @param obj
 * @param key
 * @param desc
 */
var define = exports.define = function (obj, key, desc) {
    if (typeis.Object(key)) {
        each(key, function (_key, _desc) {
            define(obj, _key, _desc);
        });
    } else if (typeis.String(key)) {
        desc = supply(desc, defineDefaults);

        // 不能同时有 set 和 writable
        if (desc.set && desc.writable) {
            delete desc.writable;
        }

        Object.defineProperty(obj, key, desc);
    }
};


var defineDefaults = define.defaults = {
    /**
     * 能否重写
     * @type Boolean
     */
    writable: true,

    /**
     * 能否枚举
     * @type Boolean
     */
    enumerable: false,

    /**
     * 能否配置，能否被删除
     * @type Boolean
     */
    configurable: true
};


/**
 * 对象的 map
 * @param obj {*} 待遍历对象
 * @param callback {Function} 遍历回调
 * @returns {*}
 */
exports.map = function (obj, callback) {
    var obj2 = {};

    each(obj, function (key, val) {
        obj2[key] = callback(val, key);
    });

    return obj2;
};


/**
 * 对象的 filter
 * @param obj {*} 待遍历对象
 * @param callback {Function} 遍历回调，返回 true 被筛选
 * @returns {*}
 */
exports.filter = function filter(obj, callback) {
    var obj2 = {};

    each(obj, function (key, val) {
        if (callback.call(val, val, key)) {
            obj2[key] = val;
        }
    });

    return obj2;
};


/**
 * 对象分配，将目标不为 undefined 的属性分配到 source 上
 * @param [_deep=false] {Boolean} 是否深度
 * @param _source
 * @param _target
 */
exports.assign = function assign(_deep, _source, _target) {
    var args = arguments;
    var length = args.length;
    var current = 0;
    var i;
    var obj;
    var sourceType;
    var objType;
    var deep = false;

    if (typeis.Boolean(args[0])) {
        current++;
        deep = args[0];
    } else {
        deep = false;
    }

    var source = args[current++];

    for (; current < length; current++) {
        obj = args[current];
        for (i in obj) {
            if (hasOwn(obj, i) && !typeis.Undefined(obj[i])) {
                sourceType = typeis(source[i]);
                objType = typeis(obj[i]);

                if (objType === 'object' && deep) {
                    source[i] = sourceType !== objType ? {} : source[i];
                    assign(deep, source[i], obj[i]);
                } else if (objType === 'array' && deep) {
                    source[i] = sourceType !== objType ? [] : source[i];
                    assign(deep, source[i], obj[i]);
                }
                // 赋值条件：target 不为 undefined
                else {
                    source[i] = obj[i];
                }
            }
        }
    }

    return source;
};


/**
 * 对象补充，将目标不为 undefined 的属性分配到 source 为 undefined 上
 * @param [_deep=false] {Boolean} 是否深度
 * @param _source
 * @param _target
 */
var supply = exports.supply = function supply(_deep, _source, _target) {
    var args = arguments;
    var length = args.length;
    var current = 0;
    var i;
    var obj;
    var sourceType;
    var objType;
    var deep = false;

    if (typeis.Boolean(args[0])) {
        current++;
        deep = args[0];
    } else {
        deep = false;
    }

    var source = args[current++];

    for (; current < length; current++) {
        obj = args[current];
        for (i in obj) {
            if (hasOwn(obj, i) && !typeis.Undefined(obj[i])) {
                sourceType = typeis(source[i]);
                objType = typeis(obj[i]);

                if (objType === 'object' && deep) {
                    source[i] = sourceType !== objType ? {} : source[i];
                    supply(deep, source[i], obj[i]);
                } else if (objType === 'array' && deep) {
                    source[i] = sourceType !== objType ? [] : source[i];
                    supply(deep, source[i], obj[i]);
                }
                // 赋值条件：source 为 undefined
                else if (typeis.Undefined(source[i])) {
                    source[i] = obj[i];
                }
            }
        }
    }

    return source;
};