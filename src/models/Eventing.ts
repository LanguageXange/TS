// handling all the events tied to the user
type CallBack = () => void;
// type alias - call back function that takes no argument and returns nothing

export class Eventing {
  // return an array of function
  events: { [key: string]: CallBack[] } = {};
  on = (eventName: string, callBack: CallBack): void => {
    const handlers = this.events[eventName] || [];
    handlers.push(callBack);
    this.events[eventName] = handlers;
  };

  trigger = (eventName: string): void => {
    const handlers = this.events[eventName]; // either undefined or callback[]
    if (!handlers || handlers.length === 0) {
      return;
    }

    handlers.forEach((cb) => cb());
  };
}
