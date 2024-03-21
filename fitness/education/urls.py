
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
    path("teacher/create_single",views.create_single,name="create_single"),
    path("teacher/create_course",views.create_course,name="create_course"),
    path("teacher/course/edit/<int:course_id>", views.edit_course, name="edit_course"),
    path("course/buy/<int:course_id>",views.buy_course,name="buy_course"),
    path("course/<int:course_id>",views.course,name="course"),
    path("single_content/<int:content_id>",views.single_content,name="single_content"),
    path("my_learning",views.my_learning,name="my_learning"),
    path("my_cart",views.my_cart,name="my_cart"),
    path("buy_my_cart",views.buy_my_cart,name="buy_my_cart"),
    path("search",views.search,name="search"),
    path("certificate/<int:course_id>",views.certificate,name="certificate"),
    # api
    path("course/buy", views.buy_course_api, name="buy_course_api"),
    path("api/search/<str:name>",views.search_api),
    path("api/get_index",views.get_index),
    path("api/get_person/<int:user_id>",views.get_person),
    path("api/get_single_content/<int:content_id>",views.get_single_content),
    path("api/single_content_comment/<int:content_id>",views.single_content_comment),
    path("api/get_course/<int:course_id>",views.get_course),
    path("api/get_my_learning",views.my_learning_api),
    path("api/get_my_cart_api",views.my_cart_api),
    path("api/course_rating/<int:rating_id>",views.rating_edit)
]
