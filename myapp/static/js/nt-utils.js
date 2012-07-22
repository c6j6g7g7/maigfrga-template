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
