(function(w,d, o2){
  'use strict';

  var fn = o2.fn,
      _ = o2._,
      $ = o2.$;

  fn.errors = (function(){

    var errBox, errContent;
    function showError(err) {
      if (_('error')) _('error').remove();
      errContent = [];
      errBox = document.createElement('error');
      errBox.dataset.deleClick = 'errors.close';
      errContent.push(
        '<errMsg>', err[0], '</errMsg>',
        '<linefile>Line ', err[2], ' : ', err[1], '</linefile>'
      );

      errBox.innerHTML = errContent.join('');
      $('body').appendChild(errBox);
    }

    function init() {
      console.error = function(){};
      window.onerror = function() {
        showError(arguments);
        return true;
      };
    }

    function close(el) {
      console.log(el);
      el.remove();
    }

    init();

    return {
      close: close
    }


  }());

}(window, document, window.o2));
