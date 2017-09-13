import assert from 'assert';
import Private from '../src/private';


let user;
class User {

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

  getPassword()
  {
    return Private.get.call(
      this,
      'password'
    )
  }

  setMultiple(obj)
  {
    Private.setObject.call(
      this,
      obj
    );
  }

  getMultiple(keys)
  {
    return Private.get.call(
      this,
      keys
    );
  }

}

beforeEach(() => user = new User() );
  
it('saves a private member',() => {
  user.setPassword(1234);
  assert.ok(user.getPassword() === 1234);
});

it('does not expose a private member',() => {
  user.setPassword(1234);
  assert.ok(!user.password);
});

it('sets multiple private members',() => {
  let m = {
    username:'adam',
    password:1234
  }
  user.setMultiple(m);
  let r = user.getMultiple(Object.keys(m));
  assert.ok(r.username === m.username && r.password === m.password);
});

it('returns the requested private members only',() => {
  let m = {
    username:'adam',
    password:1234,
    age:32
  }

  user.setMultiple(m);
  let r = user.getMultiple(['username','password']);
  assert.ok(Object.keys(r).some((k) => { return k === 'username' || k === 'password'; }))
});