/*
*                                                        ;
*                  :                                     ED.
*                 t#,                                    E#Wi
*                ;##W.   t                               E###G.      .
*               :#L:WE   EE.                  ..       : E#fD#W;     Ef.
*              .KG  ,#D  :KW;                ,W,     .Et E#t t##L    E#Wi
*              EE    ;#f   G#j              t##,    ,W#t E#t  .E#K,  E#K#D:
*             f#.     t#i   j#D.           L###,   j###t E#t    j##f E#  E#f.
*             :#G     GK itttG#K,        .E#j##,  G#fE#t E#t    :E#K:E#WEE##Wt
*              ;#L   LW. E##DDDDG:      ;WW; ##,:K#i E#t E#t   t##L  E##Ei;;;;.
*               t#f f#:  E#E           j#E.  ##f#W,  E#t E#t .D#W;   E#DWWt
*                f#D#;   E#E         .D#L    ###K:   E#t E#tiW#G.    E#t  #K;
*                 G#t    E##EEEEEEt :K#t     ##D.    E#t E#K##i      E#D  f##E,
*                  t     tffffffffft...      #G      ..  E##D.       jLLLLLLLLL;
*                                            j           E#t
*                                                        L:
*
*/

(function(w){
  'use strict';

  var o2 = function() {
    var dom = {};

    function selector(el) {
      if (!dom[el])
        dom[el] = document.getElementById(el);

      return dom[el];
    }

    return {
      dom: dom,
      $: selector
    };
  };

  w.o2 = o2();
}(window));