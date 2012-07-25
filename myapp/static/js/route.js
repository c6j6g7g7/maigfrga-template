var WorkspaceRouter = Backbone.Router.extend({
    routes: {
        'post/:page': 'post_list',
        'post/add': 'post_add'
    },

    post_list: function(page){
           alert('post_list');
    },

    post_add: function(){
        alert('post_add');
    }
});
