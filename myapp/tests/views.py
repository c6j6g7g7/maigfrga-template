"""views.py unit test for views"""
from .common import BaseTestCase,ModelTestFactory
from myapp.models import PostModel
from django.core.urlresolvers import reverse

class ViewTestCase(BaseTestCase):
    def test_index(self):
        url = reverse('index')
        response = self.client.get(url)
        self.assertEquals(200, response.status_code)
        self.assertContains(response, 'import life')

