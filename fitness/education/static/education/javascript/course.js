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
            <iframe width="420" height="345" 
            src={view.video}>
            </iframe>
            </div>   

            <div className="course_overview">
            {/* static */}
                <h1>Course Overviw:</h1>
                <p>{view.overview}</p>

                <div className="creator">
                <p>Created by {view.creator}</p>
                <img src={view.creator_image_url} />
                </div>
            </div>
            <div className="video_description">
                <p>{view.description}</p>
            </div>
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
