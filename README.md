# Simple Private State

Private methods were always something that were easy to do in JavaScript (even in the browser):

```js
//Node
import Private from 'private';

let somePrivateMethod = function() {
	//...
};

export default class User {

	constructor()
	{
		somePrivateMethod.call(this);
	}

}
```

```js
//Browser
var User = (function() {
	
	var myPrivateMethod = function() {
		//...
	};

	var User = function() {
		somePrivateMethod.call(this);
	};

	return User;

}());

var me = new User();
```

Private variables **were** virtually impossible, without a lot of hackery, until [WeakMap][wm] came along which made them trivial, using only a little bit of hackery ;).

  [wm]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap

```js
//Node
let privateMembers = new WeakMap();
export default class User {

	constructor()
	{
		privateMembers.set(this,{password:1234});
	}

	login()
	{
		privateMembers.get(this).password;
	}
}
```

```js
//Modern Browsers
var User = (function() {
	
	var myPrivateMembers = new WeakMap();

	var User = function() {
		myPrivateMembers.set(this,{password:1234});
	};

	return User;

}());

var me = new User();
```

The reason why it was so difficult before is because in order to maintain a store of private variables for an instance, you also had to maintain a **reference** to that instance
which made your instances ineligible for [Garbage Collection (GC)][gc] and was a full-stop show stopper.

  [gc]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management#Garbage_collection


So with this in mind, I made a super-simple wrapper around a WeakMap to allow all your instances relatively easy access to their own private member variables in the form of a simple key-value store.

### Usage
---

```js
//Node
import PrivateState from 'simple-private-state'
let p = new PrivateState();

class User
{

	constructor() 
	{

	}

	setPassword(password)
	{
		p.set(
			this,
			'password',
			1234
		)
	}

}
```


### API
---

#### set(instance,key,value)

e.g.
```js
import PrivateState from 'simple-private-state'
let p = new PrivateState();
class User {
	constructor()
	{
		p.set(
			this,
			'password',
			1234
		);

		p.set(
			this,
			'username',
			'ajenkins'
		);

		p.set(
			this,
			'data',
			{
				age:32,
				name:'adam'
			}
		)
	}
}
```

#### get(instance,key(s))

When called with an array, an object will be returned containing the key value pairs for all keys that were passed in.
Alternatively, you can call it with a single [object-key identifier][oki] and it will return whatever the value is

  [oki]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Objects_and_properties

e.g.
```js
import PrivateState from 'simple-private-state'
let p = new PrivateState();
class User {
	someMethod()
	{
		p.get(
			this,
			'password'
		);
		//returns 1234, from the example above

		p.get(
			this,
			['username','password']
		);
		//returns from the example above:
		//	{
		//		username:'ajenkins',
		//		password:1234
		//	}

		p.get(
			this,
			'data'
		)
		//returns from the example above:
		//	{
		//		age:32,
		//		name:'adam'
		//	}
	}
}
```

#### setObject(instance,keyValues)

Allows you to extend (not overwrite) the current private key value store for an instance

e.g.
```js
import PrivateState from 'simple-private-state'
let p = new PrivateState();
class User {
	someMethod()
	{
		p.setObject(
			this,
			{
				username:'ajenkins',
				password:1234
			}
		);

		p.get(this,'username'); 
		// returns akjenkins


		// extend the private member set
		p.setObject(
			this,
			{
				data:{
					age:32,
					name:'adam'
				}
			}
		);

		p.get(this,['username','data']); 
		/* returns
			{
				username:'ajenkins',
				data:{
					age:32,
					name:'adam'
				}
			}
		*/
	}
}
```