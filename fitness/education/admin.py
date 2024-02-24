from django.contrib import admin
from .models import User,SingleContent, Course, Participation,Comment
# Register your models here.
admin.site.register(User)
admin.site.register(SingleContent)
admin.site.register(Course)
admin.site.register(Participation)
admin.site.register(Comment)


