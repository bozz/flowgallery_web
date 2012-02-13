/*!
 * simple jQuery drop-down menu plugin
 * Author: Boris Searles
 * Licensed under the MIT license
 */
;(function ( $, window, document, undefined ) {

  /**
    <ul>
      <li>
        <a href="#">Documentation</a>
        <ul class="subnav">
          <li><a href="#">Documentation</a></li>
          <li><a href="#">Config Options</a></li>
        </ul>
      </li>
      <li>
        <a href="#">Demos</a>
        <ul class="subnav">
          <li><a href="demos/default_settings.html">Default Settings</a></li>
          <li><a href="demos/equal_sizes.html">Equal Sizes</a></li>
        </ul>
      </li>
      <li><a href="#">Download</a></li>
    </ul>
  */
  $.fn.dropit = function ( options ) {

    options = $.extend( {}, $.fn.dropit.options, options );

    var init = function($elem) {
      // add span for trigger element
      $elem.find('ul.subnav').parent().append("<span></span>");

      $elem.find("li span").click(function() {

        $subnav = $(this).parent().find("ul.subnav");
        $subnav.show(); // .slideDown('fast')

        $(this).parent(this).hover(function() {
          // nothing on hover over
        }, function(){
          $subnav.fadeOut('fast'); //slideUp('slow');
        });

      }).hover(function() {
        $(this).addClass("subhover");
      }, function(){
        $(this).removeClass("subhover");
      });
    };

    return this.each(function () {
      var $elem = $(this);
      init($elem);
    });
  };

  $.fn.dropit.options = {};

})( jQuery, window, document );
