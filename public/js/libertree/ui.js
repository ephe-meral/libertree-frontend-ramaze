Libertree.UI = {
  setSpeed: function(speed) {
    return function(pixels) {
      // calculate the duration to move an amount of pixels at a given speed
      return pixels * 1000 / speed;
    };
  },

  continuousScrollHandler: function (loader) {
    if( $(window).scrollTop() + $(window).innerHeight() >= $(document).height() - 300 ) {
      if( Libertree.PostLoader.loading || $('#no-more-posts').length ) {
        return;
      }

      $('#post-excerpts div.spinner').appendTo($('#post-excerpts'));
      Libertree.UI.addSpinner('#post-excerpts div.spinner', 'append');
      loader();
    }
  },

  hideWindows: function() {
    $('#chat-window').resizable('destroy');
    $('.window').hide();
    Libertree.Chat.rememberDimensions();
  },

  //FIXME: src depends on selected theme
  addSpinner: function(target_selector, position, size) {
    $(target_selector)[position]('<img class="spinner size-'+size+'" src="/themes/default/images/spinner.gif"/>');
  },

  removeSpinner: function(target_selector) {
    $('img.spinner', target_selector).remove();
  },

  //TRANSLATEME
  updateAges: function() {
    $('.age').each( function(i) {
      if( $(this).text().match(/^seconds ago$/) ) {
        $(this).text('1 minute ago');
      } else {
        var m = $(this).text().match(/^(\d+) minutes? ago$/);
        if( m ) {
          $(this).text( (parseInt(m[1]) + 1) + ' minutes ago');
        }
      }
    } );
  },

  // TODO: replace with bootstrap popover
  fadingAlert: function(message, x, y) {
    var div = $('<div class="fading-alert has-shadow">'+message+'</div>');
    div.appendTo('html');

    if( ! ( typeof x === 'undefined' || typeof y === 'undefined' ) ) {
      div.css( { left: x+'px', top: y+'px' } );
    }
    setTimeout(
      function() {
        $('.fading-alert').fadeOut(2000);
      },
      1000 + message.length * 50
    );
  },

  TextAreaBackup: {
    timer: undefined,
    stored: '',
    enable: function() {
      Libertree.UI.TextAreaBackup.timer = setInterval(
        Libertree.UI.TextAreaBackup.save,
        15 * 1000
      );
    },
    disable: function() {
      clearInterval(Libertree.UI.TextAreaBackup.timer);
    },
    save: function() {
      $('textarea').each( function(i) {
        var text = $(this).val()
        if( text != '' && text != Libertree.UI.TextAreaBackup.stored ) {
          Libertree.UI.TextAreaBackup.stored = text;
          $.post(
            '/textarea_save',
            {
              text: text,
              id: $(this).attr('id')
            }
          );
          return false;
        }
      } );
    }
  }
};

// speed = pixels per second
Libertree.UI.duration = Libertree.UI.setSpeed(600);
