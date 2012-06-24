from django import forms
from myapp.models.main import PostModel

class PostForm(forms.Form):
    title = forms.CharField(required=False)
    slug = forms.CharField(required=False)
    content = forms.CharField(required=False)
    def clean_title(self):
        title = self.cleaned_data['title']
        return title
    def save(self,obj_post=None):
        if not obj_post:
            obj_post = PostModel()
        obj_post.title = self.cleaned_data.get('title')
        obj_post.title = self.cleaned_data.get('slug')
        obj_post.title = self.cleaned_data.get('content')
        obj_post.save()
        return obj_post
