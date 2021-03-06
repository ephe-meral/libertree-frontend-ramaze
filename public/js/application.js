$(document).ready( function() {

  $('#menu-account').click( function() {
    var show_window = ! $('#account-window').is(':visible');
    Libertree.UI.hideWindows();
    if (show_window) {
      $('#account-window').show();
    }
    return false;
  } );

  $('#toggle-sidebar').live('click', function() {
    $('#sidebar').toggle();
  } );

  // bootstrap popovers for additional information
  $("a[rel=popover]")
    .popover()
    .click(function() {
      return false;
    });

  $(document).click( function(event) {
    var t = $(event.target);
    if( t.closest('.window').length === 0 && ! t.hasClass('result-selected') ) {
      Libertree.UI.hideWindows();
    }
    // hide all popovers
    $("a[rel=popover]").popover('hide');
  } );


  $('input.preview').live( 'click', function() {
    var $this = $(this);
    var unrendered = $this.closest('form').find('textarea[name="text"]').val();

    // abort unless there is text to be rendered
    if (unrendered.length === 0) {
      return false;
    }

    var target = $this.closest('form.comment, form#post-new, form#post-edit, form#new-message');
    var preview_heading = $this.data('preview-heading');
    var close_label = $this.data('preview-close-label');
    var type = $this.data('type');
    var textType = null;
    if( type === 'post' ) {
      textType = 'post-text';
    }

    $.post(
      '/_render',
      { s: unrendered },
      function(html) {
        Libertree.Session.ensureAlive(html);
        if( target.length > 0 ) {
          $('.preview-box').remove();
          target.append( $('<div class="preview-box" class="'+type+'"><a class="close" href="#">'+close_label+'</a><h3 class="preview">'+preview_heading+'</h3><div class="text typed-text '+textType+'">' + html + '</div></div>') );
          var scrollable = target.closest('div.comments-pane');
          if( scrollable.length === 0 ) {
            scrollable = Libertree.UI.scrollable();
            var delta = $('.preview-box').offset().top - scrollable.scrollTop() - 100;
          } else {
            var delta = $('.preview-box').offset().top - 100;
          }
          scrollable.animate(
            { scrollTop: scrollable.scrollTop() + delta },
            delta * 2
          );
        }
      }
    );
  } );

  $('.preview-box a.close').live( 'click', function() {
    $(this).closest('.preview-box').remove();
    return false;
  } );

  $('.textarea-clear').live( 'click', function() {
    var id = $(this).data('textarea-id');
    $('#'+id).val('');
    $.get( '/textarea_clear/' + id );
  } );

  /* ---------------------------------------------------- */

  setInterval( Libertree.UI.updateAges, 60 * 1000 );
  Libertree.UI.TextAreaBackup.enable();

  $('textarea').live( 'mousedown', function() {
    $(this).data('width', $(this).outerWidth());
    $(this).data('height', $(this).outerHeight());
  } );

  $('textarea').live( 'mouseup', function() {
    var th = $(this);
    if( th.outerWidth() != th.data('width') || th.outerHeight() != th.data('height') ) {
      th.addClass('no-autoresize');
    }
    th.data('width', th.outerWidth());
    th.data('height', th.outerHeight());
  } );

  Libertree.UI.makeTextAreasExpandable();

  if( Libertree.UI.isTouchInterface() ) {
    $('body').addClass('touch-interface');
  }

  if( layout === 'narrow' ) {
    $('*').mouseover();
  }
} );
