$(function () {
    //Toggle show/hide clipboard
    $(".colors").hover ( function () {
        $('.myclipboard', this).toggleClass ('clipboard_show');
    });
});