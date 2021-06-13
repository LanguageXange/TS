### npm install -g parcel-bundler

```
 <body>
    <script src="./src/index.ts"></script>
  </body>

```

### parcel index.html

---

## Framework Structure

Model Classes - Handle data, used to represent Users, Blog Posts, Images, etc

View Classes - Handle HTML and eventst causesd by the user
(like clicks)

Extraction Approach

- Build class User as a 'mega' class with tons of methods
- Refactor User to use composition
- Refactor User to be a reusable class that can represent any
  piece of data, not just a User

## How to make interface properties optional

use question mark!

```
interface UserProps{
    name?:string;
    age?:number;
}
```

## Storring Event Listeners

- type annotation

06-02-log

##'Dynamic Array Creation'

- complete on and trigger function

```
 on(eventName: string, callBack: CallBack): void {
    const handlers = this.events[eventName] || [];
    handlers.push(callBack);
    this.events[eventName] = handlers;
  }

  trigger(eventName: string): void {
    const handlers = this.events[eventName]; // either undefined or callback[]
    if (!handlers || handlers.length === 0) {
      return;
    }

    handlers.forEach((cb) => cb());
  }
```

06-03-log continue from Adding JSON Server!

User Instance ----> save() JSON Server
User Instance <---- fetch()

npm install -g json-server

create a db.json file

json-server -w db.json --> run this command in another terminal

npm install axios

go to package.json file

```
  "scripts": {
    "start:db": "json-server -w db.json",
    "start:parcel": "parcel index.html"
  }
```

and now we can do
npm run start:db
npm run start:parcel

---

## Understanding REST Conventions

GET, POST, PUT, DELETE

remove the following code

```
import { User } from "./models/User";

const user = new User({ name: "hi", age: 10 });
// user.set({ name: "new name" });
// console.log(user.get("name"));

user.on("change", () => {
  console.log("changing1");
});

user.on("change", () => {
  console.log("changing 2!!");
});
user.on("woohooevent", () => {
  console.log("whooo whoooj");
});
user.on("clicking", () => {
  console.log("clicking");
});

user.trigger("clicking");


```

and test our json server

```
import axios from "axios";

// axios.post("http://localhost:3000/users", {
//   name: "my name wooo",
//   age: 100,
// });

axios.get("http://localhost:3000/users/1");

```

---

## one thing different from the video

now json-server has some built in dummy data when you run json-server -w db.json
which overwrite our inital data

```
{
  "user":[]
}
```

## Adding Fetch Functionality

```
  fetch(): void {
    axios
      .get(`http://localhost:3000/users/${this.get("id")}`)
      .then((res: AxiosResponse): void => {
        this.set(res.data);
      });
  }

```

## Saving User Data

After typing the save function inside User.ts

```
  save(): void {
    const id = this.get("id");
    // if no id, then it's a brand new user -- we make a post request
    if (id) {
      // put
      axios.put(`http://localhost:3000/users/${id}`, this.data);
    } else {
      // post requestion
      axios.post("http://localhost:3000/users/", this.data);
    }
  }
```

and go back to index.ts

```
import { User } from "./models/User";

const user = new User({ id: 1 });

user.set({ name: "new user", age: 40 });

user.save();

```

refresh (remeber need to npm run start:db , npm run start:parcel at different terminals)

the user should be updated ! so does db.json

## 06-04 log: Continue from Refactorinig with Composition

- create a new file Eventing.ts inside models folder

- we can extract everything related to the event to Eventing.ts (on and trigger functions)

## Re-integrating Eventing

### Goal:

class User
attributes: Attributes (gives us the ability to store properties tied to this user)
events: Events (tell other parts of our app whenever data tied to a particular user is changed!)
sync: Sync (save this persons data to a remove server and retrieve it in the future)

1. Option one: Accept dependencies as second constructor argument

```

constructor(private data: UserProps, private events: Eventing) {}


new User({id:1}, new Eventing())

this is kinda of nasty!

```

2. Option Two: Only accept dependencites into constructor , define
   a static class method to preconfigure User and assign properties afterwards

```

static fromData(data:UserProps): User{
  const user = new User(new Eventing())
  user.set(data)
  return user
}

private data : UserProps
constructor(private events: Eventing){}


too much configuration if we expand user properties

```

3. Option Three: Only accept properties into constructor, hard code dependencies as class properties --> best option for this project

```
events: Eventing = new Eventing()

constructor(private data :UserProps){}


const user = new User()
user.events --> available properties now

