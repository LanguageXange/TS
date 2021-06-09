import { Eventing } from "./Eventing";
import { Sync } from "./Sync";

export interface UserProps {
  name?: string;
  age?: number;
  id?: number;
}

const rootURL = "http://localhost:3000/users";
export class User {
  public events: Eventing = new Eventing();
  // pass in URL
  public sync: Sync<UserProps> = new Sync<UserProps>(rootURL);
  constructor(private data: UserProps) {}

  get(propName: string): number | string {
    return this.data[propName];
  }
  set(update: UserProps): void {
    Object.assign(this.data, update);
  }
}
