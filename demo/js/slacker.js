/*!
  slacker.js - v0.0.1 - 2014-11-17
  Standalone JavaScript tool to lazy load images on a page.
*/
/*!
  slacker.js - v0.0.1 - 2014-11-17
  Standalone JavaScript tool to lazy load images on a page.
*/
/*!
  Copyright 2014 LinkedIn Corp. All rights reserved. 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

var Slacker = (function(){
  
  // Non Instance Methods

  /**
   * Empty function for caching purposes
   *
   * @function _noop
   * @private
   */
  var _noop = function() {};

  function Slacker(config) {
    var _this = this,
        timeout;
    
    config = config || {};
    config.dataAttribute = config.dataAttribute || 'data-img-src';
    config.imageSelector = config.imageSelector || 'img[' + config.dataAttribute + ']';
    config.preCallback = config.preCallback || _noop;
    config.postCallback = config.postCallback || _noop;
    config.offset = config.offset || 100;

    _initLoadingEvents();

    // Public Methods
    
    /**
     * Replaces the src value with the images real url
     *
     * @function renderImage
     * @public
     *
     * @param {HTMLElement} img   The image to be loaded
     */
    _this.renderImage = function(img) {
      var attr = config.dataAttribute,
          attrValue;

      // Only attempt to load the image if it actually contains the data attribute
      if (img.hasAttribute(attr)) {
        attrValue = img.getAttribute(attr);
        attrValue = config.preCallback(img, attrValue) || img.getAttribute(attr);

        // Set the right source and remove the data attribute
        img.setAttribute('src', attrValue);
        img.removeAttribute(attr);
        // Trigger callback in case the user want's to do something with the image after it loads
        config.postCallback(img);
      }
    };

    /**
     * Loads all images requested by the user
     *
     * @function renderAllImages
     * @public
     */
    _this.renderAllImages = function() {
      var imageArray = _getImages(),
          imgArrayLength = imageArray.length,
          i = 0;

      for (i; i < imgArrayLength; i++) {
        _this.renderImage(imageArray[i]);
      }
    };

    /**
     * Clears events that check if images are in viewport
     *
     * @function destroy
     * @public
     */
    _this.destroy = function() {
      if (window.addEventListener) {
        window.removeEventListener('scroll', _debouncedImageLoad);
        window.removeEventListener('resize', _debouncedImageLoad);
      } else {
        window.detachEvent('onscroll', _debouncedImageLoad);
        window.detachEvent('onresize', _debouncedImageLoad);
      }
    };

    // Private Methods
    
    /**
     * Retrieves an array containing all images to be lazy loaded.
     *
     * @function _getImages
     * @private
     *
     * @return {NodeList} Object containing all unloaded images.
     */
    var _getImages = function() {
      return document.querySelectorAll(config.imageSelector);
    };

    /**
     * Determines if an element is visible in the viewport
     *
     * @function _imageInViewport
     * @private
     *
     * @param {HTMLElement} el  The element to be found.
     * @return {boolean}        Indicates if the element was found.
     */
    var _imageInViewport = function(el) {
      var box = el.getBoundingClientRect(),
          view = {
            left: 0 - config.offset,
            top: 0 - config.offset,
            bottom: (window.innerHeight || document.documentElement.clientHeight) + config.offset,
            right: (window.innerWidth || document.documentElement.clientWidth) + config.offset
          };
      

      return (box.right >= view.left && 
              box.bottom >= view.top && 
              box.left <= view.right && 
              box.top <= view.bottom);
    };

    /**
     * Replaces the src value with the images real url for all images in viewport.
     *
     * @function _loadImagesInViewport
     * @public
     */
    function _loadImagesInViewport() {
      var imageArray = _getImages(),
          imgArrayLength = imageArray.length,
          i = 0,
          image;

      // If there are still images to load, check if they need to be loaded
      if (imgArrayLength) {

        // Attempt to load images
        for (i; i < imgArrayLength; i++) {
          image = imageArray[i];

          // If image is in view port, load it and store its index for removal
          if (_imageInViewport(image)) {
            _this.renderImage(image);
          }
        }
      }
    }

    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds.
     *
     * @function _debounce
     * @private
     * 
     * @param  {function} func      The function to be executed
     * @param  {number}   wait      Timeout between every function call
     * @return {function}           The function executed with a timeout
     */
    function _debounce(func, wait) {
       if (timeout) {
        return false;
      }
      clearTimeout(timeout);
      timeout = setTimeout(function(){
        func.apply(this);
        timeout = null;
      }, wait);
    }

    /**
     * Triggers the viewport image loading with a 100ms debounce
     * 
     * @function _debouncedImageLoad
     * @private
     */
    function _debouncedImageLoad() {
      _debounce(_loadImagesInViewport, 100);
    }

    /**
     * Attaches listeners for necessary events to check if images are in viewport
     *
     * @function _initLoadingEvents
     * @private
     */
    function _initLoadingEvents() {
      if (window.addEventListener) {
        window.addEventListener('load', _loadImagesInViewport, false);
        window.addEventListener('scroll', _debouncedImageLoad, false);
        window.addEventListener('resize', _debouncedImageLoad, false);
      } else if (window.attachEvent) {
        window.attachEvent('onload', _loadImagesInViewport);
        window.attachEvent('onscroll', _debouncedImageLoad);
        window.attachEvent('onresize', _debouncedImageLoad);
      }
    }

    /**
     * Testing API. Will only be exposed when compiling in dev
     */
    /*
    _this._imageInViewport = _imageInViewport;
    _this._loadImagesInViewport = _loadImagesInViewport();
    */
  }

  Slacker.init = function(config) {
    return new Slacker(config);
  };

  return Slacker;
}());