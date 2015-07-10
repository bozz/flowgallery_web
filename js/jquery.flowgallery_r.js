/*!
 * Refactored version for easier use
 * version 0.6.5r (25-OCT-2013)
 * Refactoring by: Robin Tenhagen
 * The code can be found at: https://github.com/stratege1988/flowgallery
 *
 * Original Version:
 * jQuery flowGallery plugin: Cover Flow Image Gallery
 * Examples and documentation at: http://github.com/bozz/flowGallery
 * version 0.6.5 (04-NOV-2012)
 * Author: Boris Searles (boris@lucidgardens.com)
 * Requires jQuery v1.3.2 or later
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
 

/* plugin point of entry */
$.fn.flowGallery = function(options) {
  // flowgallery = new FlowGallery();

  // flowgallery.setOptions(
  //   $.extend({}, $.fn.flowGallery.defaults, options)
  // );

  // this.each(function(index){
  //   flowgallery._initList(this);
  // });
  //
  // return flowgallery;

  
  return this.each(function() {
    var element = $(this);

    // Return early if this element already has a plugin instance
    if (element.data('flowGallery')) { return; }

    // pass options to plugin constructor
    var flowGallery = new FlowGallery(this, options);

    flowGallery.setOptions(
      $.extend({}, $.fn.flowGallery.defaults, options)
    );

    flowGallery._initList(this);

    // Store plugin object in this element's data
    element.data('flowGallery', flowGallery);
  });
};


// expose options
$.fn.flowGallery.defaults = {
  activeIndex: 0,          // index of image that is initially active
  animate: true,
  circular: false,
  enableKeyNavigation: true,   // enables forward/backward arrow keys for next/previous navigation
  forwardOnActiveClick: false, // should clicking on active image, show next image?
  forceWidth: false,
  forceHeight: false,
  backgroundColor: 'black',
  thumbWidth: 'auto',
  onClickFunc: null,
  thumbHeight: 'auto',
  thumbTopOffset: 'auto',  // top offset in pixels or 'auto' for centering images within list height
  imagePadding: 4,         // border of active image
  thumbPadding: 3,         // border of thumbnails
  loadingClass: "loading", // css class applied to <li> elements of loading images
  easing: 'linear',
  duration: 900            // animation duration (higher value = slower speed)
};

