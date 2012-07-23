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
    var _append_summary_errors= function(form,options){
	    var summary=$(form).find(".nt-summary-error"),p_messages=$('<p></p>');
	    if (summary!=null){
	        var sp_error=summary.find('.box-summary-error');
	        sp_error.empty();
	        sp_error.append('<span class="ui-icon ui-icon-alert left"></span>');
	        for(var msg in options.errors){
		        for (var op in options.errors[msg]){
		            p_messages.append(options.errors[msg][op]);
		        }
            }
	        sp_error.append(p_messages);
	        summary.show();
	    }
    };
    var _ajax_parameters = function (type, data) {
        if (data.error_func == null) data.error_func = function () {};
        if (data.cache == null) data.cache = false;
        if (data.async == null) data.async = true;
        if (data.dataType == null) data.dataType = "json";
        var parameters = {
            type: type,
            dataType: data.dataType,
            url: data.url,
            async: data.async,
            cache: data.cache,
            data: data.parameters
        };
        if (data.timeout != null) parameters.timeout = data.timeout;
        if (data.beforeSend != null) parameters.beforeSend = data.beforeSend;
        parameters.error = function (xhtmlrequest, status, error) {
            var context = data.context ? data.context : this;
            data.error_func.call(context, xhtmlrequest.responseText ? xhtmlrequest.responseText : null, status, error);
        };

        parameters.success = function (response, status) {
            var context = data.context ? data.context : this;
            data.success_func.call(context, response, status);
        };
        return parameters;
     };

    var _form_to_ajax_parameters = function(form) {
        var data = {};
        $("input", form).each(function() {
            var input = $(this);
            if (!input.hasClass("ignore")) {
                data[input.attr('name')] = input.val();
            }
        });
	    $("textarea", form).each(function() {
            var textarea = $(this);
            if (!textarea.hasClass("ignore")) {
                data[textarea.attr('name')] = textarea.val();
            }
        });
        $("select", form).each(function() {
            var select = $(this);
            if (!select.hasClass("ignore")) {
                data[select.attr('name')] = select.val();
            }
        });
        return data;
    };

    var _get_file_ext=function(fileName){
        var ext = fileName.substr(fileName.lastIndexOf('.') ),
        arr_str=[];
        if(ext != undefined){
            arr_str[0]=fileName.substr(0,fileName.lastIndexOf('.'));
            arr_str[1]=ext;
        }
        else{
            arr_str[0]=path;
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
        get_file_version:function(name,version){
            return _get_file_version(name,version);
        },
	    detect_browser:function(agent){
	        var useragent = navigator.userAgent.toLowerCase();
	        return (useragent.indexOf(agent.toLowerCase()) != -1)
	    },
        do_get: function (data) {
            var parameters = _ajax_parameters("GET", data);
            jQuery.ajax(parameters);
        },

        do_post: function (data) {
            var parameters = _ajax_parameters("POST", data);
            jQuery.ajax(parameters);
        },

        ajax_submit_form : function(form, success_func, before_func,error_func, timeout) {
            var method = form.attr("method").toLowerCase();
            var data = {};
            data.url          = form.attr("action");
            data.parameters   = _form_to_ajax_parameters(form);
            data.success_func = success_func;
            data.error_func   = error_func;
    	    data.beforeSend=before_func
            if (timeout != null) data.timeout = timeout;
            switch (method) {
                case 'get':
                    notempo.utils.do_get(data);
                    break;
                case 'post':
                    notempo.utils.do_post(data);
                    break;
                default:
		    notempo.utils.do_get(data);
                    break;
            }
        },
	    append_labels:function(form){
	        _append_label_messages(form);
    	},
	    show_summary_errors: function(form,options){
	        _append_summary_errors(form,options);
    	},
	    show_errors:function(form,options){
	        _show_errors(form,options);
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


  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  //
  /*
                        var success = function(response){
                            console.log('not error');
                            console.log(response);
                         };
                        var error = function(response){
                            console.log('error');
                                console.log(response);
                            };
                         console.log(this.model.toJSON());
                         var data={};
                         data.parameters = this.model.toJSON();
                         data.error_func = error;
                         data.success_func = success;
                         data.url = this.model.url;
                         notempo.utils.do_post(data);
                        //this.model.save({error: error, success: success});*/

  //
  //
  //
  Backbone.sync = function(method, model, options) {
console.log(options);
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read':   'GET'
  };


     /* console.log(method);
      console.log(model);
      console.log(options);*/
    var type = methodMap[method];
    // Default options, unless specified.
    options || (options = {});

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
   console.log(params);

 /*   if (options.error == null) options.error = function () {};
    params.error = function (xhtmlrequest, status, error) {
            var context = options.context ? options.context : this;
            options.error.call(context, xhtmlrequest.responseText ? xhtmlrequest.responseText : null, status, error);
        };

        params.success = function (response, status) {
            var context = options.context ? options.context : this;
            options.success.call(context, response, status);
        };*/



    // Ensure that we have the appropriate request data.
    /*
    if (!options.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }*/

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    /*if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }*/

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    /*if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
        };
      }
    }*/

    // Don't process data on a non-GET request.
    /*if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }*/

    // Make the request, allowing the user to override any Ajax options.
    return $.ajax(_.extend(params, options));
    //return $.ajax(params);

  };
