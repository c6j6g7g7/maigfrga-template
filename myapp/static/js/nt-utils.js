var csrfToken = $('input[name=csrfmiddlewaretoken]').val();
$(document).ajaxSend(function(e, xhr, settings) {
    xhr.setRequestHeader('X-CSRFToken', csrfToken);
});

var notempo= notempo||{};
notempo.namespace=function(ns_string){
    var parts=ns_string.split('.'),
        parent=notempo,i;
    if(parts[0]==='notempo'){
        parts=parts.slide(1);
    }
    for(i=0;i<parts.length;i++){
        if(typeof parent[parts[i]]==='undefined'){
            parent[parts[i]]={};
        }
        parent=parent[parts[i]];
    }
    return parent;
};
notempo.namespace('utils');
notempo.utils = (function(){
    var _show_errors = function(el, options){
            var template = _.template('<div class="alert  alert-error"> <strong>oops!</strong>  <%= error %></div>');
            var control_group = null;
            var render_errors = function(value, field){
                if (field == '__all__'){
                    control_group = el.find('ul');
                    control_group.prepend(template({'error': value[0]}));
                    control_group.find('li').addClass('error');
                }else{
                    control_group = el.find('li.'+field);
                    control_group.addClass('error');
                    control_group.find('div.controls').append(template({'error': value}));
                }
            }

             _.each(options.errors, render_errors);
        };

    var _get_file_ext = function(fileName){
        var ext = fileName.substr(fileName.lastIndexOf('.')), arr_str=[];
        if(ext != undefined){
            arr_str[0] = fileName.substr(0,fileName.lastIndexOf('.'));
            arr_str[1] = ext;
        }
        else{
            arr_str[0] = path;
        }
        return arr_str;
    };

    var _get_file_version=function(name,version){
        var arr_name=_get_file_ext(name);
        if(arr_name.length==2){
            return arr_name[0]+version+arr_name[1];
        }else{
            return name;
        }
    };
    return {
        get_file_version:function(name, version){
            return _get_file_version(name, version);
        },
	    detect_browser:function(agent){
	        var useragent = navigator.userAgent.toLowerCase();
	        return (useragent.indexOf(agent.toLowerCase()) != -1)
	    },
        show_errors:function(el, options){
	        _show_errors(el, options);
    	},
    };

})();

notempo.namespace('modernizr');
notempo.modernizr = (function(){
    return {
        canvas: function () {
            var test =Modernizr.canvas;
	        return test;
        },
	    geolocation:function(){
	        var test=Modernizr.geolocation;
	        return test;
	    }
    }
})();


Backbone.sync = function(method, model, options) {
    var methodMap = {
        'create': 'POST',
        'update': 'PUT',
        'delete': 'DELETE',
        'read':   'GET'
     };

    var type = methodMap[method];
    // Default options, unless specified.
    options || ( options = {});

    var urlError = function(){
        throw new Error('url is missing')
     }

    // Default JSON-request options.
    var params = {type: type, dataType: 'json', async: true, cache: false};

    // Ensure that we have a URL.
    if (!options.url) {
       params.url = model.url || urlError();
    }
    params.data = model.toJSON();
    return $.ajax(_.extend(params, options));
  };
