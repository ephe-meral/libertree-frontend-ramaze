$(document).ready( function() {

  $('.post-tools a.like').live( 'click', function(event) {
    Libertree.Posts.like( $(this), event, 'div.post, .post-excerpt' );
  } );

  $('.post-tools a.unlike').live( 'click', function(event) {
    Libertree.Posts.unlike( $(this), event, 'div.post, .post-excerpt' );
  } );

  $('.mark-read').live( 'click', function() {
    Libertree.Posts.markRead( $(this).closest('div.post, div.post-excerpt').data('post-id') );
    return false;
  } );

  $('#comments-hide').click( function() {
    $('div.post').addClass('with-comments-sliding');
    $('div.comments, #comments-hide').hide();
    $('#comments-show').show();
    $('div.post-pane, div.comments-pane').toggleClass(
      'expanded-post',
      500
    );
  } );
  $('#comments-show').click( function() {
    $('#comments-show').hide();
    $('#comments-hide').show();
    $('div.comments-pane, div.post-pane').toggleClass('expanded-post', 500).promise().done(
      function () {
        $('div.comments').show();
        $('div.post').removeClass('with-comments-sliding');
      }
    );
  } );

  $('.post-excerpt .hide').live( 'click', function() {
    $(this).hide();
    $(this).siblings('.confirm-hide').show();
    return false;
  } );
  $('.post-excerpt .confirm-hide').live( 'click', function(event) {
    event.preventDefault();
    var post = $(this).closest('div.post-excerpt');
    $.get(
      '/posts/hidden/create/' + post.data('post-id') + '.json',
      function(response) {
        var h = $.parseJSON(response);
        if( h.success ) {
          post.slideUp(1000).promise().done(function() { post.remove(); });
        }
      }
    );
  } );

  $('.mark-unread').live( 'click', function() {
    var post = $(this).closest('div.post, div.post-excerpt');
    $.get(
      '/posts/_unread/' + post.data('post-id'),
      function() {
        post.find('.mark-unread').addClass('hidden');
        post.find('.mark-read').removeClass('hidden');
      }
    );
    return false;
  } );

  $('.post-tools .delete').live( 'click', function(event) {
    event.preventDefault();
    if( confirm($(this).data('msg')) ) {
      var post = $(this).closest('div[data-post-id]');
      window.location = '/posts/destroy/' + post.data('post-id');
    }
  } );

  $('.post-tools .subscribe').live( 'click', function() {
    var post = $(this).closest('div.post, div.post-excerpt');
    Libertree.Posts.subscribe( post );
    return false;
  } );
  $('.post-tools .unsubscribe').live( 'click', function() {
    var post = $(this).closest('div.post, div.post-excerpt');
    Libertree.Posts.unsubscribe( post );
    return false;
  } );
} );
