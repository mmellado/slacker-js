Slacker JS
===============

Slacker is a standalone JavaScript tool to lazy load images on a page. Slacker uses `data-` attributes which store the images actual source and then replace a dummy src in the image when it becomes visible in the viewport.

View demo: [http://mellados.com/labs/slacker](http://mellados.com/labs/slacker)

## How to use

The first step is to include the script in your HTML file. Since no additional libraries are needed, there is no other requirement

```HTML
<script src="slacker-js/dist/slacker.min.js"></script>;
```

Then, add some images to your page. As the `src` attribute, add [this transparent pixel](http://mellados.com/labs/slacker/i/pixel.gif) or any other placeholder image,
and add your image's path/url in the `data-img-src` attribute of your image

```HTML
<img src="images/pixel.gif" data-img-src="images/myImagePath.jpg" width="200" height="100" />
```

After that, you just need to initialize the loader in your page

```HTML
<script>
  Slacker.init();
</script>
```

Another option would be to create one or more instances

```HTML
<script>
  var s = new Slacker();
</script>
```

## Options

The following configuration options are available for initializing Slacker

### dataAttribute

Type: `String` Default `data-img-src`

The `imgPlaceholder` option allows you to select the data attribute where the image src will be stored before loading the image.

### imageSelector

Type: `String` Default: The selector is defaulted to all images with the specified dataAttribute

The `imageSelector` option allows you to set a CSS selector for images to be loaded.

### offset

Type : `Integer` Defaults `100`

The viewport offset for images to be loads. 

```javaScript
Slacker.init({
  offset: 500
})

```

### preCallback

Type: `Function`

Return: The updated value of the data attribute

This callback will be executed before each image is loaded. This is useful for url formatting before images are loaded.

```javaScript
var s = new Slacker({
  preCallback: function(img, dataAttr) {
    return basePath + dataAttr;
  }
});
```

### postCallback

Type: `Function`

This callback will be executed after each image is loaded. This is useful if any actions need to be triggered after an image loads, like adding a class.

```javaScript
Slacker.init({
  postCallback: function(img) {
    img.className += ' loaded';
  }
});
```

## renderImage(image)

The `renderImage` function has been made public for custom uses. It takes an image as a parameter as follows: `Slacker.loadImage(myImage);` where `myImage` is a DOM object representing an image.

With this function, you can load images at any given moment even if they are outside the viewport.

## renderAllImages()

The `renderAllImages` function has also been made public. With it you can load all the unloaded images. You can use it like this:

```javaScript
var s = new Slacker();
s.renderAllImages();
```

## destroy

The `destroy` function disables the event listeners to check for images to be loaded on scroll and resize

```javaScript
var s = new Slacker({imageSelector: '.infinite-scroll img'});
var t = new Slacker({imageSelector: '.right-rail img'})
t.destroy();
```

## License
Copyright 2014 LinkedIn Corp. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at  http://www.apache.org/licenses/LICENSE-2.0
 
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
