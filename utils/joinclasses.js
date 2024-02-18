var jc = function () {
    var s = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        s[_i] = arguments[_i];
    }
    return s.filter(function (val) { return !!val; }).join(' ');
};

export { jc };
//# sourceMappingURL=joinclasses.js.map
