/*!
 * simple jQuery 'tabs' plugin
 * Author: Boris Searles
 * Licensed under the MIT license
 */
;(function ( $, window, document, undefined ) {

  /**
    <ul class="tab-bar">
      <li><a class="active" href="#demo">Demo</a></li>
      <li><a href="#html">HTML</a></li>
      <li><a href="#js">Javascript</a></li>
    </ul>
    <div class="tab demo active">
      <!-- content here -->
    </div>
    <div class="tab html">
      <!-- content here -->
    </div>
    <div class="tab js">
      <!-- content here -->
    </div>
  */
  $.fn.tabs = function ( options ) {

    options = $.extend( {}, $.fn.tabs.options, options );

    /**
     * Very basic tabbing functionality. Expects list with links
     * that contain anchors (i.e. #demo) that correspond to a class
     * in the form: div.demo.
     * @param {string} selector expected <UL> list element
     */
    var init = function($elem) {
      var $tabLinks = $elem.find(" li a");
      $tabLinks.each(function(i) {
        var tabName = this.href.split('#').pop();
        var $tab = $(this).parent().parent().parent().find('div.' + tabName);
        $(this).click(function() {
          $($elem).find('.active').removeClass('active');
          $(this).addClass('active');
          $tab.addClass('active').siblings().removeClass('active');
        });
      });
    };

    return this.each(function () {

      var $elem = $(this);
      init($elem); 

    });
  };

  $.fn.tabs.options = {};

})( jQuery, window, document );
