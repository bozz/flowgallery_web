$(function() {

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
  console.log("test...");
  var target = document.getElementById('content');
  var spinner = new Spinner(spinOpts).spin(target);


  // init main drop-down menu
  $('ul.topnav').dropit().find('a').click(menuClickHandler);

  function menuClickHandler() {
    loadContent(this.href);
    return false;
  }


  function loadContent(url) {
    spinner.spin();
    console.log("url: ", url);
    if(url.charAt(url.length-1) === '#') {
      $('#content .section').hide();
      console.log("chacha...");
      return;
    }
    $('#content').html('').addClass('loading').load(url, function() {
      spinner.stop();
      $('ul.tab-bar').tabs();

      initDemoDefault();

      // initialize code highlighting...
      $('pre code').each(function(i, e) {
        hljs.highlightBlock(e, '    ');
      });
    });
  }



  //loadContent('demos/default_settings.html');

  $('#demo-selector').change(function() {
    var link = $(this).find('option:selected').val();

    // reset gallery
    $('#gallery').data('flowgallery', null)
      .find('li').removeClass('active');

    switch(link) {
      case '#demo_default':
        initDemoDefault();
        break;
      case '#demo_equal_size':
        initDemoEqualSize();
        break;
      case '#demo_multiple_galleries':
        initDemoMultipleGalleries();
        break;
      case '#demo_scripting':
        initDemoScripting();
        break;
    }
  });


  var initDemoDefault = function() {
    $('#gallery').flowgallery({
      easing: 'easeOutCubic'
    });
    $('#gallery2').flowgallery({
      easing: 'easeOutCubic'
    });
  };

  var initDemoEqualSize = function() {
    $('#gallery').flowgallery({
      easing: 'easeOutCubic',
      imagePadding: 0,
      thumbPadding: 0,
      thumbHeight: 400,
      thumbWidth: 640
    });
  };

  var initDemoMultipleGalleries = function() {
    $('#gallery').flowgallery({
      easing: 'easeOutCubic'
    });
  };

  var initDemoScripting = function() {
    $('#gallery').flowgallery({
      easing: 'easeOutCubic'
    });
    console.log("check: ", $('#gallery').data('flowgallery'));
  };

  // init default
  //initDemoDefault();

});
