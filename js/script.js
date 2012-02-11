$(function() {

  // add span for trigger element
  $("ul.subnav").parent().append("<span></span>");

  $("ul.topnav li span").click(function() {

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

  var FlowUtils = {
    /**
     * Very basic tabbing functionality. Expects list with links
     * that contain anchors (i.e. #demo) that correspond to an ID
     * in the form: #demo-tab.
     * @param {string} selector expected <UL> list element
     */
    initTabs: function(selector) {
      var $tabLinks = $(selector + " li a");
      $tabLinks.each(function(i) {
        var tabName = this.href.split('#').pop();
        var $tab = $(this).parent().parent().parent().find('div.' + tabName);
        $(this).click(function() {
          $(selector).find('.active').removeClass('active');
          $(this).addClass('active');
          $tab.addClass('active').siblings().removeClass('active');
        });
      });
    }
  };


  $('#content').load('demos/default_settings.html', function() {
    console.log("test...");
    FlowUtils.initTabs('ul.tab-bar');
    initDemoDefault();
  });

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
  initDemoDefault();

});
