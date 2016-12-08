'use strict';

var typeis = require('blear.utils.typeis');


/**
 * 判断一个对象是否为似数组
 * @ref jquery
 * @param obj {*} 待判断对象
 * @returns {Boolean}
 */
var likeArray = exports.like = function likeArray(obj) {
    // Support: iOS 8.2 (not reproducible in simulator)
    // `in` check used to prevent JIT error (gh-2145)
    // hasOwn isn't used here due to false negatives
    // regarding Nodelist length in IE
    var length = null;

    try {
        length = !!obj && "length" in obj && obj.length;
    } catch (err) {
        return false;
    }

    return typeis.Array(obj) || length === 0 ||
        typeis.Number(length) && length > 0 && ( length - 1 ) in obj;
};


/**
 * 数组的遍历
 * @param arr {*} 待遍历数组
 * @param callback {Function} 遍历回调，返回 false 时退出遍历
 * @returns {*}
 */
var each = exports.each = function (arr, callback) {
    if (!likeArray(arr)) {
        throw new TypeError(arr + ' is NOT like an array');
    }

    var i = -1,
        n = arr.length;
    while (++i < n) {
        // we iterate over sparse items since there is no way to make it
        // work properly on IE 7-8. see #64
        if (callback(i, arr[i]) === false) {
            break;
        }
    }

    return arr;
};


/**
 * 数组的 map
 * @param arr {*} 数组
 * @param callback {Function} map 回调
 * @returns {*}
 */
var map = exports.map = function (arr, callback) {
    var arr2 = [];

    each(arr, function (index, item) {
        arr2[index] = callback.call(item, item, index);
    });

    return arr2;
};


/**
 * 数组的 filter
 * @param arr {*} 数组
 * @param callback {Function} filter 回调，返回 true 被筛选
 * @returns {*}
 */
var filter = exports.filter = function (arr, callback) {
    var arr2 = [];

    each(arr, function (index, item) {
        if (callback.call(item, item, index)) {
            arr2.push(item);
        }
    });

    return arr2;
};


/**
 * 生成数组
 * @param [obj] {*} 似数组
 * @returns {Array}
 */
exports.from = function (obj) {
    var arr2 = [];

    if (!obj) {
        return arr2;
    }

    each(obj, function (index, item) {
        arr2.push(item);
    });

    return arr2;
};


/**
 * 根据索引值删除数组元素
 * @todo 不能改变原数组的引用？
 * @param arr {Array} 待删除数组
 * @param indexes {Array} 待删除的索引值
 * @returns {Array}
 */
exports.remove = function (arr, indexes) {
    var map = {};

    each(indexes, function (i, item) {
        map[item] = 1;
    });

    return filter(arr, function (item, index) {
        return !map[index];
    });
};


/**
 * 数组范围
 * @param start {Number} 起始值
 * @param end {Number} 终止值
 * @returns {Array}
 */
exports.range = function (start, end) {
    return map(new Array(end - start + 1), function (item, index) {
        return index + start;
    });
};


/**
 * 查找元素在数组中的位置
 * @param array {Array} 数组
 * @param val {*} 值
 * @param [startIndex] {Number} 起始值，默认 0
 * @returns {number|Number|*}
 */
exports.indexOf = function (array, val, startIndex) {
    return array.indexOf(val, startIndex);
};


/**
 * 遍历降维
 * @param array {Array} 数组
 * @param callback {Function} 回调
 * @param [initValue] {*} 初始值
 * @returns {*}
 */
exports.reduce = function (array, callback, initValue) {
    if (arguments.length === 2) {
        return array.reduce(callback);
    } else {
        return array.reduce(callback, initValue);
    }
};
