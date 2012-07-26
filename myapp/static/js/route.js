var WorkspaceRouter = Backbone.Router.extend({
    routes: {
        'p:page': 'post_list',
        'add': 'post_add'
    },

    post_list: function(page){
        alert(page);
           alert('post_list');
    },

    post_add: function(){
        alert('post_add');
    }
});
