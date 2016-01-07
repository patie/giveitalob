/* jshint esnext: true */

import Tracker from "./tracker/tracker";
import ConsoleView from "./tracker/console-view";
import Showcase from "./tracker/showcase";
import Reading from "./lib/reading";

window.Tracker = Tracker;
window.Tracker.Reading = Reading;

var tracker = new Tracker();
tracker.logger = window.console;
tracker.showcase = Showcase(window);

// var consoleView = new ConsoleView(window.console);
// // tracker.showcase.register(consoleView.render);
//
// import UplinkController from "./tracker/uplink-controller";
//
// import * as URI from "./uri";
// var uri = URI.parseLocation(window.location);
//
// var uplinkController = new UplinkController({
//   token: uri.query.token,
//   channel: uri.query.channel
// }, tracker);

export default tracker;

import Router from "./router";

var router = Router(window);

console.log(router.state);


// Dom views should be initialized with the ready on certain selectors library
