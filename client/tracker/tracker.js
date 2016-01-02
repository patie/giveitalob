/* jshint esnext: true */

import State from "./state";

function Tracker(raw_state){
  var tracker = this;
  tracker.state = State(raw_state);

  function logInfo() {
    tracker.logger.info.apply(tracker.logger, arguments);
  }

  function projectState(state){
    return state;
  }
  var view;
  tracker.showcase = {
    dispatch: function(state){
      // var projection = new Projection(state);
      if(view){
        view(projectState(state));
      }
    },
    register: function(newView){
      newView(projectState(tracker.state));
      view = newView;
    }
  };

  // The tracker application has an internal state.
  // All observers know that the can watch a given projection of that state
  // project and present overloaded verbs.
  // options showcase or exhibit
  function showcase(state){
    // The tracker just cares that its state is shown somewhere
    tracker.showcase.dispatch(state);
  }

  tracker.uplinkAvailable = function(){
    // Set state action can cause projection to exhibit new state
    tracker.state = tracker.state.set("uplinkStatus", "AVAILABLE");
    // call log change. test listeners that the state has changed.
    logInfo("[Uplink Available]");
    showcase(tracker.state);
  };

  tracker.newReading = function(reading){
    // TODO don't need any of these things they all belong in flyer.
    // we just need to check that it plots to graph
    var state = tracker.state.set("latestReading", reading);
    var currentFlight = state.currentFlight;
    var flightHistory = state.flightHistory;
    if (reading.magnitude < 4) {
      currentFlight =  currentFlight.concat(reading);
    } else if(currentFlight[0]) {
      // DEBT concat splits array so we double wrap the flight
      flightHistory = flightHistory.concat([currentFlight]);
      currentFlight = [];
    }
    state = state.set("currentFlight", currentFlight);
    state = state.set("flightHistory", flightHistory);
    tracker.state = state;
    showcase(tracker.state);
    // DEBT might want to log this action too
  };

  tracker.resetReadings = function(){
    tracker.state = tracker.state.merge({
      latestReading: null,
      currentFlight: [],
      flightHistory: []
    });
    showcase(tracker.state);
  };
}

export default Tracker;
