import axios, { AxiosPromise } from "axios";

interface HasId {
  id?: number;
}
export class APISync<T extends HasId> {
  constructor(public rootURL: string) {}
  fetch(id: number): AxiosPromise {
    return axios.get(`${this.rootURL}/${id}`);
  }

  save(data: T): AxiosPromise {
    const id = data.id;
    // if no id, then it's a brand new user -- we make a post request
    if (id) {
      // put
      return axios.put(`${this.rootURL}/${id}`, data);
    } else {
      // post request bc it's a new user
      return axios.post(this.rootURL, data);
    }
  }
}
