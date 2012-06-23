"""models.py"""
from .common import BaseTestCase,raises
from myapp.models import PostModel
from myapp.models.main import ModelError

class PostModelTestCase(BaseTestCase):

    @raises(ModelError, "status not valid")
    def test_create_post_fail_invalid_status(self):
        post = PostModel(status=8854)
        post.save()
