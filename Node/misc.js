/**
 * Process shortcut return values
 *
 * Accepts input of the forms:
 *
 *  false, null, undefined, 0 (success)
 *  true, 1 (error)
 *  exitCode (integer, specific error)
 *  [ exitCode, data ] (integer exitCode + object to return)
 *  
 * 
 */
exports.returnMeta = function (status, meta) {
  var code = 0;
  meta = meta || {};

  if (typeof status == 'number') {
    status = number > 0;
    code = number;
  }
  else if (typeof status == 'boolean') {
    code = +status;
  }
  else {
    status = false;
  }
  
  meta.status = status;
  meta.code = code;

  return meta;
};

exports.composePath = function (name, path) {
  if (path != '' && path !== undefined && path !== null) {
    name = path.replace(/\/$/, '') +'/'+ name;
  };
  return name;
};

/**
 * Generator for decorator to track asynchronous tasks.
 *
 * Allows you to execute a complicated dynamic callback hierarchy and call a handler when all marked callbacks have finished.
 *
 * @param done
 *   Callback to call when all callbacks are done.
 * @param ...
 *   Additional arguments for the done callback.
 *
 * @return function queue (callback)
 *   Decorator for a callback to track.
 *
 */
exports.whenDone = function (done) {
  // Initialize closure variable.
  var count = 0,
  // Store additional arguments.
      done_args = [].slice.call(arguments, 1);
  return function (callback) {
    // Register new task.
    count++;
    // Decorate callback with exit-checker.
    return function () {
      callback.apply(this, arguments);
      if (--count == 0) {
        done.apply(this, done_args);
      }
    }
  }
}

/**
 * Execute a function asynchronously.
 */
exports.async = function (func) {
  var that = this,
      args = [].slice.call(arguments, 1);
  setTimeout(function () { func.apply(that, args); }, 0);
}

/**
 * Make an asynchronously executed callback.
 */
exports.asyncCallback = function (func) {
  var that = this,
      args = [].slice.call(arguments, 1);
  return function () {
    setTimeout(function () { func.apply(that, args); }, 0);
  };
}

/**
 * Extend object with getter/setter support.
 */
exports.extend = function (a,b) {
    for ( var i in b ) {
        var g = b.__lookupGetter__(i), s = b.__lookupSetter__(i);
       
        if ( g || s ) {
            if ( g )
                a.__defineGetter__(i, g);
            if ( s )
                a.__defineSetter__(i, s);
         } else
             a[i] = b[i];
    }
    return a;
}