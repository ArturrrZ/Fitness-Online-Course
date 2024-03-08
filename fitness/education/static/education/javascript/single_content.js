const { useState } = React;
const root=document.querySelector("#root");
const contentId=root.dataset.contentid;
console.log(`Content id:${contentId}`);

fetch(`/api/get_single_content/${contentId}`)
.then(response=>{return response.json()})
.then(data=>{
    console.log(data);
    var content=data["content"];
    var is_teacher=data['is_teacher'];
    // console.log(content.url_youtube);
    var splittedLink=content.url_youtube.split("/");
    var lastPartLink=splittedLink[splittedLink.length-1];
    var creator=data["creator"];
    // var mainLink=`https://www.youtube.com/embed/${lastPartLink}`;
    // render
    ReactDOM.render(

    <div className="single_content_view">
    {is_teacher?
    <div>
    <TeacherView content={content} creator={creator}/>
    <CommentSection comments={content.comments}/>  
    </div>
    :
    <div>
    <StudentView content={content} creator={creator}/> 
    <ContentCreator creator={creator} description={content.description}/>
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
    var video_endpoint=props.content.url_youtube.split('=');
    let main_part=video_endpoint[video_endpoint.length-1]
    let final_url="https://www.youtube.com/embed/"+main_part;
    return (<div >
    
    <iframe width="1024" height="600"
    // src={props.content.url_youtube}
    src={final_url}>
</iframe>
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
            
            <form onSubmit={handleSubmit} className="comment_form">
                <input type="text" name="comment" value={section.comment} onChange={handleChange}/>
                <br/>
                <input type="submit" disabled={section.comment.length === 0} />
            </form>
            <div className="comments_below">Comments Below:</div>
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
                action: "edit",
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
    function handleDelete(event){
        event.preventDefault();
        fetch(`/api/single_content_comment/${contentId}`,{
            method:'PUT',
            body:JSON.stringify({
                comment_id:view.id,
                action:"delete"
            })
        })
        .then(response=>{return response.json()})
        .then(data=>{
            console.log(data);
            let parent=event.target.parentElement.parentElement.parentElement
            parent.style.display="none";
        })
        .catch(error=>{console.log(error.message)})
    }
    return(
        <div className="comment" id={view.idd}>
            {view.is_editing?<div className="editing">
                <form onSubmit={handleSubmit} className="edit_comment_form">
                    <textarea onChange={handleChange} value={view.body} name="body"></textarea><br/>
                    <input type="submit" disabled={view.body.length === 0}/>
                </form>
            </div>
            :
            <div className="static_comment">
            <div className="comment_pic"><span className="pic_letter">{view.username[0].toUpperCase()}</span></div>
            <span className="comment_username">{view.username}</span> <span className="comment_date">{view.date} 
            {view.creator&&<span className="edit_comment"><a href="#" onClick={handleEdit}>  edit</a> <a href="#" className="delete_comment" onClick={handleDelete}>del</a></span>}

            </span>
            <p>{view.body}</p>
            </div>}
            
        </div>
    )
}

function TeacherView(props){
    // console.log(props.content.url_youtube);
    var video_endpoint=props.content.url_youtube.split('=');
    let main_part=video_endpoint[video_endpoint.length-1]
    let final_url="https://www.youtube.com/embed/"+main_part;
    // console.log(final_url);
    const [view,setView] = useState({
        title:props.content.title,
        description:props.content.description,
        url_image:props.content.url_image,
        url_youtube:final_url,
        static:true,
    })

    function handleChange(event){
        const {name,value}=event.target;
        setView({...view,[name]:value,})
    }
    function handleSubmit(event){
        event.preventDefault;
        // API to edit content
        let new_youtube=view.url_youtube;
        if (view.url_youtube===final_url){new_youtube=props.content.url_youtube}
        fetch(`/api/get_single_content/${contentId}`,{
            method:"PUT",
            body:JSON.stringify({
                action:"edit_content",
                new_title:view.title,
                new_description:view.description,
                new_url_image:view.url_image,
                new_url_youtube:new_youtube,
            })
        })
        .then(response=>{
            if (!response.ok) {return response.json().then(data=>{alert(data['error'])})}
            return response.json()
        })
        setView({...view,static:true,})

    }

    return (
        <div className="teacher_view">
    {view.static?
    <div className="static_view">
    {/* <p>Your profile</p>    
    <h1>{view.title}</h1>
    <h2>{view.description}</h2> */}
    <iframe width="1024" height="600"
    // src={props.content.url_youtube}
    src={view.url_youtube}>
    </iframe>
    <button className="edit_button" onClick={function(){setView({...view,static:false})}}>Edit Content</button>
    <ContentCreator creator={props.creator} description={view.description}/>

    </div>
:<div className="edit_view">
    <form onSubmit={handleSubmit} className="create_teacher_form">
        <label>Title: </label>
        <input name="title" value={view.title} onChange={handleChange} /><br/>
        <label>Description: </label>
        <input name="description" value={view.description} onChange={handleChange} /><br/>
        <label>Image URL: </label>
        <input name="url_image" value={view.url_image} onChange={handleChange} /><br/>
        <label>Youtube Link(It has to contain 'watch?v='): </label>
        <input name="url_youtube" value={view.url_youtube} onChange={handleChange} /><br/>
        <input type="submit"/>
    </form>
</div>}

        
    </div>
    )
}



function ContentCreator (props){
    
    return (
        <div className="content_creator">
            <div className="content_left_side">
            
            <img src={props.creator.picture_url} className="content_creator_img" />
            <div className="content_name">{props.creator.first_name} {props.creator.last_name}</div>
            
            </div>
            <div className="content_headline">
            <p>Description:</p>
            {props.description}</div> 
        </div>
    )
}