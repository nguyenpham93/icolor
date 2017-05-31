<template>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

        <link rel="shortcut icon" type="image/x-icon" href="/public/img/logo.png">
        <link rel="stylesheet" type="text/css" href="/public/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="/public/css/font-awesome.min.css">
        <link rel="stylesheet" type="text/css" href="/public/css/style.css">

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
        <script src="/public/js/vue.min.js"></script>
        <!--<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.6.0/clipboard.min.js"></script>-->
        <!--<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.17/vue.min.js"></script>-->
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script src="https://apis.google.com/js/platform.js" async defer></script>
        <script src="/public/js/jscolor.min.js"></script>
        <script src="/public/js/custom.js"></script>

        <div id="fb-root"></div>
        <script>(function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));</script>
        <script>!function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
            if (!d.getElementById(id)) {
                js = d.createElement(s);
                js.id = id;
                js.src = p + '://platform.twitter.com/widgets.js';
                fjs.parentNode.insertBefore(js, fjs);
            }
        }(document, 'script', 'twitter-wjs');</script>

        <script
                type="text/javascript"
                async defer
                src="//assets.pinterest.com/js/pinit.js"
        ></script>

    </head>
    <body>
    {{{app}}}
    {{{script}}}
    </body>

    </html>
</template>

<script>
</script>

<style>
</style>