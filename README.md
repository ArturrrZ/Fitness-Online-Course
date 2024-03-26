# Capstone Project CS50W

I've created an online educational platform.
The main idea of web application is to connect creators and students all over the world in essential topics such as fitness, nutriotion and proffessional sports.
The platform offers both free and premium courses, complete with verified certificates upon completion. Learners can engage with content through comments and ratings, fostering community-driven feedback. Advanced search features allow users to find courses by name and filter results by rating, language, price, and date, enhancing the user experience.

# CODE OVERVIEW.

The application is developed using Django, with SQLite as the database for efficient data management and storage. The frontend is styled with CSS and enhanced with Bootstrap for responsive design elements, such as the navigation bar. For dynamic interactivity, the platform employs JavaScript, with a significant emphasis on React (sourced through CDN), to enrich the user experience with features like live search results, comments, ratings, and bookmarking.

Additionally, the search functionality is augmented by JavaScript and React to include filters for courses based on price, rating, and language. This allows users to tailor their search results to meet specific preferences, making it easier to find courses that match their needs and interests.


# FOLDER TREE


│   db.sqlite3
│   manage.py
├───.idea
├───education
    │   │   admin.py
│   │   apps.py
│   │   forms.py
│   │   models.py
│   │   tests.py
│   │   urls.py
│   │   views.py
│   │
│   ├───migrations
│   ├───static
│   │   └───education
│   │       │   styles.css
│   │       │
│   │       └───javascript
│   ├───templates
│   │   └───education
└───fitness
    │   asgi.py
    │   settings.py
    │   urls.py
    │   wsgi.py
    │   __init__.py
    │
    └───__pycache__

# Fitness project has an app called education where all essential files are. 
## Here a major ones:
### forms.py:
Defines forms for user input needed for login/register functionality, and creating/changing info about content and courses.
### models.py:
Contains the database models as classes, representing the data structure.

  class User:
Represents both learners and instructors on the platform.
Includes standard user information (from AbstractUser) plus social media links, a flag to indicate if the user is a teacher, a personal headline, about section, and a profile picture.
Users can have a cart for enrolling in courses.
The model is extended to manage permissions and groups specifically for this app.
Methods to retrieve free and paid content associated with the user are included.
  class SingleContent:
Represents individual pieces of content (like a video, article, etc.) that can be part of a course.
Each piece of content is linked to a user (creator), has a title, description, optional YouTube URL, and image URL.
Content is categorized and can be marked as free or paid.
  class Course:
A course consists of multiple pieces of content (SingleContent), created by a user.
Includes basic course information like name, overview, image, category, price, language, and the content it includes.
Manages participants through a separate Participation model.
Tracks the course's creation date and current average rating.
  class Participation:
Models the relationship between users and the courses they are participating in.
Includes a participant (user), course, the date of joining, optional reason for joining, completion status, and completed date.
  class Comment:
Allows users to leave comments on individual pieces of content.
Each comment is linked to a user and a piece of content, including the comment text and the date it was made.
 class Rating:
Enables users to rate courses.
Each rating is linked to a user and a course, including an optional message, the date of the rating, and the rating value (0-5).

### static:	
Holds static files like CSS and JavaScript, including a React application for dynamic content handling.
### templates:
Contains HTML templates for rendering the app's web pages(includes 404.html file to render a custom error for bad requests and forbidden materials, layout.html is a layout template).

### urls.py:
Manages the URL declarations for the app (also API routes to connect React with server).
### views.py:
There are number of different views to render web pages and manipulate the data in database with the help of Django built-in feature.

### Here some of them:

#### Authentication

path("register",views.register,name="register"),
path("login",views.login_view,name="login"),
path("logout",views.logout_view,name="logout"),

Allows users to register/login and logout.

#### Instructor

path("teacher/create_teacher",views.create_teacher,name='create_teacher'),
path("teacher/create_single",views.create_single,name="create_single"),
path("teacher/create_course",views.create_course,name="create_course"),
path("teacher/course/edit/<int:course_id>", views.edit_course, name="edit_course"),

Allows users to become a teacher,create a single piece of content, generate a course, modify them.
Applies getProperEndPoint function to get a proper endpoint from any youtube link to insert into a youtube embed video to show on the screen.

#### Course purchasing
path("course/buy/<int:course_id>",views.buy_course,name="buy_course"),
path("my_cart",views.my_cart,name="my_cart"),
path("buy_my_cart",views.buy_my_cart,name="buy_my_cart"),

There are 2 ways to get any course. Learners are able to buy a single course directly or buy a bunch of them via a cart.

#### Course, Single Content view
path("course/<int:course_id>",views.course,name="course"),
path("single_content/<int:content_id>",views.single_content,name="single_content"),

Well designed and secured views.

#### Learning and completion

path("my_learning",views.my_learning,name="my_learning"),

Learners are able to see all of their courses.
If they mark any course as finished, they'll be able to view a verified certificate with the date of purchasing and completion.
path("certificate/<int:course_id>",views.certificate,name="certificate"),

#### Search
path("search",views.search,name="search"),

Students can search for any course by name. Filter and sort them afterthat.

#### Index, About pages
path("",views.index,name="index"),
All courses on the screen.Where students can filter by category.

path("about",views.about,name="about"),
Simple page with information to advertise the Educational Platform.

And finally api routes to manipulate the data with the help of REACT
#### API

