import { round } from "../utils.ts";
import * as State from "../state.ts";

function readingsDuration(readings){
  if (!readings[0]) { return 0; }
  var last = readings.length;
  var t0 = readings[0].timestamp;
  var t1 = readings[last - 1].timestamp;
  // DEBT Magic number that make sense when sample rate is every 250ms
  return (t1 + 250 - t0) / 1000;
}
function altitudeForFreefallDuration(duration){
  // Altitude Calculation

  // SUVAT
  // s = vt - 0.5 * a * t^2
  // input
  // s = s <- desired result
  // u = ? <- not needed
  // v = 0 <- stationary at top
  // a = - 9.81 <- local g
  // t = flightTime/2 time to top of arc

  // s = 9.81 * 1/8 t^2
  var t = duration;
  return round(2)(9.81/8 * t * t);
}

function format(i: number){
  var padding = "00000";
  var str = i.toFixed(2);
  return padding.substring(0, padding.length - str.length) + str;
}

export function create(state: State.State){
  return Object.create({}, {
    maxFlightTime: {
      get: function(){
        var flights = state.flightRecords.concat([state.currentFlightReadings]);
        var flightDurations = flights.map(readingsDuration);
        return Math.max.apply(null, flightDurations);
      }
    },
    maxAltitude: {
      get: function(){
        var flightDurations = state.flightRecords.map(readingsDuration);
        var max = Math.max.apply(null, [0].concat(flightDurations));
        return altitudeForFreefallDuration(max);
      }
    },
    currentReading: {
      get: function(){
        if (!state.currentReading){ return "Waiting."; };
        var acceleration = state.currentReading.acceleration;
        var x = acceleration.x;
        var y = acceleration.y;
        var z = acceleration.z;
        return "[" + [format(x), format(y), format(z)].join(", ") + "]";
      }
    }
  });
}