```

## Composition with Nested Objects

---

06-05-log: Continue from 'A more Complicated extraction'

06-08:

- create Sync.ts
- fetch and save methods put it in Sync class
- you will see errors right away
  because we don't have data, set and get method inside class Sync
- we need a more robust relationship between class User and class Sync

## Options for Adapting Sync

1. Sync gets function arguments

```
save(id:number, data:UserProps):void
fetch(id:number):UserProps

cons: isolate class Sync -> only accept UserProps like data
```

2.

Serialize : Convert data from an object into some save-able format(json)

Deserialize: put data on an object using previously saved json data

```
interface Serializable {}
class Sync {
  save(id:num, serialize: Serializable)
  fetch(id:num, deserialize: Deserializable)
}

interface Deserializable{}


```

3. Sync is a generic class to customize the type of data coming into save()

```
class Sync<T>
save(id:num, data:T):AxiosPromise<T>
fetch(id:num):AxiosPromise<T>

```

import UserProps interface
replace url with argument

```
turn the following code from

  fetch(id: number): void {
    axios.get(`${this.rootURL}/${id}`).then((res: AxiosResponse): void => {
      this.set(res.data);
    });
  }


to

  fetch(id: number): AxiosPromise {
    return axios.get(`${this.rootURL}/${id}`);
  }


  save method now also return AxiosPromise

```

## Generic Constraints Around Sync

```
export class Sync<T>{
  save(data:T):AxoisPromise{
    ...
  }
}
you will see error
const {id} = data because TypeScript doesn't know whether the generic type will have id for sure



solution:
interface HasId {
  id: number;
}


export class Sync<T extends HasId>
```

## Connecting Sync Back to User

06-08-log continue from 'Optional properties'

problem: in Sync.ts we specify that Sync extends HasID interface
however, in User.ts we pass in the UserProps generics is using
optional properties

```
export interface UserProps {
  name?: string;
  age?: number;
  id?: number;
}
```

simply do this - make id optional in HasId

```
interface HasId {
  id?: number;
}
```

`tsc --init` to generate a tsconfig.json file

you will see that

```
/* Strict Type-Checking Options */
"strict": true,

```

now go back to Sync.ts
and hover

```
 const id = data.id;
```

you will see (id: number | undefined)
which is a better representation of optional properties

06-09-log: continue from 'extracting an attribute class'

create Attribute.ts

get and set methods move to Attribute
and make Attribute generic as well

```
get(propName: string): number | string | boolean {
    return this.data[propName];
  }

  get method shortcoming -> need to use typeof to make sure the outcome
  is what we want
```

## Two important rules

1. in typescript, string can be types

type BestName = 'booo'

2. All object keys are strings

## advanced generic constraint

```
import { UserProps } from "./User";
export class Attribute<T> {
  constructor(private data: T) {}

  // set up generic constraints
  get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }
  set(update: T): void {
    Object.assign(this.data, update);
  }
}

const attrs = new Attribute<UserProps>({
  id: 5,
  age: 20,
  name: "what",
});

const name = attrs.get("name");

```

06-10-log: continue from integrating attribute

instead of writing this

```
  public attribute: Attribute<UserProps> = new Attribute<UserProps>()
```

write this
because Attribute class is expecting an argument

```
public attribute: Attribute<UserProps>;
constructor(attrs:UserProps){
  this.attribute = new Attribute<UserProps>(attrs)
}

```

## Composition is delegation

Some methods need coordination between different modules in user

set(), fetch(), save() methods require both class Attribute and class Sync

// accessors - e.g. use the get keyword so that we don't need the parenthesis

## Passthrough Methods

get, on, trigger

```
  //  accessor
  get on() {
    // we are not calling the function but simply return a reference to the events.on method
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  get get() {
    return this.attribute.get;
  }


```

### Context issue - this keyword

```
//console.log(user.get("name")); // yet we see the error Cannot read property 'name' of undefined

```

We need to update Attribute.ts

```
//turn this
  get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }


//into a function

  get = <K extends keyof T>(key: K): T[K] => {
    return this.data[key];
  };

  now the 'this' will refer to the class Attribute

```

## Saving data

adding getAll() method inside Attribute.ts

```
  save():void{
    this.sync.save(this.attribute.getAll())
  }
```

## Composition vs. Inheritance

1. make class User reusable -> create a new class called Model with all the methods that current User has

## Extracting a Model Class

```
export class User extends Model<UserProps> {
  static buildUser(attrs: UserProps): User {
    return new User(
      new Attribute<UserProps>(attrs),
      new Eventing(),
      new APISync<UserProps>(rootURL)
    );
  }
}

```

## User.buildUser({})

06-13-log Continue from 'Shortened Passthrough Methods
