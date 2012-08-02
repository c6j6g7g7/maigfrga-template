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

        if(this.$el){
            this.paginator = this.$el.find('div.pagination');
        }
    },

    events: {
        'click #post-listd div.pagination ul li a': 'list',
        'click a[id^="delete"]': 'destroy_post'
    },

    destroy_post: function(e){
        e.preventDefault();
        var id = this.$(e.currentTarget).attr('id').split('-')[1];
        var model = this.models.get(id);
        var current_view = this;
        var success = function(response){
            current_view.models.remove(model);
            current_view.render();
        };
        model.destroy({success:success});
    },
    list : function(page){
       var current_view = this;
       if(page == undefined) page = 1;
       this.models.fetch({data: {page: page}, success: function(){current_view.render();}});
    },

    get_post_list_template: function(){
        var str_template = ['<tr>',
                            '<td><%= title %></td>',
                            '<td><%= slug %></td>',
                            '<td><%= content %></td>',
                            '<td><%= status %></td>',
                            '<td>',
                            '<a class="btn btn-success" href="#<%= id %>">',
                            '<i class="icon-white icon-edit"></i>edit</a>',
                            '<a id="delete-<%= id %>" class="btn btn-danger">',
                            '<i class="icon-white icon-trash"></i> delete </a>',
                            '</td>',
                            '</tr>']
        var template = _.template(str_template.join(''));
        var post_list = '';
        var build_records = function(obj){
             if(!_.isEmpty(obj.attributes))
             post_list += template(obj.attributes);
            }
        _.each(this.models.models, build_records);
        return post_list;
    },

    render: function(params){
        if(notempo.utils.element_exists('#post-list')){


           this.$el.find('tbody').empty().html(this.get_post_list_template());
        }else{
            this.make_list();
        }
    },

    render_table: function(){
        this.$el.append(this.paginator);
    },

    make_list: function(){
        if(!notempo.utils.element_exists('#post-list')){
            var current_view = this;
            var success = function(){
                current_view.$el.find('tbody').empty().html(current_view.get_post_list_template());
                $('#article-container').append(current_view.$el);
            };
            this.models.fetch({data: {page: 1}, success: success});
        }
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
        'click #savePostBtn': 'savePost',
        'click #edit-post-btn': 'editPost'
    },

    editPost: function(){
        var current_view = this;
        var success = function(model, response){
            if(response.template_string != undefined){
                current_view.remove();
                current_view.make_view(response.template_string);
            }
        };
         var url = '/post/' + this.model.get('id') + '/';
         this.model.fetch({success: success, url: url});
    },

    make_view: function(template_string){
        this.el = this.make('div', {'id': 'post-container', 'class': 'span4 offset3'});
        this.$el = $(this.el);
        $(this.el).empty().append(template_string);
        $('#article-container').append(this.el);
        this.delegateEvents(this.events);
    },

    renderForm: function(oldView){
        var current_view = this;
        var success = function(model, response){
            if(response.template_string != undefined){
                oldView.remove();
                current_view.make_view(response.template_string);
            }
        };
         this.model.fetch({success: success});

    },

    render: function(params) {
        if(params == undefined) params = {};
        if(this.$el == undefined){
            if(params.el != null)this.$el = params.el;
            else return this;
        }
        if (params == undefined) params = {};
        if(params.errors != undefined ){
            //If param.errors is definided, a validation error has happen and has to be rendered
            notempo.utils.show_errors($('#post-form'), params);
            }
        return this;
    },

    render_model: function(){
        var str_template = ['<div id="post-detail" class="row">',
                            '<h2><%= title %></h2>',
                            '<p><%= slug %></p>',
                            '<p><%= content %></p>',
                            '</div>']
        var template = _.template(str_template.join(''));
        var str_template_controls = ['<div id="post-detail" class="row">',
                                 '<p><a id="edit-post-btn" href="#<%= action %>" class="btn btn-success btn-large span2">edit</a>',
                                 '<a class="btn btn-success btn-large span2" href="#">go to list</a></p>',
                                 '</div>'
                                ];
        var action = this.model.get('id') ? this.model.get('id') : '';
        var template_controls = _.template(str_template_controls.join(''));
        if(notempo.utils.element_exists('#post-form')){
            this.$('#post-form').remove();
            this.$el.append(template(this.model.attributes));
            this.$el.append(template_controls({'action': action}))
        }
        this.delegateEvents(this.events);
    },

    savePost: function(e){
        e.preventDefault();
        var form = this.$('#post-form'), params={};
        params = notempo.utils.form_to_ajax_parameters(form);
        this.model = new Post
        this.model.set(params);
        Backbone.Validation.bind(this);

        if(!this.model.isValid(true)){
            var validation_params = {model: this.model, error: this.render};
            notempo.utils.render_validation_errors(this.$el, validation_params);

        }else{
            this.$('div.alert-error').remove();
            this.$el.find('.error').removeClass('error');

            var current_view = this;

            var success = function(model, response){
                if(response.errors != undefined){
                    var params = {'errors': response.errors};
                    current_view.render(params);
                }else{
                    if(response.ok != undefined){
                        notempo.utils.show_msg(current_view.$el, response.ok.msg);
                        current_view.model.clear();
                        current_view.model.set(response.ok.obj);
                        current_view.render_model();
                    }
                }
             };

            this.model.save({},{success: success});
        }
        /*if (!this.model.isValid(true)){
            var error_params = {'errors': this.model.validate()};
            this.render(error_params);
        }else{
            
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
        }*/
    }
});
