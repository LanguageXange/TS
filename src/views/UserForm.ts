import { User } from "../models/User";
export class UserForm {
  constructor(public parent: Element, public model: User) {
    this.bindModel();
  }

  bindModel(): void {
    this.model.on("change", () => {
      this.render();
    });
  }

  eventsMap(): { [key: string]: () => void } {
    return {
      "click:button": this.onButtonClick,
      "mouseenter:h1": this.onHoverH1,
      "click:.set-age": this.onSetAgeClick,
    };
  }
  onHoverH1(): void {
    console.log("yeah mouseenter h1");
  }

  onButtonClick(): void {
    console.log("click");
  }
  onSetAgeClick = (): void => {
    // we've updated the User model to have a setRandomAge method
    this.model.setRandomAge();
  };
  template(): string {
    return `
        <div>
        <h1> User Form</h1>
        <p> User Name ${this.model.get("name")}</p>
        <p> User Age ${this.model.get("age")}</p>
        <input/>
        <button>click me</button>
        <button class="set-age">set random age</button>
        </div>
        `;
  }
  // DocumentFrament cool
  bindEvents(fragment: DocumentFragment): void {
    const eventsMap = this.eventsMap();
    for (let eventKey in eventsMap) {
      // split the key in half based on the ":"
      const [name, selector] = eventKey.split(":"); // click, button

      fragment.querySelectorAll(selector).forEach((ele) => {
        ele.addEventListener(name, eventsMap[eventKey]);
      });
    }
  }

  render(): void {
    this.parent.innerHTML = "";
    const templateElement = document.createElement("template");
    templateElement.innerHTML = this.template();
    this.bindEvents(templateElement.content);
    this.parent.append(templateElement.content);
  }
}
