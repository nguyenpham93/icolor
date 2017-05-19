//Copy hex code
function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a flash,
    // so some of these are just precautions. However in IE the element
    // is visible whilst the popup box asking the user for permission for
    // the web page to copy to the clipboard.
    //

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
}


// function pickColor() {
//     let img = _('.previewimg img'),
//         canvas = _('#cs'),
//         result = _('.result'),
//         preview = _('.preview'), x = '', y = '';
//
//
// // click function
//     img.addEventListener('click', function (e) {
//         // chrome
//         if (e.offsetX) {
//             x = e.offsetX;
//             y = e.offsetY;
//         }
//         // firefox
//         else if (e.layerX) {
//             x = e.layerX;
//             y = e.layerY;
//         }
//         useCanvas(canvas, img, function () {
//             // get image data
//             var p = canvas.getContext('2d')
//                 .getImageData(x, y, 1, 1).data;
//             // show info
//             // result.innerHTML = '<span>HEX: ' + rgbToHex(p[0], p[1], p[2]) + '</span>' +
//             //     '<span>RGB:  rgb(' +
//             //     p[0] + ',' +
//             //     p[1] + ',' +
//             //     p[2] + ')</span>';
//             let hexColor = rgbToHex(p[0], p[1], p[2]);
//             console.log(hexColor);
//             // add background in body
//             //document.body.style.background = rgbToHex(p[0], p[1], p[2]);
//         });
//     }, false);
//
// // preview function mousemove
//     img.addEventListener('mousemove', function (e) {
//         // chrome
//         if (e.offsetX) {
//             x = e.offsetX;
//             y = e.offsetY;
//         }
//         // firefox
//         else if (e.layerX) {
//             x = e.layerX;
//             y = e.layerY;
//         }
//
//         useCanvas(canvas, img, function () {
//
//             // get image data
//             let p = canvas.getContext('2d')
//                 .getImageData(x, y, 1, 1).data;
//             // show preview color
//             //preview.style.background = rgbToHex(p[0], p[1], p[2]);
//         });
//     }, false);
//
//
// // canvas function
//     function useCanvas(el, image, callback) {
//         el.width = image.width; // img width
//         el.height = image.height; // img height
//         // draw image in canvas tag
//         el.getContext('2d')
//             .drawImage(image, 0, 0, image.width, image.height);
//         return callback();
//     }
//
// // short querySelector
//     function _(el) {
//         return document.querySelector(el);
//     };
//
// // convert rgba to hex
// // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
//     function componentToHex(c) {
//         var hex = c.toString(16);
//         return hex.length == 1 ? "0" + hex : hex;
//     }
//
//     function rgbToHex(r, g, b) {
//         return componentToHex(r) + componentToHex(g) + componentToHex(b);
//     }
//
//     function findPos(obj) {
//         var curleft = 0, curtop = 0;
//         if (obj.offsetParent) {
//             do {
//                 curleft += obj.offsetLeft;
//                 curtop += obj.offsetTop;
//             } while (obj = obj.offsetParent);
//             return {x: curleft, y: curtop};
//         }
//         return undefined;
//     }
// }

// $('.box-color input').on({
//     focusout: function () {
//         $(this).removeAttr('check');
//     },
//     focusin: function () {
//         let color = $(this).attr('name');
//         $(this).attr('check', color);
//     }
// });

// $('.box-color input, .previewimg img').on('focusout', function() {
//     $(this).removeAttr('check');
// });
//
// $('.box-color input').on('focusin', function() {
//     let color = $(this).attr('name');
//     $(this).attr('check', color);
// });

// $('.previewimg img').click(function(){
//
// })


function shareSocial(social, w, h) {
    let left = (screen.width / 2) - (w / 2);
    let top = (screen.height / 2) - (h);
    let hreff = '';
    switch (social) {
        case "facebook":
            hreff = $("#facebook").attr('href');
            break;
        case "twitter":
            hreff = $("#twitter").attr('href');
            break;
        default:
            hreff = "";
    }
    return window.open (hreff, "targetWindow", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}