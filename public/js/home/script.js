$( function(){
    //setup before functions
    let typingTimer;                //timer identifier
    let doneTypingInterval = 500;  //time in ms, 5 second for example
    let $input = $('#searchterm');

    //on keyup, start the countdown
    $input.on('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    //on keydown, clear the countdown 
    $input.on('keydown', function () {
    clearTimeout(typingTimer);
    });

    //user is "finished typing," do something
    function doneTyping () {
    search();
    }
});
