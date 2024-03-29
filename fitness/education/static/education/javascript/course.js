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
            <iframe width="800" height="500" 
            src={view.video}>
            </iframe>
            </div> 
            <InteractivePart view={view} is_creator={props.data.course.is_creator} rating_system={view.rating_system} updateView={function(new_rating_system){setView({...view,rating_system:new_rating_system})}}/> 
            </div>
            
            <div className="content_list">
                {props.data["course"]["content"].map(content=>{
                    return(<div key={content.id} className="content" onClick={function(){setView({...view,description:content.description,video:`https://www.youtube.com/embed/${content.url_youtube}`})}}>
                    
                    <img alt="content picture" src={content.url_image} />
                    <div><h6>{content.title}</h6> <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-youtube" viewBox="0 0 16 16">
  <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"/>
</svg>  tap here</p> </div>
                    </div>)
                })}
            </div>

               
            

            </div>
        )
    }
    








    // document.querySelector("header").style.marginRight="25%";
    document.querySelector("header").setAttribute("id","header_course");
    ReactDOM.render(<div>
        <App data={data}/>
    </div>,root);
})

function InteractivePart(props){
    console.log(props.view);
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
                <h1>Video Description:</h1>            
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
    console.log(props.rating_system.ratings)
    const [system,setSystem]=useState({
            rating:props.rating_system.rating,
            ratings:props.rating_system.ratings,
            rated:props.rating_system.rated,
    });
    function newRating(nrating){
        setSystem({...system,rating:nrating,rated:false})
    }
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
                Current rating: 
                {getStars(system.rating)}{system.rating}
                {system.rating===0&&<p>No rating yet</p>}
            </div>
            {system.rated?<div className="you_rated">You've rated</div>:
            <div className="leave_rating_section">
            <div className="review">Review:</div>
            <form className="rating_form" onSubmit={handleSubmit}>
            <label htmlFor="rating">Rating: </label>
            <input type="number" id="rating" name="rating" min="1" max="5" /><br/>
            <textarea id="message" name="message" placeholder="Type anything"></textarea>
            <input type="submit"/>
            </form>
            </div>}
            <div className="reviews">
            {system.ratings.map(review=>{return (
                        <Review key={review.id} id={review.id} newRating={newRating}username={review.user__username} rated_course={review.rated_course} date={review.date} message={review.message} rate={review.rate}/>
                )})}            </div>
        </div>
    )
}


function Review(props){
    const [edit,setEdit]=useState({
        is_editing:false,
        message:props.message,
    });
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
    function handleSubmit(event){
        event.preventDefault();
        console.log(event.target.message.value);
        fetch(`/api/course_rating/${props.id}`,{
            method:'PUT',
            body:JSON.stringify({
                rating_id:props.id,
                action:"edit",
                message: event.target.message.value,
            })
        })
        .then(response=>{return response.json()})
        .then(data=>{
            console.log(data);
            setEdit({is_editing:false,message:event.target.message.value})
            // let parent=event.target.parentElement.parentElement
            // parent.style.display="none";
        })
        .catch(error=>{console.log(error.message)})
    }
    function handleEdit(event){
        event.preventDefault();
        setEdit({...edit,
            is_editing:true,});

    }
    function handleDelete(event){
        event.preventDefault();
        fetch(`/api/course_rating/${props.id}`,{
            method:'PUT',
            body:JSON.stringify({
                rating_id:props.id,
                action:"delete",
                course_id:courseId,
            })
        })
        .then(response=>{return response.json()})
        .then(data=>{
            console.log(data);
            let parent=event.target.parentElement.parentElement
            parent.style.display="none";
            // 
            props.newRating(data.new_rating);
        })
        .catch(error=>{console.log(error.message)})
    }
    function handleChange(event){
        const {name,value} = event.target;
        setEdit({...edit,[name]:value});
    }
    return(
        <div className="review">
                {edit.is_editing?
                <form onSubmit={handleSubmit} className="edit_comment_form">
                    <textarea value={edit.message} onChange={handleChange} name="message"></textarea><br/>
                    <input type="submit"/>
                </form>:
                <div className="static_rating">
                <div className="comment_pic"> {props.username[0].toUpperCase()}</div>
                <h5>{props.username}</h5>
                {props.rated_course&&<div className="rated_course"><a href="#" onClick={handleEdit}>edit</a> <a href="#" className="delete_comment" onClick={handleDelete}>del</a></div>}
                <div className="stars">{getStars(props.rate)}<div className="review_date">{props.date}</div></div> 
                <p>{edit.message}</p></div>
                }
        </div>
    )
}