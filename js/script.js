$(function() {

  // webpage controller module
  var flowGalleryWeb = (function() {

    // cache for loaded sections, contains
    // key/value with hash/section
    var sectionCache = {};

    // sectionCache key of active section
    var activeSectionKey = null;

    // reference to loading spinner
    var spinner = null;

    // content element where spinner is loaded
    var contentElem = document.getElementById('demo-sections');


    // init 'fixed' top navigation bar
    var initFixedNav = function() {
      var $nav = $('#nav');
      var navTop = $nav.position().top;
      $(window).scroll(function() {
        if(navTop >= $(window).scrollTop()) {
          if($nav.hasClass('fixed')) {
            $nav.removeClass('fixed');
            $('#content').removeClass('fixed-nav');
          }
        } else if(!$nav.hasClass('fixed')) {
          $nav.addClass('fixed');
          $('#content').addClass('fixed-nav');
        }
      });
    };

    /**
     *  Enable smooth animated scrolling when clicking main
     *  navigation links.
     *  (copied from http://stasis.me)
     */
    var initSmoothScroll = function() {
      return $('#nav a[href*=#]').click(function() {
        var anchor, ran, target;
        anchor = $(this).attr('href').match(/#(.*)/)[1];
        target = $('a[name=' + anchor + ']');
        ran = false;
        // if(document.location.host.indexOf('localhost') == -1) {
        //   piwikTracker.trackPageView('nav/' + anchor);
        // }
        $('html, body').animate({
          scrollTop: target.offset().top - 60
        }, 400, function() {
          var offset;
          if (!ran) {
            offset = this.scrollTop;
            location.hash = anchor;
            this.scrollTop = offset;
          }
          ran = true;
          return ran;
        });
        return false;
      });
    };

    /**
     * Basic initialization of tabs
     * and any code highlighting
     */
    var initSection = function() {
      $('ul.tab-bar').tabs();
      $('pre code').each(function(i, e) {
        hljs.highlightBlock(e, '    ');
      });
    };

    /**
     * Initialize demo selector with DropKick for
     * prettier combo box.
     */
    var initDropKick = function() {
      $('#demo-selector').dropkick({
        change: demoSelectionHandler
      });
    };

    /**
     * Handle loading of demos, either load from
     * cache if available or load remotely otherwise.
     * @param {string} key demo key, used as cache key or to build remote url
     */
    var demoSelectionHandler = function(key) {
      setGalleriesEnabled(false);
      if(sectionCache[key]) {
        $('#demo-sections > div.section').hide();
        sectionCache[key].fadeIn('slow');

        activeSectionKey = key;
        setGalleriesEnabled(true);

        var flowgallery = sectionCache[key].find('div.demo ul').data('flowgallery');
        flowgallery.jump(0, false);

        // refocus selected demo
        $('#nav a[href=#demos]').click();
      } else {
        loadContent(key);
      }
    };

    /**
     * Initialize loading spinner (see http://fgnass.github.com/spin.js/)
     */
    var initSpinner = function() {
      var spinOpts = {
        lines: 8, // The number of lines to draw
        length: 30, // The length of each line
        width: 7, // The line thickness
        radius: 22, // The radius of the inner circle
        color: '#000', // #rgb or #rrggbb
        speed: 1.3, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: true // Whether to use hardware acceleration
      };
      spinner = new Spinner(spinOpts).spin(contentElem);
      spinner.stop();
    };

    /**
     *  Load remote content (i.e. the demos)
     *  @param {string} cacheKey key that content should be cached under
     */
    var loadContent = function(cacheKey) {
      var url = 'demos/_' + cacheKey + '.html';

      $('#demo-sections > div.section').hide();
      spinner.spin(contentElem);

      $.ajax({
        url: url,
        dataType: 'html',
        cache: false, // TODO! this should be true in production
        success: function(html){
          var $newSection = $(html);
          $("#demo-sections").append($newSection);
          spinner.stop();
          initSection();
          activeSectionKey = cacheKey;
          sectionCache[cacheKey] = $newSection; 
          $newSection.fadeIn('slow');
          $('#nav a[href=#demos]').click();
        }
      });
    };

    /**
     * Utility function for enabling/disabling all active
     * galleries. When galleries become hidden, they are
     * also disabled (i.e. disable key event handlers).
     */
    function setGalleriesEnabled(enabled) {
      if(activeSectionKey && sectionCache[activeSectionKey]) {
        sectionCache[activeSectionKey].find('div.demo ul').each(function(i) {
          var flowgallery = $(this).data('flowgallery');
          if(flowgallery) {
            flowgallery[enabled ? 'enable' : 'disable']();
          }
        });
      }
    }

    // return public interface
    return {
      // main initialization method
      init: function() {
        initFixedNav();
        initSmoothScroll();
        initSection();
        initDropKick();
        initSpinner();

        // init first demo gallery
        $('#gallery1').flowgallery({
          easing: 'easeOutCubic'
        });

        // init sectionCache with initial demo
        activeSectionKey = 'default_settings';
        sectionCache[activeSectionKey] = $('#demo-sections > div.section').first();
      }
    };

  }());

  // initialize web controller
  flowGalleryWeb.init();

});

