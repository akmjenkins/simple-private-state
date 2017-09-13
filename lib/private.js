'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var MEMBERS = new WeakMap();

var create = function create() {
	var o = void 0;
	MEMBERS.set(this, o = {});
	return o;
};

var p = void 0;
exports.default = p = {
	get: function get(name) {
		var _this = this;

		var o = MEMBERS.get(this) || create.call(this);

		if (typeof name === 'undefined') {
			return o;
		}

		if (Array.isArray(name)) {
			return name.reduce(function (carry, name) {
				carry[name] = p.get.call(_this, name);
				return carry;
			}, {});
		}

		return o[name];
	},
	set: function set(name, value) {
		var o = MEMBERS.get(this) || create.call(this);
		o[name] = value;
	},
	setObject: function setObject(object) {
		var o = void 0;
		Object.assign(o = MEMBERS.get(this) || create.call(this), object);
	}
};