const { useState } = React;
const root=document.querySelector("#root");
const courseId=root.dataset.courseid;
// API REQUEST TO GET COURSE INFO

fetch(`/api/get_course/${courseId}`)
.then(response=>{return response.json()})
.then(data=>{
    console.log(data);
    console.log(data["course"]["content"])

    function App(props){
        const [view,setView] = useState({
            creator:props.data["course"]["creator"],
            creator_image_url:props.data["course"]["creator_image_url"],
            name:props.data["course"]["name"],
            overview:props.data["course"]["overview"],
            url_image:props.data["course"]["url_image"],
            // changeable part
            video:`https://www.youtube.com/embed/${props.data.course.content[0].url_youtube}`,
            description:props.data["course"]["content"][0].description
        })
        console.log(view);
        return (
            <div className="course_view">
            <div className="left_side" >
            <div className="video">
            <iframe width="1000" height="500" 
            src={view.video}>
            </iframe>
            </div> 
            <InteractivePart view={view}/> 
            </div>
            
            <div className="content_list">
                {props.data["course"]["content"].map(content=>{
                    return(<div key={content.id} className="content" onClick={function(){setView({...view,description:content.description,video:`https://www.youtube.com/embed/${content.url_youtube}`})}}>
                    <h4>{content.title}</h4>
                    <img alt="content picture" src={content.url_image} />
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
                <RatingSystem/>
            }
        </div>    
        </div>
    )
}

function RatingSystem(){
    const [system,setSystem]=useState({
            rating:4.5,
            ratings:[{username:"student",rate:4,message:"Cool!",date:"2/27/2024",id:1},{username:"profile",rate:5,message:"I like that!",date:"2/27/2024",id:2}],
            rated:false,
    });
    function handleSubmit(event){
        event.preventDefault();
        let new_rating=event.target.rating.value;
        console.log(new_rating);
        console.log(event.target.message.value)
        // API post request
        setSystem({...system,rated:true,})
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
                        <Review key={review.id} username={review.username} date={review.date} message={review.message} rate={review.rate}/>
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