
category={
    "fitness":"Fitness",
    "nutrition":"Nutrition",
    "professional":"Professional Sports",

}
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class User(AbstractUser):
    twitter = models.CharField(max_length=300, blank=True, null=True)
    linkedin = models.CharField(max_length=300, blank=True, null=True)
    instagram = models.CharField(max_length=300, blank=True, null=True)
    teacher = models.BooleanField(default=False)
    headline = models.CharField(max_length=50, blank=True, null=True)
    about = models.TextField(blank=True, null=True)

    # Add related_name to avoid clashes
    groups = models.ManyToManyField(Group, related_name='user_groups')
    user_permissions = models.ManyToManyField(Permission, related_name='user_permissions')

    def __str__(self):
        return f"{self.username} is teacher: {self.teacher}"

class SingleContent(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE, related_name="single_content")
    title=models.CharField(max_length=50)
    description=models.TextField()
    url_youtube=models.URLField(blank=True,null=True)
    url_image=models.URLField(blank=True,null=True)
    category=models.CharField(max_length=50,choices=category)
    is_free=models.BooleanField()

    def __str__(self):

        return f"{self.user.username} - {self.id}"