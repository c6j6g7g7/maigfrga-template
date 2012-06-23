"""common.py common class and methods for unit testing"""
import unittest


class BaseTestCase(unittest.TestCase):

    def Setup(self):
        super(BaseTestCase, self).setUp()

    def tearDown(self):
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