var FlowGallery = function() {

  var _elCounter;
  var _activeIndex;      // index of initial active element
  var _activeElem;  // reference to active <li> dom element
  var _activeLoaded;  // has active image been loaded?
  var _listElem;  // reference to <ul> list dom element
  var _listWidth;  // list width (default: screen width)
  var _listHeight;  // list height (height of highest image)
  var _centerX;  // horizontal center within list
  var _centerY;
  var _container; // parent element

  var _imgData;

  var _listElem;

  var _container;

  // applied options (overridden defaults)
  var _options = {};

  // IE work-around for multi click event calls
  var recentlyClicked = false;

  this.setOptions = function(options) {
    _options = options;
  }

  this.getOptions = function() {
    return _options;
  }

  // initialize:
  this._initList = function(elem) {
    _elCounter    = 0;
    _activeIndex  = 0;      // index of initial active element
    _activeElem   = false;  // reference to active <li> dom element
    _activeLoaded = false;  // has active image been loaded?
    _listElem     = false;  // reference to <ul> list dom element
    _listWidth  = 0;  // list width (default: screen width)
    _listHeight = 0;  // list height (height of highest image)
    _centerX    = 0;  // horizontal center within list
    _centerY    = 0;
    _container  = null; // parent element

    // stores initial image data (height, width, thumbHeight, thumbWidth)
    // format: [{
    //     h: 400,    // full size image height
    //     w: 200,    // full size image width
    //     th: 100,   // thumb height
    //     tw: 50     // thumb width
    // }]
    _imgData = [];

    _listElem = elem;

    _container = $(_listElem).css({
      listStyle: 'none',
      overflow: 'hidden',
      marginLeft: '0',
      paddingLeft: '0',
      position: 'relative',
      width: '100%'
    }).parent();

    if (_options.circular) {
      _children = $(_listElem).children();
      _children.clone().prependTo(_listElem);
      _children.clone().appendTo(_listElem);
      _options.activeIndex = _options.activeIndex + _children.length;
    }

    var wrapperElem = document.createElement('div');
    var captionElem = document.createElement('p');
    $(captionElem).addClass('bf-caption').css({
      backgroundColor: _options.backgroundColor,
      display: 'none',
      marginTop: '0',
      padding: '8px ' + (_options.imagePadding+10) + 'px 15px',
      position: 'absolute'
    });

    $(wrapperElem).addClass('bf-wrapper').css({
      position: 'relative'
    }).append(_listElem).append(captionElem);
    _container.append(wrapperElem);

    $(window).resize(function(){
      _listWidth = _container.width();
      _centerX = _listWidth*0.5;
      _updateFlow();
      _showCaption(_activeElem);
    });


    var listItems = $(_listElem).children();
    var activeImageHeight = false;

    // loop through list items to extract image data and determine list height
    listItems.each(function(index) {
      var img = $(this).find('img');
      if(_options.forceWidth) {
        img.width(_options.forceWidth);
      }

      var isLoaded = _isImageSizeLoaded(img.get(0));
      var dimensions = _getImageDimensions(img, isLoaded);
      _imgData.push(dimensions);

      _addLoadHandler(img, index);

      if(index===_activeIndex && isLoaded) {
        activeImageHeight = dimensions.h;
      }

      _initListItem(this, index);
    });

    _listWidth = _container.width();
    _centerX = _listWidth*0.5;

    if(activeImageHeight) {
      _centerY = _options.thumbTopOffset==='auto' ? activeImageHeight*0.5 : _options.thumbTopOffset;
    } else {
      _centerY = _options.thumbTopOffset==='auto' ? _listHeight*0.5 : _options.thumbTopOffset+_options.thumbHeight*0.5;
    }

    if(_options.enableKeyNavigation===true) {
      $(document).unbind('keydown', _handleKeyEvents).keydown(_handleKeyEvents);
    }

    _updateFlow();
  };

  var _handleKeyEvents = function(e) {
    if(e.keyCode===37) { // right arrow key
      _flowInDir(-1);
    } else if(e.keyCode===39) { // left arrow key
      _flowInDir(1);
    }
  };


  var _initListItem = function(elem, index) {
    $(elem).css({
      backgroundColor: _options.backgroundColor,
      position: 'absolute',
      textAlign: 'center'
    }).find('img').css({
      cursor: 'pointer',
      height: '100%',
      imageRendering: 'optimizeQuality', // firefox property
      //-ms-interpolation-mode: 'bicubic',  // IE property
      width: '100%'
    });

    if(!_activeElem && _options.activeIndex===index) {
      $(elem).addClass('active');
      _activeElem = elem;
      _activeIndex = index;
    }
    _elCounter++;
  };


  var _updateFlow = function(animate) {
    var isBefore = true;
    var leftOffset, topOffset, elWidth, elHeight, padding = 0;
    var completeFn = null;

    var afterFlowFn = function(){
      _showCaption(_activeElem);

      // adjust if width changed (i.e. if scrollbars get displayed)
      if(_container.width() !== _listWidth) {
        _listWidth = _container.width();
        _centerX = _listWidth*0.5;
        _updateFlow();
        _showCaption(_activeElem);
      }
    };

    var config = {};
    $(_listElem).children().each(function(i){
      if($(this).hasClass('active')) {
        config = {
          left: (_centerX - _options.imagePadding - _imgData[i].w * 0.5) + 'px',
          top: '0',
          width: _imgData[i].w+'px',
          height: _imgData[i].h+'px',
          padding: _options.imagePadding+'px'
        };
        isBefore = false;
        completeFn = afterFlowFn;
      } else {
        config = {
          left: _calculateLeftPosition(i, isBefore),
          top: (_centerY - _imgData[i].th*0.5) + 'px',
          width: _imgData[i].tw+'px',
          height: _imgData[i].th+'px',
          padding: _options.thumbPadding+'px'
        };
        completeFn = null;
      }

      // TODO: only animate visible images...
      if(animate) {
        $(this).stop().animate(config, { duration: _options.duration, easing: _options.easing, complete: completeFn });
      } else {
        $(this).css(config);
        if(completeFn) { completeFn(); }
      }

    });
  };

  var _calculateLeftPosition = function(current, isBefore) {
    var left = _centerX;
    if (isBefore) {
      left -= _imgData[_activeIndex].w*0.5;
      left -= _options.imagePadding;
      left -= (_activeIndex - current) * 10;
      left -= (_activeIndex - current) * 2 * _options.thumbPadding;
      for (i = current; i < _activeIndex; i++) {
        left -= _imgData[i].tw;
      }
      return left + 'px';
    } else {
      left += _imgData[_activeIndex].w*0.5;
      left += _options.imagePadding;
      left += (current - _activeIndex) * 10;
      left += (current - _activeIndex) * 2 * _options.thumbPadding;
      for (i = _activeIndex + 1; i < current; i++) {
        left += _imgData[i].tw;
      }
      return left + 'px';
    }
  };

  var _showCaption = function(elem) {
    var img = $(elem).find('img').get(0);
    if(!_isImageSizeLoaded(img)) { return false; }

    var caption = $(elem).parent().parent().find('p.bf-caption');
    var captionText = img.title;
    if(img.title.length > 0){
      caption.html(captionText);

      caption.css({
        left: _centerX - _options.imagePadding - _imgData[_activeIndex].w * 0.5,
        top: _imgData[_activeIndex].h + _options.imagePadding*2,
        width: _imgData[_activeIndex].w - 20
      });

      // set height of caption as bottom margin for list
      var fullHeight = $(_listElem).height() + caption.height() + 40;
      $(_listElem).parent().height(fullHeight);

      caption.fadeIn('fast');
    }
  };


  // returns image dimensions (isLoaded default: false)
  var _getImageDimensions = function(img, isLoaded) {
    isLoaded = isLoaded || false;

    var imgWidth, imgHeight, thumbWidth, thumbHeight = 0;
    if(isLoaded) {
      var img_raw = img.get(0);
      if(typeof img_raw.naturalWidth !== 'undefined') {
        imgWidth  = _options.forceWidth || img_raw.naturalWidth || img_raw.width;
        imgHeight = _options.forceHeight || img_raw.naturalHeight || img_raw.height;
      } else {
        var tmpImg = new Image();
        tmpImg.src = img.attr('src');
        imgWidth = tmpImg.width;
        imgHeight = tmpImg.height;
      }
    } else {
      imgWidth = img.attr('width');
      imgHeight = img.attr('height');
    }

    if(_options.thumbWidth === 'auto' && _options.thumbHeight == 'auto') {
      thumbWidth = 100;
      thumbHeight = Math.round(imgHeight * 100 / imgWidth);
    } else if (_options.thumbHeight === 'auto') {
      thumbWidth = _options.thumbWidth;
      thumbHeight = Math.round(imgHeight * Number(_options.thumbWidth) / imgWidth);
    } else if (_options.thumbWidth === 'auto') {
      thumbWidth = Math.round(imgWidth * Number(_options.thumbHeight) / imgHeight);
      thumbHeight = _options.thumbHeight;
    } else {
      thumbWidth = _options.thumbWidth;
      thumbHeight = _options.thumbHeight;
    }

    _updateListHeight(imgHeight);

    return {h:imgHeight, w:imgWidth, th:thumbHeight, tw:thumbWidth};
  };


  // checks if image has been fully loaded
  var _isImageSizeLoaded = function(img) {
    if((_options.forceWidth && _options.forceHeight) ||
       (img.width > _options.thumbWidth && img.height > 20)) {
      return true;
    }

    if(!img.complete) {
      return false;
    }
    if(typeof img.naturalWidth !== "undefined" && img.naturalWidth===0) {
      return false;
    }
    return true;
  };


  // handle loading of incomplete images
  var _addLoadHandler = function(img, index) {

    img.hide().parent().addClass(_options.loadingClass).css({
      height: _imgData[index].th,
      width: _imgData[index].tw
    });

    var loadCompleteFn = function(e){
      if (this.complete || (this.readyState === 'complete' && e.type ==='readystatechange')) {
        $(this).css('visibility', 'visible').parent().removeClass(_options.loadingClass);
        $(this).fadeIn();

        var dimensions = _getImageDimensions(img, true);
        _imgData[index] = dimensions;

        if(index===_options.activeIndex) {
          _activeLoaded = true;
          _centerY = _options.thumbTopOffset==='auto' ? dimensions.h*0.5 : _options.thumbTopOffset;
          if(e) { _updateFlow(); }
        } else {
          var animateParams = { height: dimensions.th };
          if(_activeLoaded) {
            animateParams.top = (_centerY - _imgData[index].th*0.5) + 'px';
          }
          img.parent().animate(animateParams);
        }

        _addClickHandler(img.parent());
      }
    };

    var raw_img = img.get(0);
    if(raw_img.complete) {
      loadCompleteFn.call(raw_img);
    } else {
      img.bind('load readystatechange', loadCompleteFn)
      .bind('error', function () {
        $(this).css('visibility', 'visible').parent().removeClass(_options.loadingClass);
      });
    }

  };

  var _activeClick = function() {
    $("p.bf-caption").hide();
    _currentIndex = _activeIndex;
    _activeIndex = 0;
    _activeElem = this;
    $(this).parent().children().each(function(i){
      if(_activeElem===this) {
        _activeIndex = i;
      }
    });
    _prepareFlow(_currentIndex);
    _updateFlow(_options.animate);
  };

  this.getActiveIndex = function() {
    return _activeIndex;
  };

  this.getLength = function() {
    return _imgData.length;
  };

  this.jump = function(index) {
    _flowInDir(index - _activeIndex);
    return this;
  };

  this.next = function(index) {
    _flowInDir(1);
    return this;
  };

  this.prev = function(index) {
    _flowInDir(-1);
    return this;
  };

  var _resetRecentlyClicked = function() {
    recentlyClicked = false;
  }

  // add click handler to listElement <li> containing image
  var _addClickHandler = function(elem) {

    $(elem).click(function(){  
      // IE work-around for multi click event calls
      if(recentlyClicked)
        return;
      recentlyClicked = true;
      window.setTimeout(_resetRecentlyClicked.bind(this), 80);

      if(this !== _activeElem) {
        _activeClick.bind(this).call();
      } else {
        if(_options.forwardOnActiveClick===true) {
          _flowInDir(1);
        }
        else if(_options.onClickFunc != null) {
          return _options.onClickFunc();
        }
      }	
    });

  };

  // trigger flow in direction from current active element;
  // positive value flows to the right, negative values to the left;
  var _flowInDir = function(dir) {
    var oldIndex = _activeIndex;
    var newIndex = _activeIndex + dir;

    if(dir<0 && newIndex >= 0) {
      _activeIndex = newIndex;
    } else if(dir>0 && newIndex < _imgData.length) {
      _activeIndex = newIndex;
    } else {
      return false;
    }
    _currentIndex = oldIndex;
    _activeElem = $(_listElem).children().get(_activeIndex);

    _prepareFlow(_currentIndex);
    _updateFlow(_options.animate);
  };

  var _offsetFlow = function(currentIndex, offset) {
    var targetIndex = _activeIndex;

    _activeIndex = currentIndex + offset;
    _activeElem = $(_listElem).children().get(_activeIndex);
    $(_listElem).find('.active').removeClass('active');
    $(_activeElem).addClass('active');
    _updateFlow(false);
    _activeIndex = targetIndex + offset;
    _activeElem = $(_listElem).children().get(_activeIndex);
  };

  var _circularFlow = function(currentIndex) {
    var _flowSize = $(_listElem).children().length / 3;

    if (currentIndex > _activeIndex) {
      if (_activeIndex < _flowSize) {
        _offsetFlow(currentIndex, _flowSize);
      }
    } else {
      if (_activeIndex > _flowSize * 2 - 1) {
        _offsetFlow(currentIndex, -_flowSize);
      }
    }
  }

  var _prepareFlow = function(currentIndex) {
    if (_options.circular) {
      _circularFlow(currentIndex);
    }

    $("p.bf-caption").hide();
    $(_listElem).find('.active').removeClass('active');
    $(_activeElem).addClass('active');

    // update width (changes if scrollbars disappear)
    _listWidth = _container.width();
    _centerX = _listWidth*0.5;
  };


  // set list height to height of tallest image (needed for overflow:hidden)
  var _updateListHeight = function(height) {
    if(height > _listHeight) {
      _listHeight = height;
      _listHeight += _options.imagePadding*2;
      $(_listElem).height(_listHeight);
    }
  };


}
