"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _get = function _get(context) {
	var store = this.weakMap.get(context);
	if (!store) {
		this.weakMap.set(context, store = {});
	}
	return store;
};

var PrivateState = function () {
	function PrivateState(context) {
		_classCallCheck(this, PrivateState);

		this.weakMap = new WeakMap();
	}

	_createClass(PrivateState, [{
		key: "get",
		value: function get(context, name, def) {
			var _this = this;

			if (!name) {
				return _get.call(this, context);
			}

			if (Array.isArray(name)) {
				return name.reduce(function (c, n) {
					c[n] = _this.get(context, n);
					return c;
				}, {});
			}

			return _get.call(this, context)[name] || this.set(context, name, def) && def;
		}
	}, {
		key: "set",
		value: function set(context, name, value) {
			Object.assign(_get.call(this, context), _defineProperty({}, name, value));
			return this;
		}
	}, {
		key: "setObject",
		value: function setObject(context, object) {
			Object.assign(_get.call(this, context), object);
			return this;
		}
	}, {
		key: "clear",
		value: function clear(context, name) {
			if (name) {
				delete _get.call(this, context)[name];
			} else {
				this.weakMap.delete(context);
			}
			return this;
		}
	}]);

	return PrivateState;
}();

exports.default = PrivateState;