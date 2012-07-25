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
            'click #post-list div.pagination ul li a': 'list'
        },
        list : function(e){
           var page = this.$(e.currentTarget).text();
           e.preventDefault();
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
                console.log(obj.attributes);
                 post_list += template(obj.attributes);
                }
            _.each(this.models.models, build_records);
            this.$el.find('tbody').empty().html(post_list);
        }
});
