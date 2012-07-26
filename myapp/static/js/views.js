var  LoginView = Backbone.View.extend({
    el: '#login-container',

    initialize: function(params){
        //If models is not setted in params, we must create a model instance
        if(params != undefined){
            if(params.model == undefined){
                this.model = new UserLogin;
            }
        }
        else{
            this.model = new UserLogin;
        }
    },

    events: {
        "click #loginBtn": "login"
    },

    render: function(params) {
        if (params == undefined) params = {};
        if(params.errors != undefined ){
            //If param.errors is definided, a validation error has happen and has to be rendered
            notempo.utils.show_errors(this.$el, params);
            }
        return this;
    },

    login: function(e){
        e.preventDefault();
        //set the input values to the model and perform validation
        this.model.set({'username': this.$("#id_username").val(),
                        'password': this.$("#id_password").val()
                        });
        Backbone.Validation.bind(this);

        if (!this.model.isValid(['username', 'password'])){
            var params = {'errors': this.model.validate()};
            this.render(params);
        }
        else{
            //success function tha executes after response has delivered from server
            var current_view = this;
            var success = function(model, response){
                if(response.errors != undefined){
                    var params = {'errors': response.errors};
                    current_view.render(params);
                }else{
                    if(response.ok != undefined){
                            window.location.replace(response.ok.url);
                        }
                }
             };

             this.model.save({},{success: success});
        }
    }
});

var PostListView = Backbone.View.extend({
    url: '/post/',
    el: '#post-list',
    initialize: function(params){
        //If models is not setted in params, we must create a model instance
        if(params != undefined){
            if(params.models == undefined){
                this.models = new PostCollection;
            }else{
                this.models = params.models;
            }
        }
        else{
            this.models = new PostCollection;
        }
    },
    events: {
        'click #post-listd div.pagination ul li a': 'list'
    },
    list : function(page){
       this.models.fetch({data: {page: page}});
       this.render();
    },
    render: function(params){
        var str_template = ['<tr>',
                            '<td><%= title %></td>',
                            '<td><%= slug %></td>',
                            '<td><%= content %></td>',
                            '<td><%= status %></td>',
                            '<td>',
                            '<a class="btn btn-success" href="#">',
                            '<i class="icon-white icon-edit"></i>edit</a></td>',
                            '</tr>']
        var template = _.template(str_template.join(''));
        var post_list = '';
        var build_records = function(obj){
             post_list += template(obj.attributes);
            }
        _.each(this.models.models, build_records);
        this.$el.find('tbody').empty().html(post_list);
    }
});

var PostView = Backbone.View.extend({
    el: '#post-container',

    initialize: function(params){
        //If models is not setted in params, we must create a model instance
        if(params != undefined){
            if(params.model == undefined){
                this.model = new Post;
            }
        }
        else{
            this.model = new Post;
        }
    },

    events: {
        'click #savePostBtn': 'savePost'
    },

    make_view: function(template_string){
        this.el = this.make('div', {'id': 'post-container', 'class': 'span4 offset3'});
        this.$el = $(this.el);
        $(this.el).append(template_string);
        $('#article-container').append(this.el);
        this.delegateEvents(this.events);
    },

    renderForm: function(oldView){
        var current_view = this;
        var success = function(model, response){
            if(response.template_string != undefined){
                oldView.remove();
                current_view.make_view(response.template_string);
                //current_view.model = new Post;
            }
        };
         this.model.fetch({success: success});

    },

    render: function(params) {
        if (params == undefined) params = {};
        if(params.errors != undefined ){
            //If param.errors is definided, a validation error has happen and has to be rendered
            notempo.utils.show_errors(this.$el, params);
            }
        return this;
    },

    savePost: function(e){
        e.preventDefault();
        this.model = new Post;
        //this.model.unset('template_string');
        this.model.set({'title': this.$("#id_title").val(),
                        'slug': this.$("#id_slug").val(),
                        'content': this.$("#id_content").val()});
        Backbone.Validation.bind(this);
        if (!this.model.isValid(true)){
            var error_params = {'errors': this.model.validate()};
            this.render(error_params);
        }else{
            this.$('div.alert-error').remove();

           /* var current_view = this;
            var success = function(model, response){
                if(response.errors != undefined){
                    var params = {'errors': response.errors};
                    current_view.render(params);
                }else{
                    if(response.ok != undefined){
                            window.location.replace(response.ok.url);
                        }
                }
             };

             this.model.save({},{success: success});*/
        }
    }
});
