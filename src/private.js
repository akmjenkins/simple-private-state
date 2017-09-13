let get = function(context)
{
	let store = this.weakMap.get(context);
	if(!store) {
		this.weakMap.set(context,(store = {}));
	}
	return store;
}

export default class PrivateState {

	constructor(context)
	{
		this.weakMap = new WeakMap();
	}

	get(context,name)
	{
		if(!name) {
			return get.call(this,context);
		}

		if(Array.isArray(name)) {
			return name.reduce((c,n) => {
				c[n] = this.get(context,n);
				return c;
			},{});
		}

		return get.call(this,context)[name];
	}

	set(context,name,value)
	{
		Object.assign(get.call(this,context),{[name]:value});
		return this;
	}

	setObject(context,object)
	{
		Object.assign(get.call(this,context),object);
		return this;
	}

}