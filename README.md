django-myapp-template
=====================

Django custom structure for a django app

Minimun Django version supported **1.4**.

Requirements
------------

* Django >= 1.4

Usage
-----

1. Clone this project.
2. Change the name of myapp directory to the name of your app.
3. Edit your settings.py and add a reference in your INSTALLED_APPS `<https://docs.djangoproject.com/en/dev/ref/settings/#installed-apps>_` .
4. Edit models/main.py and set the app_label on class meta in BaseModel, ajust to the name of your app. Every model created must implement the Meta
   class and set the app_label option.
Content
-------
* **myapp/models/main.py** The base models for your app, you can add new models, even new models files, all you have to do is import all of them in the myapp/__init.__py.
* **myapp/models/__init.py** The models imported
* **myapp/test/models.py** Unit test for models

Resources
---------
* `Testing Django applications <https://docs.djangoproject.com/en/dev/topics/testing/>_`
* `Test-Driven Django Tutorial <http://www.tdd-django-tutorial.com/tutorial/1/>_`
* `Meta inheritance <https://docs.djangoproject.com/en/dev/topics/db/models/#meta-inheritance>_`
