"""main.py Base models for your application"""
from django.db import models
from django.utils.timezone import utc

import datetime


class ModelError(Exception):
    pass


class BaseManager(models.Manager):
    """common bussiness logic can be implemented here"""
    pass


class BaseModel(models.Model):
    """
    Base model class, contains a simple create datetime , every model extended from this base model
    will have this field with the creation current time by default.
    Another fields as update_datetime, user_id can be added
    """
    create_datetime = models.DateTimeField(default=datetime.datetime.utcnow().replace(tzinfo=utc))
    objects = BaseManager()

    @classmethod
    def enum(cls, **enums):
        """
        Return an enume as attribute of the class
        """
        return type('Enum', (), enums)

    class Meta:
        """
        Django Meta class: https://docs.djangoproject.com/en/dev/topics/db/models/#meta-inheritance
        Because this class is abstract no database table will be generated, all the chindren of this class
        will have the fields defined in this class as database columns
        """
        abstract = True
        app_label = 'myapp'


class PostModel(BaseModel):
    """
    Post model to store some site content
    """
    STATUS = BaseModel.enum(DRAFT=1, PUBLISHED=2, DELETED=3)
    #maybe a title with more than 80 caracters will not be easy to share in twitter
    title = models.CharField(max_length=80, blank=False, null=False, default=None)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    status = models.IntegerField()

    @classmethod
    def get_list(cls,**kwargs):
        return PostModel.objects.filter(**kwargs)

    @classmethod
    def slug_exists(cls, slug=''):
        try:
            return bool(PostModel.objects.get(slug=slug))
        except PostModel.DoesNotExist:
            return False

    def _check_status(self):
        if self.status in (self.STATUS.DRAFT, self.STATUS.PUBLISHED, self.STATUS.DELETED):
            return True
        else:
            raise ModelError("status not valid")

    def save(self, *args, **kwargs):
        if self._check_status():
            super(PostModel, self).save(*args, **kwargs)

    class Meta:
        app_label = 'myapp'
