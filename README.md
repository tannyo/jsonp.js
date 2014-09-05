# JSONP With Error Checking

At a previous job I had a project where I needed to retrieve data from YouTube and Vimeo. While YouTube always returns data even with an invalid video id, the Vimeo script element returns a 404 Not Found error on an invalid video ID. The jQuery version of JSONP does not support error handling and I needed to tell the user that an error had occured.

I must thank [Yuri Izgarshev](http://stackoverflow.com/questions/6946631/dynamically-creating-script-readystate-never-complete/18840568#18840568) for the code to detect an error loading a script in IE7 and IE8 since those versions of IE do not support an onerror event.

## Usage

    <script src="path/to/jsonp.min.js"></script>

or for jQuery:

    <script src="path/to/jquery-jsonp.min.js"></script>

To add a JSONP request, in your javascript call:

    jsonp("http://gdata.youtube.com/feeds/api/videos/TVLIB5KUYLM?v=2&alt=jsonc").always(function (result) {
      if (result.success) {
        // Script retrieved.
        if(result.data.error) {
          // Call error  function.
          youtube.error(result.data.message);
        } else {
          // Call success function.
          youtube.success(result.data);
        }
      } else {
        // Script not retrieved, call error function.
        youtube.error(result.msg);
      }
    });

For jQuery:

    $.jsonp("http://gdata.youtube.com/feeds/api/videos/TVLIB5KUYLM?v=2&alt=jsonc").always(function (result) {
      if (result.success) {
        // Script retrieved.
        if(result.data.error) {
          // Call error  function.
          youtube.error(result.data.message);
        } else {
          // Call success function.
          youtube.success(result.data);
        }
      } else {
        // Script not retrieved, call error function.
        youtube.error(result.msg);
      }
    });

## Syntax
### JSONP Object

**jsonp(url)**

url

String. Required. URL to retrieve. Does not include callback.

### JSONP Object Methods

**always(function(extendedData))**

Called on success and failure.

**success(function(extendedData))**

Called on success.

**done(function(data))**

Called on success.

**fail(function(msg)**

Called on error.

### JSONP Data Types

**extendedData**

A javascript JSON object that include success and data or msg.

**success**

Boolean. true or false

**data**

JSON object. Data passed to the callback function.

**msg**

String. An error message in the format of "Unable to retrieve jsonp at : <requested URL>".

## Browser Support

Tested in the latest versions of Chrome, Firefox, Safari, IE 5.5 - 11, iOS, and Android.

## Issues

Have a bug? Please create an [issue](https://github.com/tannyo/jsonp.js/issues) here on GitHub!

## Contributing

Want to contribute? Great! Just fork the project, make your changes and open a [pull request](https://github.com/tannyo/jsonp.js/pulls).

## Changelog
* 0.10 21 Jan 2014 TKO Created by Tanny O'Haley

## License

The MIT License (MIT)

Copyright (c) 2014 [Tanny O'Haley](http://tanny.ica.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
