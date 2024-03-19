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
    // console.log(props.data.all.courses[0].courses)
    const [view,setView] = useState({
        category:"all",
        page_courses_ingex:props.data.all.courses[0].page_index,
        page_courses_has_previous:props.data.all.courses[0].has_previous,
        page_courses_has_next:props.data.all.courses[0].has_next,
        page_courses_courses:props.data.all.courses[0].courses,
        page_free_ingex:props.data.all.free_content[0].page_index,
        page_free_has_previous:props.data.all.free_content[0].has_previous,
        page_free_has_next:props.data.all.free_content[0].has_next,
        page_free_free_content:props.data.all.free_content[0].free_content,
        count_courses:props.data.all.count_courses,
        count_free:props.data.all.count_free,
    })
    function changeState(category){
        setView({
        category:category,
        page_courses_ingex:props.data[category].courses[0].page_index,
        page_courses_has_previous:props.data[category].courses[0].has_previous,
        page_courses_has_next:props.data[category].courses[0].has_next,
        page_courses_courses:props.data[category].courses[0].courses,
        page_free_ingex:props.data[category].free_content[0].page_index,
        page_free_has_previous:props.data[category].free_content[0].has_previous,
        page_free_has_next:props.data[category].free_content[0].has_next,
        page_free_free_content:props.data[category].free_content[0].free_content,
        count_courses:props.data[category].count_courses,
        count_free:props.data[category].count_free,
        })
    }
    function checkSibl(bool){
        if (bool===false){
            return {
                display:"none"
            }
        }
        if (bool===true){
            return {
                display:"inline-block"
            }
        }
    }
    function setCoursePage(num){
        let category=view.category;
        // console.log(num);
        setView({
            ...view,
        page_courses_ingex:props.data[view.category].courses[num].page_index,
        page_courses_has_previous:props.data[view.category].courses[num].has_previous,
        page_courses_has_next:props.data[view.category].courses[num].has_next,
        page_courses_courses:props.data[view.category].courses[num].courses,

        })
    }
    function setFreePage(num){
        setView({
            ...view,
            page_free_ingex:props.data[view.category].free_content[num].page_index,
            page_free_has_previous:props.data[view.category].free_content[num].has_previous,
            page_free_has_next:props.data[view.category].free_content[num].has_next,
            page_free_free_content:props.data[view.category].free_content[num].free_content,

        })
    }
    
    // console.log(view)
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
            <span className="navigate" onClick={function(){changeState("all")}}>All</span>
            <span className="navigate" onClick={function(){changeState("fitness")}}>Fitness</span>
            <span className="navigate" onClick={function(){changeState("nutrition")}}>Nutrition</span>
            <span className="navigate" onClick={function(){changeState("professional")}}>Professional Sports</span>
        </div><br/>
        <div>
            <h1 className="category_name">All courses: <span className="count_courses">({view.count_courses})</span></h1>
            <div className="courses">{view.page_courses_courses.map(course=><Course key={course.id} course={course}/>)}</div>
            <div className="navigation_index_page">
            <span className="prev" style={checkSibl(view.page_courses_has_previous)} onClick={function(){setCoursePage(view.page_courses_ingex-1)}}><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
</svg></span>
                        <span className="page_num"> {view.page_courses_ingex+1} </span>
                        <span className="next" style={checkSibl(view.page_courses_has_next)} onClick={function(){setCoursePage(view.page_courses_ingex+1)}}><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
</svg></span></div>
            <hr/>
            <h1 className="category_name">All free content: <span className="count_courses">({view.count_free})</span></h1>
            <div className="free_contents">{view.page_free_free_content.map(content=><Content key={content.id} content={content}/>)}</div>

            <div className="navigation_index_page">
            <span className="prev" style={checkSibl(view.page_free_has_previous)} onClick={function(){setFreePage(view.page_free_ingex-1)}}><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
</svg></span>
                        <span className="page_num"> {view.page_free_ingex+1} </span>
                        <span className="next" style={checkSibl(view.page_free_has_next)} onClick={function(){setFreePage(view.page_free_ingex+1)}}><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
</svg></span></div>
        </div>
        
        
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