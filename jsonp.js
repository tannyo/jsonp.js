var jsonp = function (request) {
  'use strict';
  function JSONP_Data(request) {
    var self = this, remove, create_method;

    // If request is a string, create a request object.
    if (typeof request === "string") {
      request = {
        "src": request
      };
    }

    this.src = request.src;
    this.obj = this.ext_obj = undefined;

    // Remove the jsonp script and window reference.
    remove = function () {
      var script = self.script;

      // Remove the jsonp script.
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
        script = undefined;
      }

      // Remove call in the window object.
      if (window[self.jsonp]) {
        // IE < 9 does not let you delete a window object.
        try {
          delete window[self.jsonp];
        } catch (e) {
          window[self.jsonp] = undefined;
        }
      }
    };

    create_method = function (method, bExtended) {
      return function (fn) {
        var obj = bExtended ? this.ext_obj : this.obj;
        if (typeof fn === "function") {
          if (obj) {
            fn(obj);
            remove();
          } else {
            this[method] = fn;
          }
        }

        // Return this so that methods can be chained.
        return this;
      };
    };

    // Set response methods.
    this.always = request.always || create_method("always", true);
    this.success = request.success || create_method("success", true);
    this.done = request.done || create_method("done");
    this.fail = request.fail || create_method("fail");

    // set the jsonp callback function name.
    this.jsonp = 'jsonp' + new Date().valueOf();

    // Add the jsonp callback function to the window object so that it can be called by the jsonp script.
    window[this.jsonp] = this;

    // Called by the jsonp script.
    this.complete = function (obj) {
      // Save jsonp data as simple and complex objects.
      this.obj = obj;
      this.ext_obj = {
        "success": true,
        "data": obj
      };

      // Call all success methods.
      this.always(this.ext_obj);
      this.success(this.ext_obj);
      this.done(this.obj);

      // Remove the jsonp script file and call in the window object.
      remove();
    };

    // Called if the jsonp script doesnt load.
    this.error = function (e) {
      this.obj = "Unable to retrieve jsonp at : " + this.src;
      this.ext_obj = {
        "success": false,
        "msg": "Unable to retrieve jsonp at : " + this.src
      };

      this.always(this.ext_obj);
      this.fail(this.obj);

      // Remove the jsonp script file and call in the window object.
      remove();
    };

    // Create a new script element.
    this.script = document.createElement('script');
    this.script.type = 'text/javascript';
    this.script.onerror = function () {
      self.error.apply(self, arguments);
    };

    // Support script load errors in IE < 9
    if (window.attachEvent && !window.addEventListener) {
      // Support errors in readyState. http://stackoverflow.com/a/18840568
      this.script.onreadystatechange = function () {
        if (self.script.readyState === "complete") {
          // Add the jsonp script to the page to run the script.
          document.getElementsByTagName('head')[0].appendChild(self.script);
          self.script.onreadystatechange = null;
          return;
        }

        var firstState = self.script.readyState;

        // hack: calling 'children' property changes node's readyState from 'loaded' to complete
        // (if script was loaded normally) or to 'loading' - if error detected. This will throw an
        // error if the script loaded successfully and not if there is an error.
        try {
          self.script.children;
        } catch (e) {}
        if (firstState === "loaded" && self.script.readyState === "loading") {
          self.error.apply(self, arguments);
          self.script.onreadystatechange = null;
        }
      };

      this.script.src = this.src + (this.src.indexOf("?") === -1 ? "?" : "&") + "callback=" + this.jsonp + ".complete";
      return {
        "always": this.always,
        "success": this.success,
        "done": this.done,
        "fail": this.fail
      };
    }

    this.script.src = this.src + (this.src.indexOf("?") === -1 ? "?" : "&") + "callback=" + this.jsonp + ".complete";
    // Add the jsonp script to the page.
    document.getElementsByTagName('head')[0].appendChild(this.script);
    return this;
  }

  return new JSONP_Data(request);
};
