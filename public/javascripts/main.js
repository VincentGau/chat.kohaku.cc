/**
 * Created by Kohaku on 6/14/2017.
 */

$(function(){


    // initialize variables
    var $input = $('#inputBox');  // the input area
    var $messages = $('#messageBox');  // the message area

    // colors of username
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];


    var socket = io();

    var user = getCookie('user');
    socket.emit('user joined', user);

    // keyboard event
    $(window).keydown(function(event) {
        // focus on the input area when Ctrl if pressed
        // if(event.ctrlKey){
        //     $input.focus();
        // }
        if (event.which === 13) {
            sendMessage();
            // return false;
        }
    });


    // get the color of a user
    function getUserColor(user){
        var hash = 7;
        for (var i = 0; i < user.length; i++) {
            hash = user.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    // send a chat message
    function sendMessage(){
        var message = $input.val();
        message = cleanInput(message);
        console.log(message);
        if(message){
            $input.val('');
            socket.emit('new message', {
                user: user,
                content: message,
            });
        }
    }

    $("#send-btn").click(function(){
        sendMessage();
    });


    // prevent markup injection !!!
    function cleanInput(input){
        return $('<div/>').html(input).text();
    }

    function addChatMessage(data){
        $("#messages").append($('<li>').text(msg.user + ":" + msg.content));
    }

    // get cookie value given the cookie name
    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) c_end = document.cookie.length;
                return decodeURIComponent(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    }


    // old version, where msg consists of content and username
    // socket.on('new message', function (msg) {
    //     console.log('mmmmsg: ' + msg.content + " from :" + msg.user);
    //     console.log('gogogo');
    //     $("#messages").append($('<li>').text(msg.user + ":" + msg.content));
    // });

    // when the server emit 'new message', execute addChatMessage
    socket.on('new message', function(msg){
        // addChatMessage(msg);
        // $("#messages").append($('<li class="new-message">').text(msg.user + ":" + msg.content));
        var $usernameDiv = $('<span class="username"/>')
            .text(msg.user)
            .css('color', getUserColor(msg.user));
        var $messageBodyDiv = $('<span class="messageBody">')
            .text(msg.content);
        console.log(getUserColor(msg.user));
        console.log($usernameDiv);
        $("#messages").append($('<li class="new-message">').append($usernameDiv, $messageBodyDiv));
    });


    socket.on('user joined', function (msg) {
        $("#messages").append($('<li class="user-join-left">').text(msg.username + ' 加入了.'));
        console.log(msg.username + ' joined');
        console.log(msg.onlineUsers);

        var userlist = msg.onlineUsers.split("&#&");
        console.log(userlist);
        var userlist_html = "<h4>在线用户(" + msg.numUsers + ")</h4>";
        userlist.forEach(function (item) {
            userlist_html += "<li class='user-list-user'>" + item + "</li>";
            console.log(item);
        });
        $("#user-list").html(userlist_html);

    });

    socket.on('user left', function (msg) {
        $("#messages").append($('<li class="user-join-left">').text(msg.username + ' 离开了.'));
        console.log(user + ' left');

        var userlist = msg.onlineUsers.split("&#&");
        console.log(userlist);
        var userlist_html = "<h4>在线用户(" + msg.numUsers + ")</h4>";
        userlist.forEach(function (item) {
            userlist_html += "<li class='user-list-user'>" + item + "</li>";
            console.log(item);
        });
        $("#user-list").html(userlist_html);
    })

    socket.on('kicked', function (username) {
//        alert(username);
//        如果当前用户user与事件传递过来的username相同，断开此socket
        if (user == username) {
            socket.close();
            $("#messages").append($('<li>').text('kicked!'));
        }
    });


});
