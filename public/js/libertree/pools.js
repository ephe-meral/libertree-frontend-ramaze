Libertree.Pools = {
  createPoolAndAddPost: function(post) {
    var postId = post.data('post-id');
    var textField = post.find('.pools .chzn-search input');
    textField.attr('disabled', 'disabled');
    var poolName = textField.val();
    $.get(
      '/pools/create_pool_and_add_post/'+poolName+'/'+postId,
      function(response) {
        var h = $.parseJSON(response);
        if(h.success) {
          $('.pools.window').hide();
          post.find('a.collect').addClass('hidden');
          post.find('a.collected').removeClass('hidden');
        } else {
          alert(h.msg);
        }
        textField.removeAttr('disabled');
      }
    );
  },

  addPost: function(poolId, postId, post, x, y) {
    $.get(
      '/pools/add_post/' + poolId + '/' + postId,
      function(response) {
        var h = $.parseJSON(response);
        $('div.pools').remove();
        if(h.success) {
          post.find('a.collect').addClass('hidden');
          post.find('a.collected').removeClass('hidden');
          Libertree.UI.fadingAlert(h.msg, x, y);
        } else {
          alert(h.msg);
        }
      }
    );
  }

};
