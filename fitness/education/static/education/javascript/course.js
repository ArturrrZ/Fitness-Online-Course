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
            {part.number===3&&<div>
            <p>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
            </div>}
        </div>    
        </div>
    )
}