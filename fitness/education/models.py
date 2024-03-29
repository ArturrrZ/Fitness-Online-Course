
category={
    "fitness":"Fitness",
    "nutrition":"Nutrition",
    "professional":"Professional Sports",

}
language={
    "english":"English",
    "spanish":"Spanish",
    "russian":"Russian",
    "mandarin":"Mandarin",
    "turkish":"Turkish",

}
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.core.validators import MaxValueValidator, MinValueValidator

class User(AbstractUser):
    twitter = models.CharField(max_length=300, blank=True, null=True)
    linkedin = models.CharField(max_length=300, blank=True, null=True)
    instagram = models.CharField(max_length=300, blank=True, null=True)
    teacher = models.BooleanField(default=False)
    headline = models.CharField(max_length=150, blank=True, null=True)
    about = models.TextField(blank=True, null=True)
    picture_url=models.CharField(max_length=50000,blank=True,null=True)
    cart = models.ManyToManyField("Course",blank=True, null=True, related_name="in_users_cart")
    # Add related_name to avoid clashes
    groups = models.ManyToManyField(Group, related_name='user_groups')
    user_permissions = models.ManyToManyField(Permission, related_name='user_permissions')
    

    def get_free_content(self):
        """
        Get the free content associated with the user.
        """
        return self.single_content.filter(is_free=True)

    def get_paid_content(self):
        """
        Get the paid content associated with the user.
        """
        return self.single_content.filter(is_free=False)
    def __str__(self):
        return f"{self.username} is teacher: {self.teacher}"

class SingleContent(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE, related_name="single_content")
    title=models.CharField(max_length=50)
    description=models.TextField()
    url_youtube=models.CharField(max_length=1000,blank=True,null=True)
    url_image=models.URLField(blank=True,null=True)
    category=models.CharField(max_length=50,choices=category)
    is_free=models.BooleanField()
    def __str__(self):
        return f"{self.title} - Is it free? Answer:{self.is_free}"

class Course(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_courses")
    name = models.CharField(max_length=50)
    overview = models.TextField()
    url_image = models.URLField(blank=True, null=True)
    category = models.CharField(max_length=50, choices=category)
    price=models.IntegerField(validators=[MinValueValidator(1),MaxValueValidator(500)])
    content = models.ManyToManyField("SingleContent", blank=True, null=True, related_name="course")
    participants=models.ManyToManyField("User",through="Participation",blank=True,null=True,related_name="joined_course")
    date=models.DateTimeField(auto_now_add=True)
    current_rating=models.FloatField(blank=True,null=True,default=0)
    language=models.CharField(max_length=50,choices=language,default="english")


class Participation(models.Model):
    participant=models.ForeignKey("User",on_delete=models.CASCADE, related_name="joined_courses")
    course = models.ForeignKey("Course", on_delete=models.CASCADE, related_name="participants_details")
    date=models.DateTimeField(auto_now_add=True)
    reason=models.TextField(blank=True,null=True)
    is_completed=models.BooleanField(default=False)
    completed_date=models.DateTimeField(null=True)
class Comment(models.Model):
    user=models.ForeignKey("User", on_delete=models.CASCADE, related_name="comments_left")
    single_content=models.ForeignKey("SingleContent",on_delete=models.CASCADE, related_name="comments")
    body=models.TextField(null=False)
    date=models.DateTimeField(auto_now_add=True)

class Rating(models.Model):
    user=models.ForeignKey("User",on_delete=models.CASCADE, related_name="ratings_left")
    course=models.ForeignKey("Course",on_delete=models.CASCADE,related_name="ratings")
    message=models.CharField(max_length=500,null=True,blank=True)
    date=models.DateTimeField(auto_now_add=True)
    rate=models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)])