import { Model } from "../models/Model";
// remember that Model is a generic class!
export abstract class View<T extends Model<K>, K> {
  constructor(public parent: Element, public model: T) {
    this.bindModel();
  }

  abstract eventsMap(): { [key: string]: () => void };
  abstract template(): string;

  bindModel(): void {
    this.model.on("change", () => {
      this.render();
    });
    // this helper function will re-render the page whenever there is any update!
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
