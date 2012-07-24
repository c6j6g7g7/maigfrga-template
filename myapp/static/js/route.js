var WorkspaceRouter = Backbone.Router.extend({
    routes: {
        '/post/': 'post_list'
    },

    post_list: function(){
           console.log('post_list');
    }
});
