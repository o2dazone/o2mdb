/*!
 * Delegant
*/

(function(w,d){
  'use strict';

  var delegant = (function() {

    var
      evtTarget,
      obj,
      jumps = 0,
      base, lname,
      fn = {}
    ;

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function findObj (obj, names) {
      for (var i = 0, len = names.length; i < len; i++) {
        obj = obj[names[i]];
        if (typeof(obj) === 'function' && i === len-1) return obj; // super hacky method of detecting its the last function im going to developer hell
      }
    }

    function evtFunc(e, parent) {
      if (parent && parent.tagName === 'HTML') return; // if parent tag is HTML, don't delegate up anymore
      evtTarget = parent || e.target; // target is either parent (for jumping) or e.target
      if (jumps > 3) { jumps = 0; return; } // if you've jumped more than x times...return, dont look up anymore
      // overriding "obj" to save on allocation
      if ((obj = evtTarget.dataset['dele' + capitalize(e.type)])) {
        if (obj = findObj(fn, obj.split('.'))) {
          e.preventDefault();
          obj(evtTarget, e);
          jumps = 0;
        }
      } else {
        // you didn't find an data-dele element, so iterate the jumper and go up a parent
        jumps++;
        evtFunc(e, evtTarget.parentNode);
      }
    }

    function addListener(el,evt) {
      document.querySelector(el).addEventListener(
        evt,
        (function(e){evtFunc(e);}),
        true
      );
    }

    delegant = {
      bind: function(el,evt) {
        return typeof evt === 'string' ?
          addListener(el,evt) :
          evt.forEach(function(evt) {
            addListener(el,evt);
          });
      },

      register: function(name, func){
        name = name.split('.');
        base = fn;
        lname = arguments.length === 2 ?
                name.pop() :
                false;

        for (var i = 0, len = name.length; i < len; i++) {
          base = base[name[i]] = base[name[i]] || {};
        }

        if (lname) base = base[lname] = func;
        base = fn;
      }
    };

    return w.delegant = delegant;
  }());
}(window, document));