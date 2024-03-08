const { useState } = React;
const root=document.querySelector("#root");

fetch("api/get_my_learning")
.then(response=>{return(response.json())})
.then(data=>{
    console.log(data);
    ReactDOM.render(<App data={data}/>,root);
})

function App(props){
    return(
        <div className="my_learning_app">
             <div className="person_username">{props.data.username}</div>
              <div className="courses_enrolled">Courses you are enrolled in</div>
              <div className="course_zone">
                {props.data.joined_courses.map(course=>{return(<Course key={course.course__id} />)})}
              </div>
        </div>
    )
}

function Course() {
    return (<div>
        <h1>Course name</h1>
    </div>)
}