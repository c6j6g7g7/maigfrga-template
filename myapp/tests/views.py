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

    def test_login(self):
        #first send an empty post and check by faluire
        url = reverse('login')
        response = self.client.post(url)
        self.assertContains(response,'{"errors": {"username": ["This field is required."], "password": ["This field is required."]}}')

        #check by an inexsisten username
        post_params = {'username': 'fake@fake.com', 'password': '123'}
        response = self.client.post(url, post_params)
        self.assertContains(response, 'Please enter a correct username and password')
        user = ModelTestFactory.getUser(password='test')
        post_params = {'username': user.username, 'password': 'test'}

        response = self.client.post(url, post_params)
        self.assertContains(response, 'ok')


    def test_list_post(self):
        user = ModelTestFactory.getUser(password='test')
        post_list = reverse('post')
        for i in xrange(3, 6):
            ModelTestFactory.getPost(slug='slug{0}'.format(i), status=PostModel.STATUS.PUBLISHED)
        #this view is login protected, for that reason we have simulate login first
        self.client.login(username=user.username, password='test')
        response = self.client.get(post_list)
        self.assertContains(response,'slug3')
        self.assertContains(response,'slug5')
        self.assertNotContains(response,'slug does not exists')


    def test_list_post_ajax(self):
        user = ModelTestFactory.getUser(password='test')
        post_list = reverse('post')
        for i in xrange(0, 60):
            ModelTestFactory.getPost(slug='slug{0}'.format(i), status=PostModel.STATUS.PUBLISHED)
        #this view is login protected, for that reason we have simulate login first
        self.client.login(username=user.username, password='test')
        response = self.client.get(post_list, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertContains(response,'slug50')
        self.assertContains(response,'slug55')
        self.assertNotContains(response,'slug does not exists')

    def test_edit_post(self):
        user = ModelTestFactory.getUser(password='test')
        post = ModelTestFactory.getPost(status=PostModel.STATUS.PUBLISHED)
        post_edit = reverse('update_post', kwargs={'id': post.id})
        self.client.login(username=user.username, password='test')
        response = self.client.get(post_edit)
        self.assertContains(response, post.title)
        self.assertContains(response, post.slug)
        self.assertContains(response, post.content)

    def test_add_post(self):
        user = ModelTestFactory.getUser(password='test')
        post_edit = reverse('add_post')
        self.client.login(username=user.username, password='test')
        response = self.client.get(post_edit)
        self.assertContains(response, 'id_content')

    def test_add_post_json(self):
        user = ModelTestFactory.getUser(password='test')
        post_edit = reverse('add_post')
        self.client.login(username=user.username, password='test')
        response = self.client.get(post_edit, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertContains(response, 'id_content')

    def test_create_post(self):
        user = ModelTestFactory.getUser(password='test')
        post_edit = reverse('post')
        self.client.login(username=user.username, password='test')
        self.assertEquals(0, PostModel.objects.all().count())
        response = self.client.post(post_edit,{})
        self.assertContains(response,'This field is required')
        content = ModelTestFactory.create_unique_string()
        response = self.client.post(post_edit,{'title': ModelTestFactory.create_unique_string(),
                                               'slug': ModelTestFactory.create_unique_string(),
                                               'content': content})

        self.assertContains(response,content)
        self.assertEquals(1, PostModel.objects.all().count())

    def test_create_post_fail_slug_exists(self):
        user = ModelTestFactory.getUser(password='test')
        post = ModelTestFactory.getPost(status=PostModel.STATUS.PUBLISHED)
        post_edit = reverse('post')
        self.client.login(username=user.username, password='test')
        response = self.client.post(post_edit,{'title': ModelTestFactory.create_unique_string(),
                                               'slug': post.slug,
                                               'content': ModelTestFactory.create_unique_string()})

        self.assertContains(response, 'slug exits')
        self.assertEquals(1, PostModel.objects.all().count())


    def test_update_post(self):
        user = ModelTestFactory.getUser(password='test')
        post = ModelTestFactory.getPost(status=PostModel.STATUS.PUBLISHED)
        post_edit = reverse('update_post', kwargs={'id': post.id})
        self.client.login(username=user.username, password='test')
        new_content = ModelTestFactory.create_unique_string()
        self.assertNotEquals(post.content,new_content)
        response = self.client.put(post_edit,{ 'title': post.title,
                                               'slug': post.slug,
                                               'content': new_content})
        self.assertContains(response, new_content)
        post_updated = PostModel.objects.get(id=post.id)
        self.assertNotEquals(post.content, post_updated.content)
