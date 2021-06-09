import { User } from "./models/User";

const user = new User({ name: "new record", age: 1000 });

user.events.on("change", () => {
  console.log("changing!");
});

user.events.trigger("change");
