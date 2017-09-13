import PrivateState from '../src/private';

let p = new PrivateState();

class User {

	constructor()
	{
		p.set(this,'data',{age:32});
		p.setObject(this,{username:'adam',password:'1234'});
	}

	getPassword()
	{
		return p.get(this,'password');
	}

	getAge()
	{
		return p.get(this,'data').age;
	}

}

console.log(p.get(new User(),['username']));
console.log(new User().getPassword());
console.log(new User().getAge());