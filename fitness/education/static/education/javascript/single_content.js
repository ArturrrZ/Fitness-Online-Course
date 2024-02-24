
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
    <CommentSection/>  
    </div>
    :
    <div>
    <StudentView content={content} creator={creator}/> 
    <CommentSection/>  
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


function CommentSection(){
    return (
        <div>
            Comments Below:
            <form action="#">
                <input type="text" name="comment"/>
                <input type="submit" />
            </form>
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