// import { User } from "./models/User";

// const collection = User.buldUserCollection();
// collection.on("change", () => {
//   console.log(collection);
// });

// collection.fetch();

import { User } from "./models/User";
import { UserForm } from "./views/UserForm";

const user = User.buildUser({ name: "blah", age: 100 });

// since the root element could be null we need to check it first
const root = document.getElementById("root");
if (root) {
  const userForm = new UserForm(root, user);
  userForm.render();
} else {
  throw new Error("root element not found");
}
