const { useState } = React;
const root=document.querySelector("#root");
var contentId=root.dataset.contentid;
console.log(`Content id:${contentId}`);

fetch(`/api/get_single_content/${contentId}`)
.then(response=>{return response.json()})
.then(data=>{
    var content=data["content"];
    var is_teacher=data['is_teacher'];
    console.log(content.url_youtube);
    var splittedLink=content.url_youtube.split("/");
    var lastPartLink=splittedLink[splittedLink.length-1];
    var creator=data["creator"];
    console.log(content.comments[0]);
    // var mainLink=`https://www.youtube.com/embed/${lastPartLink}`;
    // render
    ReactDOM.render(

    <div>
    {is_teacher?
    <div>
    <TeacherView content={content}/>
    <CommentSection comments={content.comments}/>  
    </div>
    :
    <div>
    <StudentView content={content} creator={creator}/> 
    <CommentSection comments={content.comments}/>  
    </div>
    }
    </div>,root);




})
.catch(error => {
    console.error("Error fetching content:", error);
  });


// --------------------------React Components----------------------------------------------------------------

function StudentView(props){
    return (<div>
    <h1>{props.content.title}</h1>
    <h2>{props.content.description}</h2>
    <iframe width="420" height="315"
    // src={props.content.url_youtube}
    src="https://www.youtube.com/embed/tgbNymZ7vqY">
</iframe>
<p>Created by {props.creator.username}</p>
<img src={props.creator.picture_url} height="200px" />

    </div>)
}


function CommentSection(props){
    const [section,setSection] = useState({
        comments: props.comments,
        // new one below
        comment:"",
    });
    function handleChange(event){
        const {name,value}=event.target;
        setSection({...section,[name]:value});
    }
    
    function handleSubmit(event) {
        event.preventDefault();
        const date = new Date();
        const newComment = {
            body: section.comment,
            date: date,
            user__username: "new_user",
            id: 2,
        };
    
        setSection(prevState => {
            return {
                ...prevState,
                comments: [...prevState.comments, newComment],
                comment: "", // Clear the input after submitting
            };
        });
    }
    return (
        
        <div>
            Comments Below:
            <form onSubmit={handleSubmit}>
                <input type="text" name="comment" value={section.comment} onChange={handleChange}/>
                <input type="submit" />
            </form>
            {section.comments.map(comment=>{return (<Comment key={comment.id} username={comment.user__username} body={comment.body} date={comment.date}/>)})}
        </div>
    )
}

function Comment(props){
    return(
        <div className="comment">
            <strong>{props.username}</strong> on <span>{props.date.toString()}</span>
            <p>{props.body}</p>
        </div>
    )
}

function TeacherView(props){
    return (
        <div>
            <h1>{props.content.title}</h1>
        </div>
    )
}

