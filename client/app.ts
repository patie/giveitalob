import Store from "./store.ts";

export default function App(actions){
  var services = {};
  var components = {};
  var store = Store();
  actions.newReading.register(store.newReading);
  actions.startStreaming.register(store.startStreaming);

  return {
    registerService: function(name, factory){
      services[name] ={factory: factory};
    },
    getService: function(name){
      var service = services[name];
      if (service.instance) { return service.instance; }
      return service.instance = service.factory(this);
    },
    registerComponent: function(name, factory){
      components[name] ={factory: factory};
    },
    getComponent: function(name, element){
      var component = components[name];
      return component.factory(element, this);
    },
    actions: actions,
    store: store
  };
}
