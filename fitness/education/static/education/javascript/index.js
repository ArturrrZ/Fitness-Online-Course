const { useState } = React;
const root=document.querySelector("#root");

fetch("/api/get_index")
.then(response=>{return (response.json())})
.then(data=>{
    console.log(data)
    ReactDOM.render(<div>
        <App data={data}/>
    </div>,root);
})


function App(props){
    const [view,setView] = useState("all")
    return (<div className="index_app">
    <div className="top_part">
        <div>
        <h1>Invest in yourself!</h1>
        <p>Lorem ipsum dolor sit amet, 
        consectetur adipiscing elit. Sed felis tellus, viverra id lobortis in, consectetur nec leo.
         Donec ultricies venenatis diam, in vehicula quam iaculis eu. Aliquam dapibus posuere blandit.
          </p></div>
        {/* <img src="https://images.pexels.com/photos/2171077/pexels-photo-2171077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"/> */}
        <img src="https://media.istockphoto.com/id/1652535525/photo/sliced-cucumbers-in-water.jpg?s=1024x1024&w=is&k=20&c=_szKJyuGpCUNYoBlxX4T0i7E9XTMuovpaQ3sizQoyQw="/>
        {/* <img src="https://media.istockphoto.com/id/623207940/photo/picnic-at-the-park.jpg?s=1024x1024&w=is&k=20&c=F6lNwT-sMyT0Am6ihkn--LC2e1YGPCeQEHCEopFF-Ck="/> */}
        {/* <img src="https://images.pexels.com/photos/3776805/pexels-photo-3776805.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"/> */}
        {/* <img src="https://images.pexels.com/photos/5529531/pexels-photo-5529531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"/> */}
    </div>


        <div className="navigation_index">
            <span className="navigate" onClick={function(){setView("all")}}>All</span>
            <span className="navigate" onClick={function(){setView("fitness")}}>Fitness</span>
            <span className="navigate" onClick={function(){setView("nutrition")}}>Nutrition</span>
            <span className="navigate" onClick={function(){setView("professional")}}>Professional Sports</span>
        </div><br/>
        {view==="all"&&<div>
            <h1 className="category_name">All courses:</h1>
            <div className="courses">{props.data.all.courses.map(course=><Course key={course.id} course={course}/>)}</div>
            <hr/>
            <h1 className="category_name">All free content:</h1>
            <div className="free_contents">{props.data.all.free_content.map(content=><Content key={content.id} content={content}/>)}</div>

        </div>}
        {view==="fitness"&&<div>
            <h1 className="category_name">Fitness Courses:</h1>
            <div className="courses">{props.data.fitness.courses.map(course=><Course key={course.id} course={course}/>)}</div>
            <hr/>
            <h1 className="category_name">Enjoy free content:</h1>
            <div className="free_contents">{props.data.fitness.free_content.map(content=><Content key={content.id} content={content}/>)}</div>

        </div>}
        {view==="nutrition"&&<div>
            <h1 className="category_name">Nutrition Courses:</h1>
            <div className="courses">{props.data.nutrition.courses.map(course=><Course key={course.id} course={course}/>)}</div>
            <hr/>
            <h1 className="category_name">Enjoy free content:</h1>
            <div className="free_contents">{props.data.nutrition.free_content.map(content=><Content key={content.id} content={content}/>)}</div>

    
        </div>}
        {view==="professional"&&<div>
            <h1 className="category_name">Proffessional Sports Courses:</h1>
            <div className="courses">{props.data.professional.courses.map(course=><Course key={course.id} course={course}/>)}</div>
            <hr/>
            <h1 className="category_name">Enjoy free content:</h1>
            <div className="free_contents">{props.data.professional.free_content.map(content=><Content key={content.id} content={content}/>)}</div>

        </div>}
        </div>
    )
}

function Course(props){

    function GetOwnerShip(){
            if (props.course.joined_course) {
                return(
                    <h6>purchased</h6>
                )
            }
            if (props.course.in_cart) {return(<h6>in cart</h6>)}
            else {return (<h6>add to cart</h6>)}
    }

    return(
    <div  className="course" onClick={function(){window.location.href=`/course/${props.course.id}`}}>
              <img src={props.course.url_image}/>
              <div className="course_info">
              <h5 className="course_name">{props.course.name}</h5>
              <div className="course_creator">{props.course.creator__first_name} {props.course.creator__last_name}</div>
              <div className="course_bottom"><div className="course_price">${props.course.price}</div>  <div className="course_custom"><div>{props.course.category}</div></div> </div>
              </div>
    </div>
    )
}

function Content(props){
    return(
    <div  className="course" onClick={function(){window.location.href=`/single_content/${props.content.id}`}}>
              <img src={props.content.url_image}/>
              <div className="course_info">
              <h5 className="course_name">{props.content.title}</h5>
              <div className="course_creator">{props.content.user__first_name} {props.content.user__last_name}</div>
              <div className="course_bottom"><div className="course_price">FREE</div> <div className="course_custom"><div>{props.content.category}</div></div> </div>
              </div>
    </div>
    )
}