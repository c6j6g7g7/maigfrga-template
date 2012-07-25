var UserLogin = Backbone.Model.extend({
    url: '/login/',
    initialize: function(options){
        //check if validation rules has been seeted in constuction time
        if(options == undefined) options = {};
        if(options.validation != undefined){
                if(options.validation.username != undefined){
                        this.validation.username = options.validation.username;
                    }
                if(options.validation.password != undefined){
                        this.validation.password = options.validation.password;
                    }
            }
    },

    validation: {

        username: {
            required: true,
            msg: 'Please enter your username'
        },
        password: {
            required: true,
            msg: 'Please enter your password'
        }
    }
});

var Post = Backbone.Model.extend({
    url: '/post/',
    validation : {
        title: {
            required: true,
            msg: 'Please enter the title'
            },
        slug: {
            required: true,
            msg: 'Slug is required'
            },
        content: {
            required: true,
            msg: 'Content is required'
            }
        }
});

var PostCollection =  Backbone.Collection.extend({
    model: Post,
    'url': '/post/',
    parse: function(response){
        return response.object_list;
    }
});
