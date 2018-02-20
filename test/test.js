import assert from 'assert';
import PrivateState from '../src/private';


let p = new PrivateState();
let user;
class User {

  constructor()
  {
  }

  setPassword(password)
  {
    p.set(
      this,
      'password',
      password
    )
  }

  getPassword()
  {
    return p.get(
      this,
      'password'
    )
  }

  setMultiple(obj)
  {
    p.setObject(
      this,
      obj
    );
  }

  getMultiple(keys)
  {
    return p.get(
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
  assert.ok(
    r.username === m.username && r.password === m.password,
    `
      r is ${Object.keys(r)}
      Username is ${r.username}, should be ${m.username}
      Password is ${r.password}, should be ${m.password}
      ${Object.values(p.get(user))}
    `
  );
});

it('sets and returns a default value if private member not present',() => {
  let def = null;
  assert.ok(
    p.get(user,'some unset property',def) === def
  );

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
