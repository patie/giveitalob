var NullLogger = {info: function(...a){ null; }, error: function(...a){ null; }};

// Raise Error for circular calls
// Pass multiple arguments probably fails with type declaration
// warn not log if no handlers
function Dispatcher(handlers, world){
  this.dispatch = function(minutiae){
    handlers.forEach(function(handler){
      try {
        handler.call({}, minutiae);
      } catch(e) {
        world.error(e);
      }
    });
    world.info(minutiae);
  };
  this.register = function(handler){
    return new Dispatcher(handlers.concat(handler), world);
  };
};

export function create(world=NullLogger){
  return new Dispatcher([], world);
};
export default Dispatcher;
