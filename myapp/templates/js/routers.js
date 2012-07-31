{% load url from future %}
{% load i18n %}
var PostRouter = Backbone.Router.extend({
    initialize: function(options) {
        if(options == undefined) options = {};
        if(options.postListView == undefined){
            this.postListView = new PostListView();
        }else{
            this.postListView = options.postListView;
        }
    },

    routes: {
        //':post_id': 'edit',
        'p:page': 'list',
        'add': 'add',
        ':id': 'get',
        'save': 'save',
        '*actions': 'make_list' // Backbone will try match the route above first
    },

    list: function(page){
        if(notempo.utils.element_exists('#post-container')){
            this.postView.remove();
        }
        this.postListView.list(page);
    },

    add: function(){
        var modelPost = new Post();
        modelPost.url = '{%url "add_post" %}';
        this.postView = new PostView({model:modelPost});
        this.postView.renderForm(this.postListView);
        if(notempo.utils.element_exists('#post-container')){
            this.postListView.remove();
        }
    },

    get: function(id) {
        var modelPost = new Post();
        this.postView = new PostView({model:modelPost});
        var router = this;
        var success = function(){
            router.postView.renderForm(router.postListView);

        };
        this.postView.model.url = '/post/' + id + '/';
        this.postView.model.fetch({success: success});
    },

    save: function(){
    },

    make_list: function( actions ){
        if(this.postView){
            this.postView.remove();
        }
        this.postListView.make_list();
    }
});
