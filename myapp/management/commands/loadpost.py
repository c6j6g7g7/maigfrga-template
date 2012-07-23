from django.core.management.base import BaseCommand, CommandError
from myapp.tests.common import ModelTestFactory

import logging
logger = logging.getLogger(__name__)
class Command(BaseCommand):
    help = "command that creates post"
    def handle(self, *args, **options):
        for x in range(100):
            ModelTestFactory.getPost()
