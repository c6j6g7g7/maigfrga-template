from django.db import models
from django.db.models.query import QuerySet
from django.utils import simplejson
import collections

def json_serialize(obj):
    """
    Serialize models to simple dictionaries
    """
    #if object is a query set, iterate collection and transform every model in a dictionary
    if isinstance(obj, QuerySet):
        obj_list = []
        for o in obj:
            if isinstance(o, models.Model):
                obj_list.append(_model_to_dict(o))
        return simplejson.dumps(obj_list)

    elif isinstance(obj, models.Model):
        return _serialize_model(o)

    #if obj is a dictinary check if exists a QuerySet key
    elif isinstance(obj, dict):
        obj_copy = {}
        for key, value in obj.items():
            if isinstance(value, QuerySet):
                obj_list = []
                for v in value:
                    if isinstance(v, models.Model):
                        obj_list.append(_model_to_dict(v))

                obj_copy[key] = obj_list
            else:
                obj_copy[key] = value
        return simplejson.dumps(obj_copy)
    else:
        try:
            return simplejson.dumps(obj)
        except Exception as error:
            return simplejson.dumps({})

def _model_to_dict(model):
    """
    take the model fields an create a dictionary with this values
    """
    data = {}
    try:
        opts = model._meta
        for f in opts.fields:
            data[f.name] = str(f.value_from_object(model))
    except:
        pass
    return data

def _serialize_model(model):
    return simplejson.dumps(_model_to_dict(model))
