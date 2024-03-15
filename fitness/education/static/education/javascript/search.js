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
    const [max,setMax]=useState(500);
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

    function handleFilter(event){
        event.preventDefault();
        console.log(event.target.max.value);
        console.log(event.target.rating.value);
        console.log(event.target.language.value);
    }
    return(
        <div className="search_app">
            {/* <h1>{search}</h1> */}
            <h1>results for: "{search}"</h1>
            <div className="search_grid">
                <div className="left_search">
                    <form className="left_search_form" onSubmit={handleFilter}>
                    {/* <input type="range" id="min" name="min" min="0" max="100"/> */}
                    <h5>Rating</h5> 
                    <div className="stars_left">
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star "></span>
                        <span className="stars_left_text"> 4 & up </span><input type="radio" name="rating" value="4" />
                    </div>
                    <div className="stars_left">
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star "></span>
                        <span className="fa fa-star "></span>
                        <span className="stars_left_text"> 3 & up </span><input type="radio" name="rating" value="3" />
                    </div> 
                    <div className="stars_left">
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star "></span>
                        <span className="fa fa-star "></span>
                        <span className="fa fa-star "></span>
                        <span className="stars_left_text"> 2 & up </span><input type="radio" name="rating" value="2" />
                    </div>
                    <div className="stars_left">
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star "></span>
                        <span className="fa fa-star "></span>
                        <span className="fa fa-star "></span>
                        <span className="fa fa-star "></span>
                        <span className="stars_left_text"> 1 & up </span><input type="radio" name="rating" value="1" />
                    </div>    
                    <h5>Choose a language:</h5>
                    <input type="radio" name="language" value="any" /> 
                    <label id="english">Any language</label><br/>
                    <input type="radio" name="language" value="english" />
                    <label id="english">English</label><br/>
                    <input type="radio" name="language" value="spanish" />
                    <label id="english">Spanish</label><br/>
                    <input type="radio" name="language" value="russian" />
                    <label id="english">Russian</label><br/>
                    <input type="radio" name="language" value="mandarin" />
                    <label id="english">Mandarin</label><br/>
                    <input type="radio" name="language" value="turkish" />
                    <label id="english">Turkish</label><br/>
                    <br/>   
                    <input type="range" id="max" name="max" min="0" max="500" value={max} onChange={function(event){setMax(event.target.value)}}/>
                    <label id="max_price">Max Price:{max}$</label>
                    <br/><input type="submit"  />
                    </form>
                </div>
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