from django.contrib.auth import login,logout,authenticate
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.shortcuts import render,reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
import json
import datetime
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers import serialize
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Avg

from .forms import RegisterForm,LoginForm, CreateTeacherForm, SingleContentForm, CourseForm
from .models import User,SingleContent, Course,Comment, Rating, Participation
# Create your views here.

def getProperEndPoint(url_link):
    # Check if the URL is a standard YouTube watch URL
    if "youtube.com/watch?v=" in url_link:
        video_id = url_link.split("youtube.com/watch?v=")[1].split("&")[0]
    # Check if the URL is a short YouTube URL
    elif "youtu.be/" in url_link:
        video_id = url_link.split("youtu.be/")[1].split("?")[0]
    else:
        # If the URL format is not recognized, return None or handle it accordingly
        video_id = "xsNkZq5YNDg"
    return video_id

def about(request):
    return render(request,"education/about.html")
@login_required(login_url="login")
def index(request):
    return render(request,"education/index.html",{

    })

def register(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
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
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
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

@login_required(login_url="login")
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
    if request.user.teacher:
        return HttpResponseRedirect(reverse("user",args=(request.user.username,)))
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

@login_required(login_url="login")
def create_single(request):
    if not request.user.teacher:
        return HttpResponseRedirect(reverse("create_teacher"))

    if request.method=="POST":
        form=SingleContentForm(request.POST)
        if form.is_valid():
            youtube_link=form.cleaned_data['url_youtube']
            endpoint=getProperEndPoint(youtube_link)
            form.instance.url_youtube = endpoint
            form.save(user=request.user)
            return HttpResponseRedirect(reverse("index"))
    return render(request,"education/create_single.html",{
        "form": SingleContentForm(),
    })
@login_required(login_url="login")
def create_course(request):
    if not request.user.teacher:
        return HttpResponseRedirect(reverse("create_teacher"))
    all_content = SingleContent.objects.filter(user=request.user)
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
        else:
            return render(request, "education/create_course.html", {
                "form": CourseForm(),
                "all_content": all_content,
                "message":"Price has to be greater than 0$ and less than 500$",
            })


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
        return render(request,"education/course_overview.html",{"course":course})

def certificate(request,course_id):
    if request.method=='POST':
        first=request.POST["first"]
        last=request.POST["last"]
        request.user.first_name=first
        request.user.last_name=last
        request.user.save()
        return HttpResponseRedirect(reverse("certificate",args=(course_id,)))
    try:
        course=Course.objects.all().get(pk=course_id)
        participation=Participation.objects.all().get(participant=request.user,course=course)
    except ObjectDoesNotExist:
        return render(request,"education/404.html")
    return render(request,"education/certificate.html",{
        "course":course,
        "user":request.user,
        "participation":participation
    })
@csrf_exempt
def edit_course(request,course_id):
    try:
        course=Course.objects.all().get(pk=course_id)
    except ObjectDoesNotExist:
        return (render(request,"education/404.html"))
    if course.creator != request.user:
        return (render(request,"education/404.html"))
    #
    all_content = SingleContent.objects.filter(user=request.user)
    content_already_in_course=course.content.all()
    print(content_already_in_course)
    inserted_content=[]
    for content in all_content:
        obj={"itself":content,"is_in_course":False}
        if content in content_already_in_course:
            obj["is_in_course"]=True
        inserted_content.append(obj)
    # print(inserted_content)
    if request.method=='POST':
        course.name=request.POST.get("name")
        course.url_image=request.POST.get("url_image")
        course.price=request.POST.get("price")
        course.category=request.POST.get("category")
        course.overview=request.POST.get("overview")
        course.language=request.POST.get("language")
        course.save()
        selected_content_ids = request.POST.getlist('content')
        selected_content = SingleContent.objects.filter(id__in=selected_content_ids)
        course.content.set(selected_content)
        # print(selected_content)
        return (HttpResponseRedirect(reverse("course",args=(course_id,))))
    return render(request,"education/edit_course.html",{
        "course":course,
        "all_content":inserted_content,
        # "condition":True,
    })

@csrf_exempt
def single_content(request,content_id):
    try:
        content=SingleContent.objects.get(pk=content_id)
    except ObjectDoesNotExist:
        return render (request,"education/404.html")
    if content.user == request.user and content.is_free==False:
        # print(content)
        if request.method == 'POST':
            form = SingleContentForm(request.POST, instance=content)
            if form.is_valid():
                form.save()
                return HttpResponseRedirect(reverse("user",args=(request.user.username,)))
        form = SingleContentForm(instance=content)

        return render(request, "education/edit_paid_content.html", {"content": content,"form":form})
    if content.is_free == False:

        return render (request,"education/404.html")
    return render (request,"education/single_content.html",{"content":content})

@login_required(login_url="login")
def my_learning(request):
    return render(request,"education/my_learning.html")

@login_required(login_url="login")
def my_cart(request):
    return render (request,"education/my_cart.html")
@login_required(login_url="login")
@csrf_exempt
def buy_my_cart(request):
    if request.method=='POST':
        data=json.loads(request.body)
        if data["answer"] == True:
            for each_item in request.user.cart.all():
                request.user.joined_course.add(each_item)
                request.user.cart.remove(each_item)
                request.user.save()
            return JsonResponse({"response":"Completed"})
    return render(request,"education/buy_my_cart.html")


def search(request):
    name = request.GET.get('name', '')
    return render(request,"education/search.html",{
        "name":name})
# ---------------------------- API REQUESTS ---------------------- #
def search_api(request,name):
    max_price=request.GET.get("max_price",500)
    rating=request.GET.get("rating",0)
    language=request.GET.get("language","any")
    print(max_price)
    search=name
    if language=="any":
        try:
            courses_newest=list(Course.objects.filter(name__icontains=search).filter(price__lte=max_price).filter(current_rating__gte=rating).values("id","name","current_rating","date","price","creator__username","creator__first_name","creator__last_name","category","url_image").order_by("-date"))
            courses_oldest=list(Course.objects.filter(name__icontains=search).filter(price__lte=max_price).filter(current_rating__gte=rating).values("id","name","current_rating","date","price","creator__username","creator__first_name","creator__last_name","category","url_image").order_by("date"))
            courses_alphabet=list(Course.objects.filter(name__icontains=search).filter(price__lte=max_price).filter(current_rating__gte=rating).values("id","name","current_rating","date","price","creator__username","creator__first_name","creator__last_name","category","url_image").order_by("name"))
            courses_price=list(Course.objects.filter(name__icontains=search).filter(price__lte=max_price).filter(current_rating__gte=rating).values("id","name","current_rating","date","price","creator__username","creator__first_name","creator__last_name","category","url_image").order_by("price"))

        except ObjectDoesNotExist:
            return JsonResponse({"courses":[]})
    else:
        try:
            courses_newest = list(Course.objects.filter(name__icontains=search).filter(price__lte=max_price).filter(
                current_rating__gte=rating).filter(language__exact=language).values("id", "name", "current_rating", "date", "price", "creator__username",
                                                   "creator__first_name", "creator__last_name", "category",
                                                   "url_image").order_by("-date"))
            courses_oldest = list(Course.objects.filter(name__icontains=search).filter(price__lte=max_price).filter(
                current_rating__gte=rating).filter(language__exact=language).values("id", "name", "current_rating", "date", "price", "creator__username",
                                                   "creator__first_name", "creator__last_name", "category",
                                                   "url_image").order_by("date"))
            courses_alphabet = list(Course.objects.filter(name__icontains=search).filter(price__lte=max_price).filter(
                current_rating__gte=rating).filter(language__exact=language).values("id", "name", "current_rating", "date", "price", "creator__username",
                                                   "creator__first_name", "creator__last_name", "category",
                                                   "url_image").order_by("name"))
            courses_price = list(Course.objects.filter(name__icontains=search).filter(price__lte=max_price).filter(
                current_rating__gte=rating).filter(language__exact=language).values("id", "name", "current_rating", "date", "price", "creator__username",
                                                   "creator__first_name", "creator__last_name", "category",
                                                   "url_image").order_by("price"))

        except ObjectDoesNotExist:
            return JsonResponse({"courses": []})
    for course_sort in courses_newest,courses_oldest,courses_alphabet,courses_price:
        for course in course_sort:
            course['date']=course['date'].strftime("%m/%d/%y")
            course_ojb=Course.objects.all().get(pk=course["id"])
            course["participants"]=course_ojb.participants.count()
            course["rated"]=course_ojb.ratings.count()
    paginator_newest = Paginator(courses_newest, 4)
    paginator_newest_list = [
        {"page_index": page.number - 1, "has_next": page.has_next(), "has_previous": page.has_previous(),
         "courses": page.object_list, } for page in paginator_newest]
    #
    paginator_oldest = Paginator(courses_oldest, 4)
    paginator_oldest_list = [
        {"page_index": page.number - 1, "has_next": page.has_next(), "has_previous": page.has_previous(),
         "courses": page.object_list, } for page in paginator_oldest]
    #
    paginator_alphabet=Paginator(courses_alphabet,4)
    paginator_alphabet_list=[{"page_index":page.number-1,"has_next":page.has_next(),"has_previous":page.has_previous(),"courses": page.object_list,} for page in paginator_alphabet]
    #
    paginator_price=Paginator(courses_price,4)
    paginator_price_list=[]
    for page in paginator_price:
        paginator_price_list.append({
            "page_index": page.number-1,
            "has_next":page.has_next(),
            "has_previous":page.has_previous(),
            "courses": page.object_list,

        })
    return JsonResponse({
                         # "courses_newest":courses_newest,
                         # "courses_oldest":courses_oldest,
                         # "courses_alphabet":courses_alphabet,
                         # "courses_price":courses_price,
                         "found":len(courses_newest),
                         "paginator_newest_list":paginator_newest_list,
                         "paginator_oldest_list":paginator_oldest_list,
                         "paginator_alphabet_list":paginator_alphabet_list,
                         "paginator_price_list":paginator_price_list,
                         })
@csrf_exempt
def my_cart_api(request):
    if request.method=="POST":
        data = json.loads(request.body)
        course_id = data["course_id"]
        try:
            course = Course.objects.all().get(pk=course_id)
        except ObjectDoesNotExist:
            return JsonResponse({"error": "Object does not exist"})
        request.user.cart.add(course)
        request.user.save()
        return JsonResponse({"message":"Completed"})
    if request.method=='PUT':
        # remove from cart
        data=json.loads(request.body)
        course_id=data["course_id"]
        try:
            course=Course.objects.all().get(pk=course_id)
        except ObjectDoesNotExist:
            return JsonResponse({"error":"Object does not exist"})
        request.user.cart.remove(course)
        request.user.save()

    courses_in_cart=list(request.user.cart.all().values("name","price","id","creator__first_name","creator__last_name","creator__username"))
    return JsonResponse({"cart":courses_in_cart})
@csrf_exempt
def my_learning_api(request):
    joined_courses=list(request.user.joined_courses.all().values("date","is_completed","course__name","course__creator__first_name","course__creator__last_name","course__url_image","course__price","id","course__id"))
    for course in joined_courses:
        course["date"]=course["date"].strftime("%m/%d/%y")

    if request.method=='PUT':
        data=json.loads(request.body)
        # print("Course ID:"+str(data["course_id"]))
        try:
            participation=Participation.objects.all().get(pk=data["course_id"])
        except ObjectDoesNotExist:
            return render(request,"education/404.html")
        if participation.participant != request.user:
            return render(request,"education/404.html")
        participation.is_completed=not participation.is_completed
        participation.completed_date=datetime.datetime.now()
        participation.save()
        return JsonResponse({"message":"Done"},status=200)
    # pages=Paginator(joined_courses,2)
    # pages_dict={}
    # for index,page in enumerate(pages):
    #     pages_dict[page.number]={
    #         "objects": page.object_list,
    #         "has_next": page.has_next(),
    #         "has_previous": page.has_previous(),
    #     }
    # print(pages_dict)
    # page_obj=list(pages.get_page(1))
    # # print(page_obj)
    # # serialized_courses=[course.serialize() for course in page_obj]
    return JsonResponse({
        "user_id":request.user.id,
        "username":request.user.username,
        "joined_courses":joined_courses,
        # "serialized_courses":pages_dict,
        # "page":pages.get_page(1).object_list,
        # "has_next":pages.get_page(1).has_next()
        })

@csrf_exempt
def get_index(request):
    all={
        "courses": list(Course.objects.all().values("name","url_image","creator__first_name","creator__last_name","price","id","category")),
        "free_content": list(SingleContent.objects.all().filter(is_free=True).values("title","url_image","user__first_name","user__last_name","id","category"))
    }
    fitness={
        "courses":list(Course.objects.all().filter(category="fitness").values("name","url_image","creator__first_name","creator__last_name","price","id")),
        "free_content":list(SingleContent.objects.all().filter(category="fitness").filter(is_free=True).values("title","url_image","user__first_name","user__last_name","id"))
    }
    nutrition = {
        "courses": list(
            Course.objects.all().filter(category="nutrition").values("name", "url_image", "creator__first_name","creator__last_name", "price", "id")),
        "free_content": list(
            SingleContent.objects.all().filter(category="nutrition").filter(is_free=True).values("title", "url_image","user__first_name","user__last_name", "id"))
    }
    professional = {
        "courses": list(
            Course.objects.all().filter(category="professional").values("name", "url_image", "creator__first_name","creator__last_name", "price", "id")),
        "free_content": list(
            SingleContent.objects.all().filter(category="professional").filter(is_free=True).values("title", "url_image","user__first_name","user__last_name","id"))
    }

    for courses in all["courses"],fitness["courses"],nutrition["courses"],professional["courses"]:
        for course in courses:
            course_obj=Course.objects.all().get(pk=course["id"])
            if course_obj in request.user.joined_course.all():
                course["joined_course"]=True
            else:
                course["joined_course"] = False
            if request.user in course_obj.in_users_cart.all():
                # print("IN cart")
                course["in_cart"]=True
            else:
                course["in_cart"]=False

    paginator_all_courses=Paginator(all["courses"],4)
    all["courses"]=[{"page_index":page.number-1,"has_previous":page.has_previous(),"has_next":page.has_next(),"courses": page.object_list,} for page in paginator_all_courses]
    all["count_courses"]=paginator_all_courses.count

    #
    paginator_all_free = Paginator(all["free_content"], 4)
    all["free_content"] = [{"page_index": page.number - 1, "has_previous": page.has_previous(), "has_next": page.has_next(),
                       "free_content": page.object_list, } for page in paginator_all_free]
    all["count_free"] = paginator_all_free.count
    # ---
    paginator_fitness_courses = Paginator(fitness["courses"], 4)
    fitness["courses"] = [{"page_index": page.number - 1, "has_previous": page.has_previous(), "has_next": page.has_next(),
                       "courses": page.object_list, } for page in paginator_fitness_courses]
    fitness["count_courses"]=paginator_fitness_courses.count
    #
    paginator_fitness_free = Paginator(fitness["free_content"], 4)
    fitness["free_content"] = [
        {"page_index": page.number - 1, "has_previous": page.has_previous(), "has_next": page.has_next(),
         "free_content": page.object_list, } for page in paginator_fitness_free]
    fitness["count_free"]=paginator_fitness_free.count
    # -----nutrition---
    paginator_nutrition_courses = Paginator(nutrition["courses"], 4)
    nutrition["courses"] = [
        {"page_index": page.number - 1, "has_previous": page.has_previous(), "has_next": page.has_next(),
         "courses": page.object_list, } for page in paginator_nutrition_courses]
    nutrition["count_courses"]=paginator_nutrition_courses.count
    #
    paginator_nutrition_free = Paginator(nutrition["free_content"], 4)
    nutrition["free_content"] = [
        {"page_index": page.number - 1, "has_previous": page.has_previous(), "has_next": page.has_next(),
         "free_content": page.object_list, } for page in paginator_nutrition_free]
    nutrition["count_free"]=paginator_nutrition_free.count
    # -----professional---
    paginator_professional_courses = Paginator(professional["courses"], 4)
    professional["courses"] = [
        {"page_index": page.number - 1, "has_previous": page.has_previous(), "has_next": page.has_next(),
         "courses": page.object_list, } for page in paginator_professional_courses]
    professional["count_courses"]=paginator_professional_courses.count
    #
    paginator_professional_free = Paginator(professional["free_content"], 4)
    professional["free_content"] = [
        {"page_index": page.number - 1, "has_previous": page.has_previous(), "has_next": page.has_next(),
         "free_content": page.object_list, } for page in paginator_professional_free]
    professional["count_free"]=paginator_professional_free.count
    return JsonResponse({
        "all":all,
        "fitness":fitness,
        "nutrition":nutrition,
        "professional":professional,
    })
@csrf_exempt
def buy_course_api(request):
    if request.method=='POST':
        data=json.loads(request.body)
        # print(data['answer'])
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
        person.first_name=data["new_first_name"]
        person.last_name=data["new_last_name"]
        person.twitter=data["new_twitter"]
        person.linkedin=data["new_linkedin"]
        person.instagram=data["new_instagram"]
        person.save()
        return JsonResponse({"message":"Done!"},status=201)
    free_content = serialize('json', person.get_free_content())
    paid_content = serialize('json', person.get_paid_content())
    # print(paid_content)
    teacher=False
    student_teacher=False
    student=False
    if request.user == person and person.teacher==True:
        teacher=True
    elif request.user != person and person.teacher==True:
        student_teacher=True
    else:
        student=True
    joined_courses=list(person.joined_courses.all().values("date","course__name","course__creator__username","course__url_image","course__price","id","course__id"))
    for course in joined_courses:
        course["date"]=course["date"].strftime("%m/%d/%y")
    created_courses=list(person.created_courses.all().values("name","url_image","price","id","category"))
    # print(joined_courses)
    person_object={
        "headline": person.headline,
        "about":person.about,
        "free_content": free_content,
        "paid_content":paid_content,
        "picture":person.picture_url,
        "full_name": person.get_full_name(),
        "first_name": person.first_name,
        "last_name":person.last_name,
        "twitter":person.twitter,
        "linkedin":person.linkedin,
        "instagram":person.instagram,
        "teacher":teacher,
        "student_teacher":student_teacher,
        "student":student,
        "joined_courses": joined_courses,
        "username":person.username,
        "created_courses":created_courses,

    }
    # print(person.get_full_name())
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
                content.url_youtube=getProperEndPoint(data["new_url_youtube"])
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
        comment['date'] = comment['date'].strftime("%m/%d/%y at %H:%M")
        comment["is_creator"]=False
        if request.user.is_authenticated:

            if comment["user__username"] == request.user.username:
                comment["is_creator"]=True


    # print(comments)
    serialized_content={"title":content.title,
                        "description":content.description,
                        "url_youtube":content.url_youtube,
                        "url_image":content.url_image,
                        "category":content.category,
                        "comments":comments}
    return JsonResponse({
        "is_teacher":is_teacher,
        "content":serialized_content,
        "creator": {"username":content.user.username,"picture_url":content.user.picture_url,
                    "first_name":content.user.first_name,"last_name":content.user.last_name,
                    "headline":content.user.headline,
                    }
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
            comment['date'] = comment['date'].strftime("%%m/%d/%y at %H:%M")
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
    # print(content)
    is_rated = False
    ratings=list(course.ratings.all().order_by('-date').values('user__username','message','date','rate','id'))
    for rating in ratings:
        rating['date'] = rating['date'].strftime("%m/%d/%y")
        if request.user.is_authenticated:
            if rating['user__username'] == request.user.username:
                is_rated = True
                rating["rated_course"]=True
            else:
                # is_rated=False
                rating["rated_course"] = False
    current_rating=course.current_rating

    is_creator=False
    if request.user == course.creator:
        is_creator=True
    serialised_course={
        "creator": course.creator.username,
        "is_creator":is_creator,
        "creator_image_url":course.creator.picture_url,
        "name":course.name,
        "overview":course.overview,
        "url_image":course.url_image,
        "content":content,
        "rating_system": {"ratings":ratings,"rating":current_rating,"rated":is_rated,}
    }
    if request.method=='POST':
        data=json.loads(request.body)

        new_review=Rating(user=request.user,
                          course=course,
                          message=data["message"],
                          rate=data["rate"]
                          )
        new_review.save()

        average_rating = Rating.objects.filter(course=course).aggregate(avg_rating=Avg('rate'))['avg_rating']
        course.current_rating=round(average_rating,2)
        course.save()
        is_rated = False
        ratings = list(course.ratings.all().order_by('-date').values('user__username', 'message', 'date', 'rate', 'id'))
        for rating in ratings:
            rating['date'] = rating['date'].strftime("%m/%d/%y")
            if request.user.is_authenticated:
                if rating['user__username'] == request.user.username:
                    is_rated = True
                    rating["rated_course"] = True
                else:
                    # is_rated=False
                    rating["rated_course"] = False
            else:
                pass

        current_rating = course.current_rating

        return JsonResponse({
            "new_rating_system": {"ratings":ratings,"rating":current_rating,"rated":is_rated,}
            },status=200)
    return JsonResponse({"course":serialised_course,},status=200)

@csrf_exempt
def rating_edit(request,rating_id):
    try:
        rating=Rating.objects.all().get(pk=rating_id)
    except ObjectDoesNotExist:
        return JsonResponse({"error":"message does not exist"})
    if request.method=="PUT":
        data=json.loads(request.body)
        if data["action"]=="edit":
            #
            new_message=data["message"]
            rating.message=new_message
            rating.save()
            return JsonResponse({"response":"done"})
        if data["action"]=="delete":
            rating.delete()

            try:
                course = Course.objects.all().get(pk=data["course_id"])
            except ObjectDoesNotExist:
                return JsonResponse({"error": "message does not exist"})
            average_rating = Rating.objects.filter(course=course).aggregate(avg_rating=Avg('rate'))['avg_rating']
            course.current_rating = round(average_rating, 2)
            course.save()
        return JsonResponse({"response":"done","new_rating":course.current_rating})

    return JsonResponse({"response":"done"})
