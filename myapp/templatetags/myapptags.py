from django import template
from django.conf import settings

register = template.Library()

@register.inclusion_tag('common/numerated_pagination.html', takes_context=True)
def numerated_pagination(context):
    return {'paginator': context.get('paginator'),
            'current_page': context.get('current_page', 1)}
