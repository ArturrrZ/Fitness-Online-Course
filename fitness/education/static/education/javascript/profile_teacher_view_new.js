const { useState } = React;
function Profile(props){
  const [profile,setProfile] = useState({
    headline:props.headline,
    about: props.about,
    picture:props.picture,
    static:true,
    first_name:props.first_name,
    last_name:props.last_name,
    instagram:props.instagram,
    twitter:props.twitter,
    linkedin:props.linkedin,
  })
  function handleInputChange(event){
    const { name, value } = event.target;
    setProfile({
      ...profile,
      [name]: value
    })
  }

  function submitEdit(event){
    // post request
    event.preventDefault();
    let newHeadline=event.target.headline.value;
    let newAbout=event.target.about.value;
    let newPicture=event.target.picture.value;
    console.log(event.target.headline.value);
    // console.log(profile);
    // fetch smth
    fetch(`/api/get_person/${personId}`,{
      method:"PUT",
      body:JSON.stringify({
        // new variables instead of event.target
        new_headline:event.target.headline.value,
        new_about:event.target.about.value,
        new_picture_url:event.target.picture.value,
        new_first_name:event.target.first_name.value,
        new_last_name:event.target.last_name.value,
        new_twitter: event.target.twitter.value,
        new_linkedin:event.target.linkedin.value,
        new_instagram:event.target.instagram.value,
      })
    })
    .then(setProfile({...profile,static:true}))
    
  }

  return(
    
    <div className="teacher_view">
    {/* person info */}
    {props.teacher&&<div>
    {profile.static?
    <div className="static">
    <div className="left_side_profile">
    <div className="instructor">INSTRUCTOR</div>
    <h3 className="full_name">{profile.first_name} {profile.last_name}</h3>
    <h1 className="headline">{profile.headline}</h1>
    <h4 className="about_me">About me</h4>
    <p className="about">{profile.about}</p>

    </div>
    
    <div className="right_side__profile">
    <img className="profile_pic" src={profile.picture} alt="profile picture"/>
    {profile.twitter&&<a href={profile.twitter}><button className="twitter link"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15"/>
</svg>  Twitter</button></a>}
    {profile.linkedin&&<a href={profile.linkedin}><button className="linkedin link"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
</svg>   Linkedin</button></a>}
    {profile.instagram&&<a href={profile.instagram}><button className="instagram link"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
</svg>   Instagram</button></a>}<br/>
    
    <button className="link"onClick={function(){setProfile({...profile,static:false})}}>Edit Teacher Profile</button>
    <button className="link" onClick={function(){window.location.href="/teacher/create_single"}}>Create Single Content</button>  
    <button className="link" onClick={function(){window.location.href="/teacher/create_course"}}>Create Course</button>  

    </div>

      
      
    </div>:
    <div className="edit">
    <h1>Edit View</h1> 
    <img className="profile_pic" src={profile.picture} alt="profile picture" />
    <form action="#" onSubmit={submitEdit}>
      <label>First Name:</label><input type="text" name="first_name" value={profile.first_name} onChange={handleInputChange}/>
      <label>Last Name:</label><input type="text" name="last_name" value={profile.last_name} onChange={handleInputChange}/>
      <label>Twitter:</label><input type="text" name="twitter" value={profile.twitter} onChange={handleInputChange}/>
      <label>Linkedin:</label><input type="text" name="linkedin" value={profile.linkedin} onChange={handleInputChange}/>
      <label>Instagram:</label><input type="text" name="instagram" value={profile.instagram} onChange={handleInputChange}/>
      <label>Profile URL:</label>
      <input type="text" name="picture" value={profile.picture} placeholder="http://example.jpg" onChange={handleInputChange} />
      <br/>
      <label>Headline:</label>
      <input type="text" name="headline" value={profile.headline} placeholder="Sample headline" onChange={handleInputChange}/>
      <br/>
      <label>About:</label>
      <textarea type="text" name="about" value={profile.about} placeholder="Sample of about page" onChange={handleInputChange}></textarea>
      <input type="submit" />
    </form>
    </div>
    
  }</div>}
    {props.student_teacher&&<div>
      <div className="static">
    <div className="left_side_profile">
    <div className="instructor">INSTRUCTOR</div>
    <h3 className="full_name">{profile.first_name} {profile.last_name}</h3>
    <h1 className="headline">{profile.headline}</h1>
    <h4 className="about_me">About me</h4>
    <p className="about">{profile.about}</p>

    </div>
    
    <div className="right_side__profile">
    <img className="profile_pic" src={profile.picture} alt="profile picture"/>
    {profile.twitter&&<a href={profile.twitter}><button className="twitter link"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15"/>
</svg>  Twitter</button></a>}
    {profile.linkedin&&<a href={profile.linkedin}><button className="linkedin link"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
</svg>   Linkedin</button></a>}
    {profile.instagram&&<a href={profile.instagram}><button className="instagram link"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
</svg>   Instagram</button></a>}<br/>

    </div>
      
      
    </div>
    </div>}
      {/* content */}
    <div className="user_content">
    <div className="free_content">
    <div className="head_content">Free Content</div>
    <div className="grid_content">
      {props.freeContentArray.map(content=>{return(
        <div key={content.pk} className="course" onClick={function(){window.location.href=`/single_content/${content.pk}`}}>
                  <img src={content.fields.url_image}/>
                  <div className="course_info">
                  <h5 className="course_name">{content.fields.title}</h5>
                  <div className="course_creator">{profile.first_name} {profile.last_name}</div>
                  <div className="course_bottom"><div className="course_price">FREE</div> <div className="course_custom">{props.teacher?<a href={`/single_content/${content.pk}`} className="custom_edit">edit</a>:<div>{content.fields.category}</div>}</div> </div>
                  </div>
                </div>)})}</div>
                </div>

    <div className="paid_content">
    <div className="head_content">Paid Content</div>
    <div className="grid_content">
    {props.created_courses.map(content=>{return(
      <div key={content.id} className="course" onClick={function(){window.location.href=`/course/${content.id}`}}>
                  <img src={content.url_image}/>
                  <div className="course_info">
                  <h5 className="course_name">{content.name}</h5>
                  <div className="course_creator">{profile.first_name} {profile.last_name}</div>
                  <div className="course_bottom"><div className="course_price">${content.price}</div> <div className="course_custom">{props.teacher?<a href={`/teacher/course/edit/${content.id}`} className="custom_edit">edit</a>:<div>{content.category}</div>}</div> </div>
                  </div>
                </div>
    )})}</div>  </div>  

    </div>
        
    
    </div>
    
  )
}


