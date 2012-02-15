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
  var contentElem = document.getElementById('content');
  var spinner = new Spinner(spinOpts).spin(contentElem);
  spinner.stop();


  // cache for loaded sections, contains
  // key/value with hash/section
  var sectionCache = {};

  // init main drop-down menu
  $('ul.topnav').dropit();


  function loadContent(url) {
    //spinner.spin();
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
        $('#content > div.active').removeClass('active');
        $("#content").append(html);
        spinner.stop();
        initSection();
        $('#content > div.active').fadeIn('slow');
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

  //handle hash changes
  function handleHashChanges(newHash, oldHash){
    console.log("jaja", newHash);
    if(newHash.indexOf('demos/') !== -1) {
      loadContent(newHash);
    } else {
      //spinner.stop();
      //$('#content > div.active').show();
    }
  }

  hasher.changed.add(handleHashChanges); //add hash change listener
  //hasher.initialized.add(handleHashChanges); //add initialized listener (to grab initial value in case it is already set)
  hasher.init(); //initialize hasher (start listening for history changes)

  // init start page
  initSection();

  $('#gallery1').flowgallery({
    easing: 'easeOutCubic'
  });
});
