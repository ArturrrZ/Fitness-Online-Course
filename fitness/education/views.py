from django.contrib.auth import login,logout,authenticate
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.shortcuts import render,reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from .forms import RegisterForm,LoginForm, CreateTeacherForm, SingleContentForm
from .models import User
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
            login(request,new_user)
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
                login(request,user)
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
def test(request):
    return render(request,"education/test.html")