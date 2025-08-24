
export class EventBus {
    constructor() { 
        this.events = {}; 
    }
    
    subscribe(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    }
    
    publish(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(cb => cb(data));
    }

}
