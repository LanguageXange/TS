// eventually will refactor to Collection
import axios, { AxiosResponse } from "axios";

import { Eventing } from "./Eventing";
import { User, UserProps } from "./User";

// for now let's build UserCollectioni first

export class Collection {
  models: User[] = [];
  events: Eventing = new Eventing();

  // we can't use shorthand syntax because we
  // initialize the events inline
  constructor(public rootURL: string) {}

  get on() {
    return this.events.on;
  }
  get trigger() {
    return this.events.trigger;
  }

  fetch(): void {
    axios.get(this.rootURL).then((res: AxiosResponse) => {
      res.data.forEach((v: UserProps) => {
        const user = User.buildUser(v);
        this.models.push(user);
      });
    });

    this.trigger("change");
  }
}
