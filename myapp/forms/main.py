from django import forms
from myapp.models.main import PostModel


class PostForm(forms.Form):
    title = forms.CharField(required=True)
    slug = forms.CharField(required=True)
    content = forms.CharField(required=True)

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
