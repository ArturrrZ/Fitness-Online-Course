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
    const [data,setData]=useState(props.data)
    // const [courses,setCourses]=useState(data.courses_newest);
    const [max,setMax]=useState(500);
    const [page,setPage]=useState({
        page_index:data.paginator_newest_list[0].page_index,
        has_next:data.paginator_newest_list[0].has_next,
        has_previous:data.paginator_newest_list[0].has_previous,
        courses:data.paginator_newest_list[0].courses,

    })
    console.log(page);
    function submitForm(event){
        event.preventDefault();
        // console.log(event.target.sort.value);
        {event.target.sort.value=="newest"&&setPage(
            {
        page_index:data.paginator_newest_list[0].page_index,
        has_next:data.paginator_newest_list[0].has_next,
        has_previous:data.paginator_newest_list[0].has_previous,
        courses:data.paginator_newest_list[0].courses,
            }
            )};
        {event.target.sort.value=="oldest"&&setPage(
            {
        page_index:data.paginator_oldest_list[0].page_index,
        has_next:data.paginator_oldest_list[0].has_next,
        has_previous:data.paginator_oldest_list[0].has_previous,
        courses:data.paginator_oldest_list[0].courses,
            }
            )};
        {event.target.sort.value=="alphabet"&&setPage(
            {
        page_index:data.paginator_alphabet_list[0].page_index,
        has_next:data.paginator_alphabet_list[0].has_next,
        has_previous:data.paginator_alphabet_list[0].has_previous,
        courses:data.paginator_alphabet_list[0].courses,
            }
            )};
        {event.target.sort.value=="price"&&setPage(
            {
        page_index:data.paginator_price_list[0].page_index,
        has_next:data.paginator_price_list[0].has_next,
        has_previous:data.paginator_price_list[0].has_previous,
        courses:data.paginator_price_list[0].courses,
            }
            )};
        // fetch
    }

    function handleFilter(event){
        event.preventDefault();
        let max_price=parseInt(event.target.max.value);
        console.log(max_price);
        let rating=parseInt(event.target.rating.value);
        console.log(rating);
        let language=event.target.language.value;
        console.log(language);
        fetch(`/api/search/${search}?max_price=${max_price}&rating=${rating}&language=${language}`)
        .then(response=>{return response.json()})
        .then(data=>{
            console.log(data);
            setData(data);
            // setCourses(data.courses_newest);
            setPage({
                page_index:data.paginator_newest_list[0].page_index,
                has_next:data.paginator_newest_list[0].has_next,
                has_previous:data.paginator_newest_list[0].has_previous,
                courses:data.paginator_newest_list[0].courses,
            })
        })
    }
    function previousPage(){
        let previous=page.page_index-1;
        setPage({
        page_index:data.paginator_newest_list[previous].page_index,
        has_next:data.paginator_newest_list[previous].has_next,
        has_previous:data.paginator_newest_list[previous].has_previous,
        courses:data.paginator_newest_list[previous].courses,
        })
    }
    function nextPage(){
        let next=page.page_index+1;
        setPage({
        page_index:data.paginator_newest_list[next].page_index,
        has_next:data.paginator_newest_list[next].has_next,
        has_previous:data.paginator_newest_list[next].has_previous,
        courses:data.paginator_newest_list[next].courses,
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

    return(
        <div className="search_app">
            {/* <h1>{search}</h1> */}
            <h1>{data.found} results for: "{search}"</h1>
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
                    <div className="stars_left">
                        <span className="fa fa-star "></span>
                        <span className="fa fa-star "></span>
                        <span className="fa fa-star "></span>
                        <span className="fa fa-star "></span>
                        <span className="fa fa-star "></span>
                        <span className="stars_left_text"> 0 & up </span><input type="radio" name="rating" value="0" defaultChecked/>
                    </div>    
                    <h5>Choose a language:</h5>
                    <input type="radio" name="language" value="any" defaultChecked /> 
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
                    {page.courses.map(course=>{
                        return(<Course key={course.id} data={course} />)
                    })}
                    <div className="pages_zone">
                        {/* <button disabled={!page.has_previous} onClick={previousPage}>prev</button> */}
                        <span className="prev" style={checkSibl(page.has_previous)} onClick={previousPage}><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
</svg></span>
                        <span className="page_num"> {page.page_index+1} </span>
                        {/* <button disabled={!page.has_next} onClick={nextPage}></button> */}
                        <span className="next" style={checkSibl(page.has_next)} onClick={nextPage}><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
</svg></span>

                    </div>
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
    function getStars(rate){
        rate=Math.floor(rate);
        if (rate===1){
            return (<div>
                <span className="fa fa-star checked"></span>
                <span className="fa fa-star "></span>
                <span className="fa fa-star "></span>
                <span className="fa fa-star "></span>
                <span className="fa fa-star"></span>
    </div>
            )}
        if (rate===2){
            return (<div>
                <span className="fa fa-star checked"></span>
                <span className="fa fa-star checked"></span>
                <span className="fa fa-star "></span>
                <span className="fa fa-star "></span>
                <span className="fa fa-star"></span>
    </div>
            )}
        if (rate===3){
            return (<div>
                <span className="fa fa-star checked"></span>
                <span className="fa fa-star checked"></span>
                <span className="fa fa-star checked"></span>
                <span className="fa fa-star "></span>
                <span className="fa fa-star"></span>
    </div>
            )}
        if (rate===4){
        return (<div>
            <span className="fa fa-star checked"></span>
            <span className="fa fa-star checked"></span>
            <span className="fa fa-star checked"></span>
            <span className="fa fa-star checked"></span>
            <span className="fa fa-star"></span>
</div>
        )}
        if (rate===5){
            return (<div>
                <span className="fa fa-star checked"></span>
                <span className="fa fa-star checked"></span>
                <span className="fa fa-star checked"></span>
                <span className="fa fa-star checked"></span>
                <span className="fa fa-star checked"></span>
    </div>
            )}
    }
    return(
        <div className="search_course">
            <img className="search_anchor" onClick={goToCourse} src={props.data.url_image}/>
            <div className="middle_info">
                <h4 className="search_anchor" onClick={goToCourse}>{props.data.name}</h4>
                <div className="stars">{getStars(props.data.current_rating)}{props.data.current_rating}<span className="rated">({props.data.rated})</span></div>
                <p>{props.data.participants} enrolled</p>
                <p>Created {props.data.date}</p>
                <p className="middle_creator">by <a href={href}>{props.data.creator__first_name} {props.data.creator__last_name}</a></p>
            </div>
            <div className="right_price">{props.data.price}$</div>
        </div>
    )
}