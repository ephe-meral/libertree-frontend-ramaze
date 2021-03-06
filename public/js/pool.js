$(document).ready( function() {
  $('.post-tools .collect').live( 'click', function(e) {
    e.preventDefault();
    if( $('.pools.window:visible').length ) {
      $('.pools.window').hide();
      return false;
    }

    var x = e.clientX;
    var y = e.clientY;
    $('div.pools').remove();
    var collect_link = $(this);
    var post = collect_link.closest('div.post, div.post-excerpt');
    var postId = post.data('post-id');
    Libertree.UI.enableIconSpinner(collect_link.find('img'));
    $.get(
      '/pools/_index/' + postId,
      function(html) {
        Libertree.UI.disableIconSpinner(collect_link.find('img'));
        var o = $(html);
        o.insertAfter(post.find('.meta'));
        if( o.find('option').length === 2 ) {
          var option = $('select#pool-selector option:last');
          Libertree.Pools.addPost( option.val(), postId, post, x, y );
        } else {
          o.show();
          o.css( { left: (x-o.width()/2)+'px', top: (y+14)+'px' } );
          $('select#pool-selector').chosen( {
            //TRANSLATEME
            no_results_text: "<a href='#' class='create-pool-and-add-post'>Add to a new pool</a> called"
          } ).change( function() {
            Libertree.Pools.addPost( $('select#pool-selector').val(), postId, post, e.pageX, e.pageY );
          } );
        }
        $('#pool_selector_chzn a.chzn-single.chzn-default').mousedown();
      }
    );
    return false;
  } );

  $('.create-pool-and-add-post').live( 'click', function(e) {
    e.preventDefault();
    var post = $(this).closest('.post, .post-excerpt');
    Libertree.Pools.createPoolAndAddPost(post);
    return false;
  } );

  $('.pools .chzn-search input').live( 'keydown', function(event) {
    if( event.keyCode != 13 ) {
      return;
    }

    var post = $(this).closest('.post, .post-excerpt');
    Libertree.Pools.createPoolAndAddPost(post);
  } );

  $('.post-tools .remove').live( 'click', function(e) {
    e.preventDefault();
    var post = $(this).closest('div.post, div.post-excerpt');
    var postId = post.data('post-id');
    var poolId = $(this).data('pool-id');
    $.get(
      '/pools/_remove_post/' + poolId + '/' + postId,
      function() {
        /* TODO: Check for success */
        post.slideUp(1000);
      }
    );
    return false;
  } );

  $('li.pool a.delete').click( function() {
    if( ! confirm($(this).data('msg')) ) {
      return false;
    }
  } );

  $('.excerpts-view.pool #river-selector').chosen().change( function() {
    var selector = $('.excerpts-view.pool #river-selector');
    var riverId = selector.val();
    var poolId = selector.data('pool-id');
    Libertree.UI.addSpinner( selector.parent(), 'append' );
    $.get(
      '/rivers/add_spring/'+riverId+'/'+poolId,
      function() {
        Libertree.UI.removeSpinner( selector.parent() );
        Libertree.UI.fadingAlert( selector.data('msg') );
        selector.val('0');
        selector.trigger("liszt:updated");
      }
    );
    return false;
  } );
} );
