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
from .models import User,SingleContent, Course,Comment
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
    print(f"User picture: {user.picture_url}")
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
        return HttpResponseRedirect(reverse("course",args=(course_id,)))
    if course.creator == request.user:
        # user is creator
        return HttpResponseRedirect(reverse("course",args=(course_id,)))

    return render(request,"education/buy_course.html",{"course":course})
@login_required(login_url="login")
def course(request,course_id):
    try:
        course=Course.objects.all().get(pk=course_id)
    except ObjectDoesNotExist:
        return render(request,"education/404.html")
    if request.user in course.participants.all() or request.user == course.creator:
        # SUCCESS
        # print(course.participants.all())
        return render(request,"education/course.html",{
            "course_id":course_id,
        })
    else:
        # user does not have this course
        return HttpResponseRedirect(reverse("buy_course",args=(course_id,)))


def single_content(request,content_id):
    try:
        content=SingleContent.objects.get(pk=content_id)
    except ObjectDoesNotExist:
        return render (request,"education/404.html")
    if content.is_free == False:
        return render (request,"education/404.html")
    return render (request,"education/single_content.html",{"content":content})
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
    if request.method == 'PUT':
        data=json.loads(request.body)
        person.headline=data["new_headline"]
        person.about=data["new_about"]
        person.picture_url=data["new_picture_url"]
        person.save()
        return JsonResponse({"message":"Done!"},status=201)
    free_content = serialize('json', person.get_free_content())
    paid_content = serialize('json', person.get_paid_content())
    person_object={
        "headline": person.headline,
        "about":person.about,
        "free_content": free_content,
        "paid_content":paid_content,
        "picture":person.picture_url

    }
    return JsonResponse(
        {"person":person_object},status=200
    )


@csrf_exempt
def get_single_content(request,content_id):
    try:
        content=SingleContent.objects.all().get(pk=content_id)
        if content.is_free == False:
            return JsonResponse(
                {"error": "Object does not exist"}, status=404
            )
    except ObjectDoesNotExist:
        return JsonResponse(
            {"error": "Object does not exist"}, status=404
        )
    if request.method=='PUT':
            data=json.loads(request.body)
            content.title=data["new_title"]
            content.description=data["new_description"]
            content.url_image=data["new_url_image"]
            new_url_youtube=data["new_url_youtube"]
            if "embed" in new_url_youtube:
                return JsonResponse({"error":"Bad youtube link. Example of correct link: https://www.youtube.com/embed/d7j9p9JpLaE"},status=403)
            else:
                content.url_youtube=data["new_url_youtube"]
            content.save()
            return JsonResponse({"message":"Successfully edited","new_url_youtube":content.url_youtube,},status=200)
    is_teacher=False
    if content.user==request.user:
        is_teacher=True
    # Exclude the "user" field from serialization
    # serialized_content = serialize('json', [content], exclude=('user',))
    # print(content.comments)
    # comments=serialize("json",content.comments.all())
    comments = list(content.comments.all().order_by('-date').values('body', 'date', 'user__username','id'))
    for comment in comments:
        comment['date'] = comment['date'].strftime("%y/%m/%d at %H:%M")
        comment["is_creator"]=False
        if request.user.is_authenticated:

            if comment["user__username"] == request.user.username:
                comment["is_creator"]=True


    print(comments)
    serialized_content={"title":content.title,
                        "description":content.description,
                        "url_youtube":content.url_youtube,
                        "url_image":content.url_image,
                        "category":content.category,
                        "comments":comments}
    return JsonResponse({
        "is_teacher":is_teacher,
        "content":serialized_content,
        "creator": {"username":content.user.username,"picture_url":content.user.picture_url,}
    },status=200,safe=False)

@csrf_exempt
def single_content_comment(request,content_id):
    if request.user.is_authenticated == False:
        return JsonResponse({"error":"You have to be logged in!"},status=403)
    try:
        content = SingleContent.objects.all().get(pk=content_id)
    except ObjectDoesNotExist:
        return JsonResponse(
            {"error": "Object does not exist"}, status=404
        )
    if request.method=='POST':
        data=json.loads(request.body)
        if data["body"]=="" or data["body"].strip()=="":
            return JsonResponse({"error": "Empty Comment"},status=403)
        new_comment=Comment(
            user=request.user,
            single_content=content,
            body=data["body"]
        )
        new_comment.save()
        new_list_comments = list(content.comments.all().order_by('-date').values('body', 'date', 'user__username', 'id'))
        for comment in new_list_comments:
            comment['date'] = comment['date'].strftime("%y/%m/%d at %H:%M")
            comment["is_creator"] = False
            if request.user.is_authenticated:

                if comment["user__username"] == request.user.username:
                    comment["is_creator"] = True
        return JsonResponse({"new_list_comments":new_list_comments},status=200)
    if request.method=='PUT':
        data=json.loads(request.body)
        if data["action"] == "edit":
            new_body=data["new_body"]
            if new_body.strip()=="" or new_body=="":
                return JsonResponse({"error": "Empty Comment"}, status=403)
            comment_id=data["comment_id"]
            try:
                comment=Comment.objects.all().get(pk=comment_id)
            except ObjectDoesNotExist:
                return JsonResponse({"error": "Object does not exist"}, status=404)
            if request.user == comment.user:
                comment.body=new_body
                comment.save()
                return JsonResponse({"message":"Comment is changed"},status=200)


        else:
#            delete comment
#
            try:
                comment = Comment.objects.all().get(pk=data["comment_id"])
                comment.delete()
            except ObjectDoesNotExist:
                return JsonResponse({"error": "Object does not exist"}, status=404)

            return JsonResponse({"response":"Successfully deleted"},status=200)

@csrf_exempt
def get_course(request,course_id):
    try:
        course=Course.objects.all().get(pk=course_id)

    except ObjectDoesNotExist:
        return JsonResponse(
            {"error": "Object does not exist"}, status=404
        )
    content = list(course.content.all().order_by('title').values('title', 'description', 'url_youtube','url_image','id'))
    print(content)
    serialised_course={
        "creator": course.creator.username,
        "creator_image_url":course.creator.picture_url,
        "name":course.name,
        "overview":course.overview,
        "url_image":course.url_image,
        "content":content,
    }
    return JsonResponse({"course":serialised_course,},status=200)

