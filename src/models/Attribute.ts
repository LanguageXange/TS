import { UserProps } from "./User";
export class Attribute<T> {
  constructor(private data: T) {}

  // set up generic constraints
  get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }
  set(update: T): void {
    Object.assign(this.data, update);
  }
}
