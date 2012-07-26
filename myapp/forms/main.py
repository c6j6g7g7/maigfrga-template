from django import forms
from django.forms.widgets import Textarea, HiddenInput

from myapp.models.main import PostModel


class PostForm(forms.Form):
    id = forms.IntegerField(required=False, widget=HiddenInput)
    title = forms.CharField(required=True)
    slug = forms.CharField(required=True)
    content = forms.CharField(required=True, widget=Textarea)

    def clean_title(self):
        title = self.cleaned_data['title']
        return title

    def save(self, obj_post=None):
        if not obj_post:
            obj_post = PostModel()
        obj_post.title = self.cleaned_data.get('title')
        obj_post.slug = self.cleaned_data.get('slug')
        obj_post.content = self.cleaned_data.get('content')
        obj_post.save()
        return obj_post
