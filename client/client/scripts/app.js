app = {
    server: 'http://127.0.0.1:3000/message',
    username: 'anonymous',
    lastMessageId: 0,

    init: function() {
      // Get username
      app.username = window.location.search.substr(10);
      app.loadAllMessages();

      // cache some dom references
      app.$text = $('#message');

      $('#send').on('submit', app.handleSubmit);
    },

    loadAllMessages: function(){
      app.loadMsgs();
      console.log('trying to load messages');
      setTimeout(app.loadAllMessages, 1000);
    },

    handleSubmit: function(e){
      e.preventDefault();

      var message = {
        username: app.username,
        text: app.$text.val()
      };

      app.$text.val('');

      app.sendMsg(message);
    },

    renderMessage: function(message){
      var $user = $("<div>", {class: 'user'}).text(message.username);
      var $text = $("<div>", {class: 'text'}).text(message.text);
      var $message = $("<div>", {class: 'chat', 'data-id': message.objectId }).append($user, $text);
      return $message;
    },

    processNewMessage: function(message, objectId){
      message.objectId = objectId;
      app.processNewMessages([message]);
    },

    processNewMessages: function(messages){
      // messages arrive newest first
      // messages = JSON.parse(messages);
      // debugger;
      for( var i = messages.length; i > 0; i-- ){
        var message = messages[i-1];
        // check if objectId is in dom.
        console.log($('#chats').find('.chat[data-id='+message.objectId+']'));
        if( $('#chats').find('.chat[data-id='+message.objectId+']').length === 0 ){
         $('#chats').prepend(app.renderMessage(message));
        }
      }
    },

    loadMsgs: function(){
      $.ajax({
        url: app.server,
        type: 'GET',
        // data: { order: '-createdAt'},
        contentType: 'application/json',
        success: function(json){
          json = JSON.parse(json);
          app.processNewMessages(json);
        },
        complete: function(){
          app.stopSpinner();
        }
      });
    },

    sendMsg: function(message){
      $.ajax({
        type: 'POST',
        url: app.server,
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function(json){
          //console.log(json);
          // app.processNewMessage(message, json.objectId);
        },
        complete: function(){
          app.stopSpinner();
        }
      });
    },

    startSpinner: function(){
      $('.spinner img').show();
      $('form input[type=submit]').attr('disabled', "true");
    },

    stopSpinner: function(){
      $('.spinner img').fadeOut('fast');
      $('form input[type=submit]').attr('disabled', null);
    }

};
