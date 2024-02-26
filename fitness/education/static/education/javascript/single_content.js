const { useState } = React;
const root=document.querySelector("#root");
const contentId=root.dataset.contentid;
console.log(`Content id:${contentId}`);

fetch(`/api/get_single_content/${contentId}`)
.then(response=>{return response.json()})
.then(data=>{
    var content=data["content"];
    var is_teacher=data['is_teacher'];
    // console.log(content.url_youtube);
    var splittedLink=content.url_youtube.split("/");
    var lastPartLink=splittedLink[splittedLink.length-1];
    var creator=data["creator"];
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
        var message = section.comment;
        fetch(`/api/single_content_comment/${contentId}`, {
            method: "POST",
            body: JSON.stringify({ body: message }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok){
                if (response.status===403){window.location.href = "/login";}
            }
            return(response.json())})
        .then(data => {
           var new_list=data['new_list_comments'];
           setSection({
            comments:new_list,
            comment:"",
           })
        })
        .catch(error => {
            console.error('Error submitting comment:', error);
        });
    }
    return (
        
        <div>
            Comments Below:
            <form onSubmit={handleSubmit}>
                <input type="text" name="comment" value={section.comment} onChange={handleChange}/>
                
                <input type="submit" disabled={section.comment.length === 0} />
            </form>
            {section.comments.map(comment => (
    <Comment key={comment.id} idd={comment.id} username={comment.user__username} body={comment.body} date={comment.date} creator={comment.is_creator} />
))}

        </div>
    )
}

function Comment(props){
    const [view,setView] = useState({
        id:props.idd,
        username:props.username,
        date:props.date,
        body:props.body,
        creator:props.creator,
        is_editing:false,
    })
    function handleEdit(event){
        event.preventDefault();
        setView({...view,is_editing:true})
    }
    function handleChange(event){
        const {name,value} = event.target;
        setView({...view,[name]:value});
    }
    function handleSubmit(event){
        event.preventDefault();
        // API REQUEST
        fetch(`/api/single_content_comment/${contentId}`,{
            method:"PUT",
            body: JSON.stringify({
                new_body:view.body,
                comment_id:view.id,
            })
        })
        .then(response=>{response.json()})
        .then(data=>{
            setView({...view,is_editing:false})
        })
        .catch(error=>{
            console.log(error);
        })
        
    }
    return(
        <div className="comment" id={view.idd}>
            {view.is_editing?<div className="editing">
                <form onSubmit={handleSubmit}>
                    <textarea onChange={handleChange} value={view.body} name="body"></textarea>
                    <input type="submit" disabled={view.body.length === 0}/>
                </form>
            </div>
            :
            <div className="static">
            <strong>{view.username}</strong> on <span>{view.date}</span>
            <p>{view.body}</p>
            {view.creator&&<div className="edit"><a href="#" onClick={handleEdit}>edit</a> <a href="#">delete</a></div>}
            </div>}
            
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

