// import { User } from "./models/User";

// const collection = User.buldUserCollection();
// collection.on("change", () => {
//   console.log(collection);
// });

// collection.fetch();

import { User } from "./models/User";
import { UserForm } from "./views/UserForm";

const user = User.buildUser({ name: "blah", age: 100 });
const userForm = new UserForm(document.getElementById("root"), user);

userForm.render();
