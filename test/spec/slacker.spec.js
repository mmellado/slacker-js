/**
 * @venus-library mocha
 * @venus-include ../../dev/slacker.js
 * @venus-fixture ../fixture/slacker-fixture.html
 */
describe('Spec for Slacker.js', function () {

  it('Slacker should be defined', function () {
    expect(typeof Slacker).to.be('function');
  });

  it('should have fixture elements', function () {
    var images = document.querySelectorAll('img');

    expect(images.length).to.be(8);
  });

  it('should load only images with the right class', function() {
    Slacker.init({
      imageSelector: '.unloaded'
    });

    var images = document.querySelectorAll('img'),
        firstImg = images[0],
        lastImg = images[7],
        firstAttr = firstImg.getAttribute('src'),
        lastAttr = lastImg.getAttribute('src');

    expect(firstAttr).to.be('i/pixel.gif');
    expect(lastAttr).to.be('i/img8.jpg');
  });

  it('should replace src value with attr value', function() {

    var s = new Slacker(),
        images = document.querySelectorAll('img'),
        image = images[7],
        attr;

    s.renderImage(image);
    attr = image.getAttribute('src');

    expect(attr).to.be('i/img8.jpg');
  });

  it('should remove data attribute after load', function() {
    Slacker.init();

    var images = document.querySelectorAll('img'),
        image = images[7],
        attr;

    attr = image.getAttribute('data-img-src');

    expect(attr).to.be(null);
  });

  it('should render all eligible images', function() {
    Slacker.init();

    var images = document.querySelectorAll('img[data-img-src]');

    expect(images.length).to.be(0);
  });

  it('should detect if image is in viewport', function() {
    var s = new Slacker();

    window.resizeTo(700, 600);
    var image = document.querySelector('img'),
        imgInViewport = s._imageInViewport(image);

    expect(imgInViewport).to.be(true);
  });

  it('should render image in viewport', function() {
    Slacker.init();

    var evt, image, attr;

    window.resizeTo(700, 600);
    window.scrollTo(0, document.body.scrollHeight);

    // simulate scroll
    evt = document.createEvent('UIEvents');
    evt.initUIEvent('scroll', true, false, window, 0);
    window.dispatchEvent(evt);

    image = document.getElementsByTagName('img')[0];

    attr = image.getAttribute('data-img-src');
    expect(attr).to.be(null);
  });

  it('should properly use preCallback', function() {
    Slacker.init({
      preCallback: function(image) {
        image.setAttribute('data-img-src', 'preImage.jpg');
      }
    });

    var images = document.querySelectorAll('img'),
        firstImage, src;

    firstImage = document.getElementsByTagName('img')[0];
    src = firstImage.getAttribute('src');
    expect(src).to.be('preImage.jpg');
  });

  it('should properly use postCallback', function() { 
    Slacker.init({
      postCallback: function(image) {
        image.setAttribute('src', 'postImage.jpg');
      }
    });

    var images = document.querySelectorAll('img'),
        firstImage, src;

    firstImage = document.getElementsByTagName('img')[0];
    src = firstImage.getAttribute('src');

    expect(src).to.be('postImage.jpg');
  });

});