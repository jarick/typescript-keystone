import EventBusInst = require("eventbusjs");

export interface IEventBus {
    addEventListener(type: string, callback: (... args) => void, scope?: any): void;
    removeEventListener(type: string, callback: (... args) => void, scope?: any): void;
    hasEventListener(type: string, callback: (... args) => void, scope?: any): void;
    dispatch(type: string, target?: any, ... args): void;
}

const EventBus: IEventBus = EventBusInst;

export default EventBus;
