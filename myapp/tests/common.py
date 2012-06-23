"""common.py common class and methods for unit testing"""
from myapp.models.main import PostModel
from django.conf import settings
from django.test.client import Client
import os
import random
import string
from django.test import TestCase


class BaseTestCase(TestCase):

    def setUp(self):
        self.client = Client()
        self.urls = 'myapp.tests.urls'
        self.old_TEMPLATE_DIRS = settings.TEMPLATE_DIRS
        self.old_ROOT_URLCONF = settings.ROOT_URLCONF
        settings.ROOT_URLCONF = self.urls
        settings.TEMPLATE_DIRS = (os.path.join(os.path.dirname(__file__), 'templates'),)
        super(BaseTestCase, self).setUp()

    def tearDown(self):
        settings.TEMPLATE_DIRS = self.old_TEMPLATE_DIRS
        settings.ROOT_URLCONF = self.old_ROOT_URLCONF
        super(BaseTestCase, self).tearDown()


class raises(object):
    """
    Decorator class that chekcks if a particular exception has raised in unit testing
    see: http://stackoverflow.com/questions/2692402/unittest-in-django-how-to-get-the-exception-message-from-assertraises
    http://www.artima.com/weblogs/viewpost.jsp?thread=240808
    """
    def __init__(self, exception, message):
        self.exception = exception
        self.message = message

    def __call__(self, f):
        def wrapped_f(*args):
            try:
                f(*args)
            except self.exception, e:
                if self.message is not None:
                    args[0].assertEquals(str(e), self.message)
            except:
                raise
            else:
                msg = "{0}() did not raise {1}".format(f.__name__, self.exception.__name__)
                raise AssertionError(msg)
        return wrapped_f


class ModelTestFactory(object):
    @staticmethod
    def create_unique_string(prefix='', n_range=6):
        st = ''.join(random.choice(string.ascii_lowercase + string.digits) for x in range(n_range))
        if prefix:
            return '{0}-{1}'.format(prefix, st)
        else:
            return '{0}'.format(st)

    @staticmethod
    def create_unique_email():
        return '{0}@{1}.com'.format(ModelTestFactory.create_unique_string(), ModelTestFactory.create_unique_string())

    @staticmethod
    def getPost(**kwargs):
        if 'status' not in kwargs:
            kwargs['status'] = PostModel.STATUS.DRAFT

        if 'title' not in kwargs:
            kwargs['title'] = ModelTestFactory.create_unique_string()

        if 'slug' not in kwargs:
            kwargs['slug'] = ModelTestFactory.create_unique_string()

        if 'content' not in kwargs:
            kwargs['content'] = ModelTestFactory.create_unique_string()

        obj = PostModel(**kwargs)
        obj.save()
        return obj
