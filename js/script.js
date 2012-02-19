$(function() {
  // init 'floating' nav
  var navBar = $('#nav').position().top;
  $(window).scroll(function() {
    if(navBar >= $(window).scrollTop()) {
      if($('#nav').hasClass('fixed')) {
        $('#nav').removeClass('fixed');
        $('#content').removeClass('fixed-nav');
      }
    } else { 
      if(!$('#nav').hasClass('fixed')) {
        $('#nav').addClass('fixed');
        $('#content').addClass('fixed-nav');
      }
    }
  });

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
  var contentElem = document.getElementById('demo-sections');
  var spinner = new Spinner(spinOpts).spin(contentElem);
  spinner.stop();

  // cache for loaded sections, contains
  // key/value with hash/section
  var sectionCache = {};

  // sectionCache key of active section
  var activeSectionKey = null;

  // init main drop-down menu
  $('ul.topnav').dropit();


  function loadContent(url, cacheKey) {
    $('#demo-sections > div.section').hide();
    spinner.spin(contentElem);

    $.ajax({
      url: url,
      dataType: 'html',
      cache: false,
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
  }

  // some basic initialization of tabs
  // and any code highlighting
  function initSection() {
    $('ul.tab-bar').tabs();
    $('pre code').each(function(i, e) {
      hljs.highlightBlock(e, '    ');
    });
  }

  // copied from http://stasis.me
  function smoothScroll() {
    return $('#nav a[href*=#]').click(function() {
      var anchor, ran, target;
      anchor = $(this).attr('href').match(/#(.*)/)[1];
      target = $('a[name=' + anchor + ']');
      ran = false;
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
  }

  function setGalleriesEnabled(enabled) {
    if(activeSectionKey && sectionCache[activeSectionKey]) {
      sectionCache[activeSectionKey].find('div.demo ul').each(function(i) {
        var flowgallery = $(this).data('flowgallery');
        flowgallery[enabled ? 'enable' : 'disable']();
      });
    }
  }

  // init start page
  initSection();
  smoothScroll();

  $('#demo-selector').dropkick({
    change: function (value, label) {
      setGalleriesEnabled(false);
      if(sectionCache[value]) {
        $('#demo-sections > div.section').hide();
        sectionCache[value].fadeIn('slow');

        activeSectionKey = value;
        setGalleriesEnabled(true);
        $('#nav a[href=#demos]').click();
      } else {
        loadContent('demos/_' + value + '.html', value);
      }
    }
  });

  $('#gallery1').flowgallery({
    easing: 'easeOutCubic'
  });

  // init sectionCache with initial demo
  activeSectionKey = 'default_settings';
  sectionCache[activeSectionKey] = $('#demo-sections > div.section').first();
});
