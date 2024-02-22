from django.contrib.auth import login,logout,authenticate
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.shortcuts import render,reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
import json
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt

from .forms import RegisterForm,LoginForm, CreateTeacherForm, SingleContentForm, CourseForm
from .models import User,SingleContent, Course
# Create your views here.

def index(request):
    return render(request,"education/index.html",{

    })

def register(request):
    if request.method=="POST":
        form=RegisterForm(request.POST)
        if form.is_valid():
            # everything is alright
            username=form.cleaned_data["username"]
            email=form.cleaned_data["email"]
            password=form.cleaned_data["password"]
            confirmation=form.cleaned_data["confirmation"]
            if password != confirmation:
                return render(request,"education/register.html",{
                                        "form": RegisterForm(),
                                        "message":"Passwords must match",
                                    })
            try:
                new_user = User.objects.create_user(username, email, password)
                new_user.save()
            except IntegrityError:
                return render(request,"education/register.html",{
                                        "form": RegisterForm(),
                                        "message":"Username is already taken",
                                    })
            login(request, new_user)
            return HttpResponseRedirect(reverse("index"))


        else:
            return render(request, "education/register.html", {
                "form": RegisterForm(),
            })
    return render(request,"education/register.html",{
        "form": RegisterForm(),
    })


def login_view(request):
    if request.method=="POST":
        form=LoginForm(request.POST)
        if form.is_valid():
            username=form.cleaned_data["username"]
            password=form.cleaned_data["password"]
            user=authenticate(request,username=username,password=password)
            if user is not None:
                login(request, user)
                return HttpResponseRedirect(reverse("index"))
            else:
                return render(request,"education/login.html",{
                    "form": LoginForm(request.POST),
                    "message":"Invalid credentials"
                })
    return render(request,"education/login.html",{
        "form": LoginForm(),
    })


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def user(request,username):
    try:
        user=User.objects.get(username=username)
    except ObjectDoesNotExist:
        return render(request,"education/404.html")
    return render(request,"education/user.html", {
        "user":user,
    })

@login_required(login_url="login")
def create_teacher(request):
    if request.method=="POST":
        form=CreateTeacherForm(request.POST)
        if form.is_valid():
            request.user.headline = form.cleaned_data["headline"]
            request.user.about = form.cleaned_data["about"]
            request.user.twitter = form.cleaned_data["twitter"]
            request.user.linkedin =form.cleaned_data["linkedin"]
            request.user.instagram = form.cleaned_data["instagram"]
            request.user.teacher=True
            request.user.save()
            return HttpResponseRedirect(reverse("index"))

    return render(request,"education/create_teacher.html",{
        "form": CreateTeacherForm(),
    })


def create_single(request):
    if request.method=="POST":
        form=SingleContentForm(request.POST)
        if form.is_valid():
            form.save(user=request.user)
            return HttpResponseRedirect(reverse("index"))
    return render(request,"education/create_single.html",{
        "form": SingleContentForm(),
    })
def create_course(request):
    if request.method == 'POST':
        form=CourseForm(request.POST)
        if form.is_valid():
            # print(form.cleaned_data)
            selected_content_ids = request.POST.getlist('content')
            selected_content = SingleContent.objects.filter(id__in=selected_content_ids)
            # print(selected_content_ids)
            # print(selected_content)
            course = form.save(commit=False)
            course.creator = request.user
            course.save()
            course.content.set(selected_content)
            return HttpResponseRedirect(reverse("index"))
    all_content = SingleContent.objects.filter(user=request.user)
    return render(request,"education/create_course.html",{
        "form": CourseForm(),
        "all_content":all_content
    })

def test(request):
    return render(request,"education/test.html")
@csrf_exempt
@login_required(login_url="login")
def buy_course(request,course_id):

    try:
        course=Course.objects.all().get(pk=course_id)
    except ObjectDoesNotExist:
        return render(request,"education/404.html")
    if request.method == 'POST':
        data = json.loads(request.body)
        course.participants.add(request.user)
        return JsonResponse({"result": True}, status=200)
    if request.user in course.participants.all():
        # user has this course
        return HttpResponseRedirect(reverse("index"))
    if course.creator == request.user:
        # user is creator
        return HttpResponseRedirect(reverse("index"))

    return render(request,"education/buy_course.html",{"course":course})



# ---------------------------- API REQUESTS ---------------------- #
@csrf_exempt
def buy_course_api(request):
    if request.method=='POST':
        data=json.loads(request.body)
        print(data['answer'])
        return JsonResponse({"result":True})


@csrf_exempt
def get_person(request,user_id):

    try:
        person=User.objects.all().get(pk=user_id)
    except ObjectDoesNotExist:
        return JsonResponse(
            {"error":"Object does not exist"}, status=404
        )
    free_content = serialize('json', person.get_free_content())
    paid_content = serialize('json', person.get_paid_content())
    person_object={
        "headline": person.headline,
        "about":person.about,
        "free_content": free_content,
        "paid_content":paid_content,

    }
    return JsonResponse(
        {"person":person_object},status=200
    )