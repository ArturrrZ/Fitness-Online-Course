var freeContentArray=null;
  var paidContentArray=null;
  var person=null;
function getPerson(id){
  
  fetch(`/api/get_person/${id}`,{
    
  })
  .then(response=>{
    return response.json()
  })
  .then(data=>{
    freeContentArray = JSON.parse(data.person.free_content)
    paidContentArray=JSON.parse(data.person.paid_content);
    person=data.person;
    
    // console.log(freeContentArray[0]);
    // const fields=freeContentArray[0]['fields'];
    // console.log(fields.description);
    // console.log(paidContentArray);
  
  })
//  console.log(person); 
}

function Footer() {
    const year = new Date().getFullYear();
    return (
      <footer>
        <p>Copyright ⓒ {year}</p>
      </footer>
    );
  }
  
  function View(){
    return (<div>
    Hey!
    </div>)
}  
var condition=true;  

const root=document.querySelector("#root");
var personId=root.dataset.personid;
console.log(personId);
// make api get request.
getPerson(personId);
console.log(person);
// console.log(freeContentArray);

ReactDOM.render(<div>
    <h1>Hello from react!</h1>
    {condition&& <Footer/>}
    <View/>


</div>,root)

