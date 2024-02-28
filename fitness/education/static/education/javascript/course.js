const { useState } = React;
const root=document.querySelector("#root");
const courseId=root.dataset.courseid;
// API REQUEST TO GET COURSE INFO

fetch(`/api/get_course/${courseId}`)
.then(response=>{return response.json()})
.then(data=>{
    // console.log(data);
    // console.log(data["course"]["content"]);
    // console.log(data["course"]["rating_system"]);

    function App(props){
        var rating_system=data["course"]["rating_system"];
        const [view,setView] = useState({
            creator:props.data["course"]["creator"],
            creator_image_url:props.data["course"]["creator_image_url"],
            name:props.data["course"]["name"],
            overview:props.data["course"]["overview"],
            url_image:props.data["course"]["url_image"],
            // changeable part
            video:`https://www.youtube.com/embed/${props.data.course.content[0].url_youtube}`,
            description:props.data["course"]["content"][0].description,
            rating_system:rating_system,
        })
        // console.log(view);
        return (
            <div className="course_view">
            <div className="left_side" >
            <div className="video">
            <iframe width="1000" height="500" 
            src={view.video}>
            </iframe>
            </div> 
            <InteractivePart view={view} is_creator={props.data.course.is_creator} rating_system={view.rating_system} updateView={function(new_rating_system){setView({...view,rating_system:new_rating_system})}}/> 
            </div>
            
            <div className="content_list">
                {props.data["course"]["content"].map(content=>{
                    return(<div key={content.id} className="content" onClick={function(){setView({...view,description:content.description,video:`https://www.youtube.com/embed/${content.url_youtube}`})}}>
                    <h4>{content.title}</h4>
                    <img alt="content picture" src={content.url_image} style={{width:"200px",height:"150px"}}/>
                    </div>)
                })}
            </div>

               
            

            </div>
        )
    }
    









    ReactDOM.render(<div>
        <App data={data}/>
    </div>,root);
})

function InteractivePart(props){
    const [part,setPart]=useState({number:1});
    return(
        <div className="interactive_part">
        <div className="navigation">
            <span className="navigate" onClick={function(){setPart({number:1})}}>Overviw</span>
            <span className="navigate" onClick={function(){setPart({number:2})}}>Video Desription</span>
            <span className="navigate" onClick={function(){setPart({number:3})}}>Rating</span>
            {props.is_creator&&<span className="navigate" onClick={function(){window.location.href=`/teacher/course/edit/${courseId}`}}>Edit Course</span>}
        </div>
        <div className="changeable">
            {part.number===1&&<div className="course_overview">
                <h1>Course Overviw:</h1>
                <p>{props.view.overview}</p>

                <div className="creator">
                <p>Created by {props.view.creator}</p>
                <img src={props.view.creator_image_url} />
            </div></div>}
            {part.number===2&&<div className="video_description">
                <p>{props.view.description}</p>
            </div>}
            {part.number===3&&
                <RatingSystem rating_system={props.rating_system} updateView={function(new_rating_system){props.updateView(new_rating_system)}}/>
            }
        </div>    
        </div>
    )
}

function RatingSystem(props){
    console.log(props.rating_system);
    const [system,setSystem]=useState({
            rating:props.rating_system.rating,
            ratings:props.rating_system.ratings,
            rated:props.rating_system.rated,
    });
    function handleSubmit(event){
        event.preventDefault();
        let new_rating=event.target.rating.value;
        // console.log(new_rating);
        // console.log(event.target.message.value)
        // API post request
        fetch(`/api/get_course/${courseId}`,{
            method:"POST",
            body:JSON.stringify({
                message:event.target.message.value,
                rate:new_rating,
            })
        })
        .then(response=>{return response.json()})
        .then(data=>{
            setSystem({...system,
            rated:true,
            rating:data['new_rating_system']['rating'],
            ratings:data['new_rating_system']['ratings'],
            })
            props.updateView(data['new_rating_system']);
        })

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
    return (
        <div className="rating_system">
            <div className="current_rating">
                Current rating: {system.rating}
                {getStars(system.rating)}
            </div>
            {system.rated?<div>You've rated</div>:
            <div>
            Review:
            <form onSubmit={handleSubmit}>
            <label htmlFor="rating">Rating: </label>
            <input type="number" id="rating" name="rating" min="0" max="5" /><br/>
            <textarea id="message" name="message" placeholder="Type anything"></textarea>
            <input type="submit"/>
            </form>
            </div>}
            <div className="reviews">
            {system.ratings.map(review=>{return (
                        <Review key={review.id} username={review.user__username} date={review.date} message={review.message} rate={review.rate}/>
                )})}            </div>
        </div>
    )
}


function Review(props){
    function getStars(rate){
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
        <div className="review">
                <h4>{props.username} on {props.date}</h4>
                <p>{props.message}</p>
                <p>Rating: {props.rate}</p>
                {getStars(props.rate)}    

        </div>
    )
}