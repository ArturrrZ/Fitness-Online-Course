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
  const [profile,setProfile] = useState({
    headline:props.headline,
    about: props.about,
  })

  return(
    <div>
      <h1>{profile.headline}</h1>
      <p>{profile.about}</p>
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
//   we've got a USER PAGE!!!
  ReactDOM.render(<div>
  <Subcomponent/>
  <Profile headline={person.headline} about={person.about} />
    <h3>{person.headline}</h3>
    {freeContentArray.map(content=>{return (<h4 key={content.pk}>{content.fields.title}</h4>)})}
    <ul>
        {paidContentArray.map(content=>{
            return (
                
                <li key={content.pk}>
                
                <h3 >{content.fields.title}</h3>
                <p>{content.fields.description}</p></li>    
            )
        })}
    </ul>
</div>,root)

})