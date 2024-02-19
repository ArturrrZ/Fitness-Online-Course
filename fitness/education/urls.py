
from django.urls import path
from . import views
urlpatterns = [
    path('test',views.test,name="test"),
    path("",views.index,name="index"),
    path("register",views.register,name="register"),
    path("login",views.login_view,name="login"),
    path("logout",views.logout_view,name="logout"),
    path("user/<str:username>",views.user,name="user"),
    path("teacher/create_teacher",views.create_teacher,name='create_teacher'),
    path("teacher/create_single",views.create_single,name="create_single")

]
