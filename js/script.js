$(function() {
  var theLoc = $('#nav').position().top;
  $(window).scroll(function() {
    if(theLoc >= $(window).scrollTop()) {
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
    color: '#ddd', // #rgb or #rrggbb
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

  // init main drop-down menu
  $('ul.topnav').dropit();


  function loadContent(url) {
    spinner.spin();
    //if(url.charAt(url.length-1) === '#') {
      //$('#content .section').hide();
      //return;
    //}
    //$('#content').addClass('loading');

    $.ajax({
      url: url,
      dataType: 'html',
      cache: false,
      success: function(html){
        $('#demo-sections div.active').removeClass('active');
        $("#demo-sections").append(html);
        spinner.stop();
        initSection();
        $('#demo-sections div.active').fadeIn('slow');
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
        return ran = true;
      });
      return false;
    });
  }

  // init start page
  initSection();
  smoothScroll();

  $('#demo-selector').dropkick({
    change: function (value, label) {
      //alert('You picked: ' + label + ':' + value);
      loadContent('demos/' + value + '.html');
    }
  });

  $('#gallery1').flowgallery({
    easing: 'easeOutCubic'
  });
});
