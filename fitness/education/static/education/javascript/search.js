const { useState } = React;
const root = document.querySelector("#root");
const search=root.dataset.string;
// console.log(search);
fetch(`/api/search/${search}`)
.then(response=>{return(response.json())})
.then(data=>{
    // console.log(data)
    ReactDOM.render(<App data={data}/>, root);
})


function App(props){
    const [courses,setCourses]=useState(props.data.courses);
    console.log(courses);
    return(
        <div className="search_app">
            {/* <h1>{search}</h1> */}
            <h1>results for: "{search}"</h1>
            <div className="search_grid">
                <div className="left_search">form here</div>
                <div className="right_search">
                    {courses.map(course=>{
                        return(<Course key={course.id} data={course} />)
                    })}
                </div>
            </div>
        </div>
    )
}

function Course(props){
    return(
        <div className="search_course">
            <img src={props.data.url_image}/>
            <div className="middle_info">
                <h4>{props.data.name}</h4>
                <p>Created {props.data.date}</p>
                <p className="middle_creator">by {props.data.creator__first_name} {props.data.creator__last_name}</p>
            </div>
            <div className="right_price">{props.data.price}$</div>
        </div>
    )
}