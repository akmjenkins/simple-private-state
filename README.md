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


So with this in mind, I made a super-simple wrapper around a WeakMap to allow all your objects relatively* easy access to their own private member variables in the form of a simple key-value store.

*I say relatively, because this implementation does burden you with the requirement of `call`-ing the methods provided by **SimplePrivateState** so you can set
the correct context. This can be implemented several other ways for those who like their syntactic sugar, this is just the way I chose.

### Usage
---

```js
//Node
import Private from 'simple-private-state'

class User
{

	constructor() 
	{
	}

	setPassword(password)
	{
		Private.set.call(
			this,
			'password',
			password
		)
	}

}
```


### API
---

#### Private.set.call(instance,key,value)

e.g.
```js
	class User {
		constructor()
		{
			Private.set.call(
				this,
				'password',
				1234
			);

			Private.set.call(
				this,
				'username',
				'ajenkins'
			);

			Private.set.call(
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

#### Private.get.call(instance,key(s))

When called with an array, an object will be returned containing the key value pairs for all keys that were passed in.
Alternatively, you can call it with a single [object-key identifier][oki] and it will return whatever the value is

  [oki]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Objects_and_properties

e.g.
```js
	class User {
		someMethod()
		{
			Private.get.call(
				this,
				'password'
			);
			//returns 1234, from the example above

			Private.get.call(
				this,
				['username','password']
			);
			//returns from the example above:
			//	{
			//		username:'ajenkins',
			//		password:1234
			//	}

			Private.get.call(
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

#### Private.setObject.call(instance,keyValues)

Allows you to extend (not overwrite) the current private key value store for an instance

e.g.
```js
	class User {
		someMethod()
		{
			Private.setObject.call(
				this,
				{
					username:'ajenkins',
					password:1234
				}
			);

			Private.get.call(this,'username'); 
			// returns akjenkins


			// extend the private member set
			Private.setObject.call(
				this,
				{
					data:{
						age:32,
						name:'adam'
					}
				}
			);

			Private.get.call(this,['username','data']); 
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