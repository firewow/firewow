try {
    if (!Object.prototype.__defineGetter__ &&
        Object.defineProperty({},"x",{get: function(){return true}}).x) {
        Object.defineProperty(Object.prototype, "__defineGetter__",
            {enumerable: false, configurable: true,
                value: function(name,func)
                {Object.defineProperty(this,name,
                    {get:func,enumerable: true,configurable: true});
                }});
        Object.defineProperty(Object.prototype, "__defineSetter__",
            {enumerable: false, configurable: true,
                value: function(name,func)
                {Object.defineProperty(this,name,
                    {set:func,enumerable: true,configurable: true});
                }});
    }
} catch(defPropException) {}

if (![].contains) {
    Object.defineProperty(Array.prototype, 'contains', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(searchElement/*, fromIndex*/) {
          if (this === undefined || this === null) {
            throw new TypeError('Cannot convert this value to object');
          }
          var O = Object(this);
          var len = parseInt(O.length) || 0;
          if (len === 0) { return false; }
          var n = parseInt(arguments[1]) || 0;
          if (n >= len) { return false; }
          var k;
          if (n >= 0) {
            k = n;
          } else {
            k = len + n;
            if (k < 0) k = 0;
          }
          while (k < len) {
            var currentElement = O[k];
            if (searchElement === currentElement ||
                searchElement !== searchElement && currentElement !== currentElement
            ) {
              return true;
            }
            k++;
          }
          return false;
        }
    });
}
