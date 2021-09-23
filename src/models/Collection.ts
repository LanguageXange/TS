// eventually will refactor to Collection
import axios, { AxiosResponse } from "axios";

import { Eventing } from "./Eventing";
// import { User, UserProps } from "./User";

// for now let's build UserCollectioni first

export class Collection<T, K> {
  models: T[] = [];
  events: Eventing = new Eventing();

  // we can't use shorthand syntax because we
  // initialize the events inline
  constructor(
    public rootURL: string,

    public deserialize: (json: K) => T
  ) {}

  get on() {
    return this.events.on;
  }
  get trigger() {
    return this.events.trigger;
  }

  fetch(): void {
    axios.get(this.rootURL).then((res: AxiosResponse) => {
      res.data.forEach((v: K) => {
        // const user = T.buildUser(v);
        this.models.push(this.deserialize(v));
      });
    });

    this.trigger("change");
  }
}
