import { AxiosPromise, AxiosResponse } from "axios";

interface ModelAttributes<T> {
  set(value: T): void;
  getAll(): T;
  get<K extends keyof T>(key: K): T[K];
}

interface Sync<T> {
  fetch(id: number): AxiosPromise;
  save(data: T): AxiosPromise;
}

interface Events {
  on(eName: string, cB: () => void): void;
  trigger(eName: string): void;
}

interface HasId {
  id?: number;
}

export class Model<T extends HasId> {
  constructor(
    private attribute: ModelAttributes<T>,
    private events: Events,
    private sync: Sync<T>
  ) {}

  //  accessor
  get on() {
    // we are not calling the function but simply return a reference to the events.on method
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  get get() {
    return this.attribute.get;
  }

  set(update: T): void {
    this.attribute.set(update);
    this.events.trigger("change");
  }

  fetch(): void {
    const id = this.attribute.get("id");
    if (typeof id !== "number") {
      throw new Error("cannot find the user");
    }

    this.sync.fetch(id).then((res: AxiosResponse): void => {
      this.set(res.data);
    });
  }

  save(): void {
    this.sync
      .save(this.attribute.getAll())
      .then((res: AxiosResponse): void => {
        this.trigger("save");
      })
      .catch(() => {
        this.trigger("error");
      });
  }
}
