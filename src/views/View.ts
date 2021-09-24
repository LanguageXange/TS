import { Model } from "../models/Model";
// remember that Model is a generic class!
export abstract class View<T extends Model<K>, K> {
  regions: { [key: string]: Element } = {};

  constructor(public parent: Element, public model: T) {
    this.bindModel();
  }

  regionsMap(): { [key: string]: string } {
    return {};
  }
  eventsMap(): { [key: string]: () => void } {
    return {};
  }
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

  // helper function
  mapRegions(fragment: DocumentFragment): void {
    const regionMaps = this.regionsMap();
    for (let key in regionMaps) {
      const selector = regionMaps[key];
      const ele = fragment.querySelector(selector);
      if (ele) {
        this.regions[key] = ele;
      }
    }
  }

  render(): void {
    this.parent.innerHTML = "";
    const templateElement = document.createElement("template");
    templateElement.innerHTML = this.template();
    this.bindEvents(templateElement.content);
    this.mapRegions(templateElement.content);
    this.parent.append(templateElement.content);
  }
}