const root=document.querySelector("#root");
var personId=root.dataset.personid;
fetch(`/api/get_person/${personId}`,{
    
})
.then(response=>{
  return response.json()
})
.then(data=>{
  var freeContentArray = JSON.parse(data.person.free_content)
  var paidContentArray=JSON.parse(data.person.paid_content);
  console.log(freeContentArray);
  console.log(paidContentArray);
  var person=data.person;
  console.log(person);
//   we've got a USER PAGE!!!
  ReactDOM.render(<div>
  {person.student?
  <div className="student_view">
              <div className="person_username">{person.username}</div>
              <div className="courses_enrolled">Courses that <i>{person.username}</i> is enrolled in</div>
              <div className="course_zone">
              {/* courses */}
              <div className="grid_content">
              {person.joined_courses.map(course=>{return (
                
                <div key={course.id} className="course" onClick={function(){window.location.href=`/course/${course.course__id}`}}>
                  <img src={course.course__url_image}/>
                  <div className="course_info">
                  <h5 className="course_name">{course.course__name}</h5>
                  <div className="course_creator">{course.course__creator__username}</div>
                  <div className="course_bottom"><div className="course_price">${course.course__price}</div> <div className="course_custom">since {course.date}</div> </div>
                  </div>
                </div>)})}</div></div>
        </div>
  :
  <Profile freeContentArray={freeContentArray} created_courses={person.created_courses} instagram={person.instagram} teacher={person.teacher} student_teacher={person.student_teacher} linkedin={person.linkedin} twitter={person.twitter} first_name={person.first_name} last_name={person.last_name} headline={person.headline} about={person.about} picture={person.picture} className="dinamicProfile"/>
}  
</div>,root)

})