const { useState } = React;
const root = document.querySelector("#root");
const search=root.dataset.string;
// console.log(search);
fetch(`/api/search/${search}`)
.then(response=>{return(response.json())})
.then(data=>{
    console.log(data)   
    ReactDOM.render(<App data={data}/>, root);
})


function App(props){
    const [courses,setCourses]=useState(props.data.courses_newest);
    // console.log(courses);
    function submitForm(event){
        event.preventDefault();
        // console.log(event.target.sort.value);
        {event.target.sort.value=="newest"&&setCourses(props.data.courses_newest)};
        {event.target.sort.value=="oldest"&&setCourses(props.data.courses_oldest)};
        {event.target.sort.value=="alphabet"&&setCourses(props.data.courses_alphabet)};
        {event.target.sort.value=="price"&&setCourses(props.data.courses_price)};
        // fetch
    }
    return(
        <div className="search_app">
            {/* <h1>{search}</h1> */}
            <h1>results for: "{search}"</h1>
            <div className="search_grid">
                <div className="left_search">form here</div>
                <div className="right_search">
    <form action="/action_page.php" onSubmit={submitForm}>
  <label htmlFor="sort">Sort by</label>
  <select id="sort" name="sort">
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
    <option value="alphabet">Alphabet</option>
    <option value="price">Price</option>
  </select>
    <input type="submit"/>
    </form>
                    {courses.map(course=>{
                        return(<Course key={course.id} data={course} />)
                    })}
                </div>
            </div>
        </div>
    )
}

function Course(props){
    let href=`/user/${props.data.creator__username}`;
    function goToCourse(){
        window.location.href=`course/${props.data.id}`;
    }
    return(
        <div className="search_course">
            <img className="search_anchor" onClick={goToCourse} src={props.data.url_image}/>
            <div className="middle_info">
                <h4 className="search_anchor" onClick={goToCourse}>{props.data.name}</h4>
                <p>{props.data.participants} enrolled</p>
                <p>Created {props.data.date}</p>
                <p className="middle_creator">by <a href={href}>{props.data.creator__first_name} {props.data.creator__last_name}</a></p>
            </div>
            <div className="right_price">{props.data.price}$</div>
        </div>
    )
}