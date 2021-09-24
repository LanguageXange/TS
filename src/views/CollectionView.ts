import { Collection } from "../models/Collection";
// remember Collection is a geneeric class <T,K>

// we can turn our Collection View into a generic class as well
export abstract class CollectionView<T, K> {
  constructor(public parent: Element, public collection: Collection<T, K>) {}

  abstract renderItem(model: T, itemParent: Element): void;

  render(): void {
    // clear our parent
    this.parent.innerHTML = "";
    const templateElement = document.createElement("template");

    for (let model of this.collection.models) {
      const itemParent = document.createElement("div"); // wrapper element
      this.renderItem(model, itemParent);
      templateElement.content.append(itemParent);
    }

    this.parent.append(templateElement.content);
  }
}
