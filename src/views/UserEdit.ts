import { User, UserProps } from "../models/User";
import { UserForm } from "./UserForm";
import { UserShow } from "./UserShow";
import { View } from "./View";

export class UserEdit extends View<User, UserProps> {
  // child class can overwrite parent method
  // we want to create our own regionsMap
  // essentially regions maps returrn an object that allows us to
  // find the corresponding div elements
  regionsMap(): { [key: string]: string } {
    return {
      userShow: ".user-show",
      userForm: ".user-form",
    };
  }
  // remember that we can a property called regions (defined in View.ts)
  onRender(): void {
    // do our view nesting!
    new UserShow(this.regions.userShow, this.model).render();
    new UserForm(this.regions.userForm, this.model).render();
  }
  template(): string {
    return `
        <div>
        <div class='user-show'></div>
        <div class='user-form'></div>
       
        </div>
        `;
  }
}
