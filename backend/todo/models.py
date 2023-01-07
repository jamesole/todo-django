from django.db import models

# Create your models here.


class Todo(models.Model):
    title = models.CharField(max_length=200, default=None, blank=False)
    description = models.TextField(null=True, blank=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title
