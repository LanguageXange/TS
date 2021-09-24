// // import { User } from "./models/User";

// // const collection = User.buldUserCollection();
// // collection.on("change", () => {
// //   console.log(collection);
// // });

// // collection.fetch();

// // --------------------------------
// import { User } from "./models/User";
// import { UserEdit } from "./views/UserEdit";
// import { UserForm } from "./views/UserForm";

// const user = User.buildUser({ name: "blah", age: 100 });

// // since the root element could be null we need to check it first
// const root = document.getElementById("root");
// // if (root) {
// //   const userForm = new UserForm(root, user);
// //   userForm.render();
// // } else {
// //   throw new Error("root element not found");
// // }

// if (root) {
//   const userEdit = new UserEdit(root, user);
//   userEdit.render();
//   console.log(userEdit, "notice the regions property");
// } else {
//   throw new Error("not found");
// }

// //-------------------------------------------
// Final Code !! - error fetch data from localhost 3000
import { Collection } from "./models/Collection";
import { User, UserProps } from "./models/User";
import { UserList } from "./views/UserList";

const users = new Collection(
  "http://localhost:3000/users",
  (json: UserProps) => {
    return User.buildUser(json);
  }
);

users.on("change", () => {
  console.log("user change!");
  const root = document.getElementById("root");
  if (root) {
    new UserList(root, users).render();
  }
});

users.fetch();
