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
                {props.data.joined_courses.map(course=>{return(<Course key={course.course__id} course={course} />)})}
              </div>
        </div>
    )
}

function Course(props) {
    const [is_completed,setIsCompleted]=useState(props.course.is_completed);
    // console.log(props.course.course__id)
    function changeState(course_id){
      fetch("api/get_my_learning",{
        method:"PUT",
        body:JSON.stringify({
          course_id:course_id,
        })
      })
      .then(response=>{setIsCompleted(!is_completed);})
      .catch(error=>{console.log(error.message)})
        
        
    }
    function checkCertificate(event){
        event.stopPropagation();
        window.location.href=`/certificate/${props.course.course__id}`;
    }
    return (
        <div  className="course" style={is_completed?{backgroundColor:"#CAFF33",order: 1}:{}} onClick={function(){window.location.href=`/course/${props.course.course__id}`}}>
                  <img src={props.course.course__url_image}/>
                  <div className="course_info">
                  <h5 className="course_name">{props.course.course__name}</h5>
                  <div className="course_creator">{props.course.course__creator__first_name} {props.course.course__creator__last_name}
                  {is_completed&&<div><br/><a className="certificate_link" onClick={checkCertificate}>certificate</a></div>}
                  </div>
                  <div className="course_bottom"><div className="course_price">${props.course.course__price}</div>
                  
                  <div className="is_completed_section" onClick={(e)=>{e.stopPropagation();changeState(props.course.id)}}>
                    {is_completed?<div className="completed_course">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
</svg> <span className="is_completed_text">completed</span>
                    </div>:
                    <div className="incomplete_course"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hourglass" viewBox="0 0 16 16">
  <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5m2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702c0 .7-.478 1.235-1.011 1.491A3.5 3.5 0 0 0 4.5 13v1h7v-1a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351v-.702c0-.7.478-1.235 1.011-1.491A3.5 3.5 0 0 0 11.5 3V2z"/>
</svg> <span className="is_completed_text">in process</span></div>
                    }
                  </div>

                   <div className="course_custom">since {props.course.date}</div> </div>
                  </div>
                </div>
    )
}