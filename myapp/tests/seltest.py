from .common import ModelTestFactory
from django.core.urlresolvers import reverse
from django.test import LiveServerTestCase
from selenium.webdriver.firefox.webdriver import WebDriver

class HomeTestCase(LiveServerTestCase):
    def setUp(self):
        self.browser = WebDriver()
        self.browser.implicitly_wait(3)

    def test_home(self):
        self.browser.get('{0}{1}'.format(self.live_server_url,reverse('index')))
        body = self.browser.find_element_by_tag_name('body')
        self.assertIn('username', body.text)
        user = ModelTestFactory.getUser(password='test')
        username_input = self.browser.find_element_by_name("username")
        username_input.send_keys(user.username)
        password_input = self.browser.find_element_by_name("password")
        password_input.send_keys('test')
        self.browser.find_element_by_id('loginBtn').click()
