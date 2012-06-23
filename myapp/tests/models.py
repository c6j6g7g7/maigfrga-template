"""models.py unit test for models"""
from .common import BaseTestCase, ModelTestFactory, raises
from myapp.models import PostModel
from myapp.models.main import ModelError
from django.db import IntegrityError


class PostModelTestCase(BaseTestCase):

    @raises(ModelError, "status not valid")
    def test_create_post_fail_invalid_status(self):
        post = PostModel(status=8854)
        post.save()

    @raises(IntegrityError, "column slug is not unique")
    def test_create_post_fail_slug_already_exits(self):
        ModelTestFactory.getPost(slug='i-like-python')
        post2 = PostModel(title=ModelTestFactory.create_unique_string(),
                          slug='i-like-python',
                          content=ModelTestFactory.create_unique_string(),
                          status=PostModel.STATUS.DRAFT)
        post2.save()

    def test_get_post_list(self):
        for i in xrange(3):
            ModelTestFactory.getPost(slug='slug{0}'.format(i))
        for i in xrange(3, 6):
            ModelTestFactory.getPost(slug='slug{0}'.format(i), status=PostModel.STATUS.PUBLISHED)
        for i in xrange(6, 9):
            ModelTestFactory.getPost(slug='slug{0}'.format(i), status=PostModel.STATUS.DELETED)
        self.assertEquals(9, len(PostModel.get_list()))
        self.assertEquals(3, len(PostModel.get_list(status=PostModel.STATUS.DRAFT)))
        self.assertEquals(9, len(PostModel.objects.all()))
