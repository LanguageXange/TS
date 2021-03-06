import { View } from "./View";
import { User, UserProps } from "../models/User";
export class UserForm extends View<User, UserProps> {
  eventsMap(): { [key: string]: () => void } {
    return {
      "click:button": this.onButtonClick,
      "mouseenter:h1": this.onHoverH1,
      "click:.set-age": this.onSetAgeClick,
      "click:.set-name": this.onSetNameClick,
      "click:.save-model": this.onSaveClick,
    };
  }

  onHoverH1(): void {
    console.log("yeah mouseenter h1");
  }

  onButtonClick(): void {
    console.log("click");
  }
  onSaveClick = (): void => {
    this.model.save();
  };
  // Why we want arrow function here - so that we don't have to deal with 'this'
  onSetNameClick = (): void => {
    //we want to reach the DOM read the input element and the content
    const input = this.parent.querySelector("input");
    const name = input?.value;
    this.model.set({ name });
  };
  onSetAgeClick = (): void => {
    // we've updated the User model to have a setRandomAge method
    this.model.setRandomAge();
  };
  template(): string {
    return `
        <div>
        <input placeholder="${this.model.get("name")}"/>
        <button class='set-name'>change name</button>
        <button class="set-age">set random age</button>
        <button class="save-model">Save Name</button>
        </div>
        `;
  }
}
