const { useState } = React;
function Subcomponent(){
    const [num,setNum] = useState(0);
    function increase() {
        setNum((prevNum) => prevNum + 1);
      }    return (<div>
    {num}
    <button onClick={increase}>increase</button>
    </div>)
}

function Profile(props){
  // var pictureUrl=props.picture_url;
  // if (person.picture_url == null) {
  //   pictureUrl="https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg"
  // }
  const [profile,setProfile] = useState({
    headline:props.headline,
    about: props.about,
    picture:props.picture,
    static:true,
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

    console.log(event.target.headline.value);
    // console.log(profile);
    // fetch smth
    fetch(`/api/get_person/${personId}`,{
      method:"PUT",
      body:JSON.stringify({
        new_headline:event.target.headline.value,
        new_about:event.target.about.value,
        new_picture_url:event.target.picture,
      })
    })
    .then(setProfile({...profile,static:true}))
    
  }
  
  // console.log(pictureUrl);
  return(
    <div>
    {profile.static?
    <div>
    <h1>{profile.headline}</h1>
    <button onClick={function(){setProfile({...profile,static:false})}}>Edit Teacher Profile</button>
      
      <p>{profile.about}</p>
      <img src={profile.picture}/>
      
    </div>:
    <div>
    <h1>Edit View</h1>
    {/* <button onClick={function(){setProfile({...profile,static:true})}}>Submit</button> */}
    <img src={profile.picture}/>
    <form action="#" onSubmit={submitEdit}>
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
    
  }
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
  var person=data.person;
  console.log(person);
//   we've got a USER PAGE!!!
  ReactDOM.render(<div>
  <Subcomponent/>
  <Profile headline={person.headline} about={person.about} picture="https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?size=338&ext=jpg&ga=GA1.1.1700460183.1708387200&semt=ais"/>
    {/* <h3>{person.headline}</h3>
    {freeContentArray.map(content=>{return (<h4 key={content.pk}>{content.fields.title}</h4>)})}
    <ul>
        {paidContentArray.map(content=>{
            return (
                
                <li key={content.pk}>
                
                <h3 >{content.fields.title}</h3>
                <p>{content.fields.description}</p>
                </li>    
            )
        })}
    </ul> */}
</div>,root)

})