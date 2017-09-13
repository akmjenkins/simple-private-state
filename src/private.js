let MEMBERS = new WeakMap();

let create = function() {
	let o;
	MEMBERS.set(this,(o = {}));
	return o;
}

let p;
export default p = {

	get(name) {
		let o = MEMBERS.get(this) || create.call(this);

		if(typeof name === 'undefined') {
			return o;
		}

		if(Array.isArray(name)) {
			return name.reduce((carry,name) => {
				carry[name] = p.get.call(this,name);
				return carry;
			},{});
		}

		return o[name];
	},

	set(name,value) {
		let o = MEMBERS.get(this) || create.call(this);
		o[name] = value;
	},

	setObject(object) {
		let o;
		Object.assign((o = MEMBERS.get(this) || create.call(this)),object);
	}	

}