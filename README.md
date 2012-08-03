django-myapp-template
=====================

Django custom structure for a django app

Django version supported **1.4**.

Requirements
------------

* Django 1.4

Usage
-----

1. Clone this project.
2. Edit your settings.py and add a reference in your INSTALLED_APPS https://docs.djangoproject.com/en/dev/ref/settings/#installed-apps .

Content
-------
* **resources.txt** Virtualenv resources
* **myapp/models/main.py** The base models for your app, you can add new models, even new models files, all you have to do is import all of them in the myapp/__init.__py.
* **myapp/models/__init.py** The models imported
* **myapp/forms/main.py**  example form
* **myapp/test/models.py** Unit test for models
* **myapp/test/views.py** Unit test for views
* **myapp/test/common** Base Test Case and model Factory
* **static/js/**  Backbone model views controllers and javascritp utils
* **static/css/** Twitter bootsrtap files

Resources
---------
* Testing Django applications https://docs.djangoproject.com/en/dev/topics/testing/
* Test-Driven Django Tutorial http://www.tdd-django-tutorial.com/tutorial/1/
* Meta inheritance https://docs.djangoproject.com/en/dev/topics/db/models/#meta-inheritance
* A successful Git branching model http://nvie.com/posts/a-successful-git-branching-model/
* Backbone.js http://backbonejs.org/
* Backbone Valitadion https://github.com/thedersen/backbone.validation
* Backbone Tutorials http://backbonetutorials.com/
* Twitter bootstrap http://twitter.github.com/bootstrap/index.html
* Selenium server http://seleniumhq.org
* Python selenium http://pypi.python.org/pypi/selenium

Notes
-----
Seems that put request do not work on development version 1.5
