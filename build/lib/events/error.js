"use strict";

function error(serviceID, error) {
  var log = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : console.log;


  log(serviceID, error);
}

module.exports = error;