function Footer() {
    const year = new Date().getFullYear();
    return (
      <footer>
        <p>Copyright ⓒ {year}</p>
      </footer>
    );
  }
var condition=true;  

const root=document.querySelector("#root");
// var profile=root.dataset.test;
var profile = JSON.parse(JSON.stringify(root.dataset.test));
// var profile = JSON.parse(root.dataset.user);
console.log(profile);
console.log(profile["test"]); 
// // console.log(profile.headline)

ReactDOM.render(<div>
    <h1>Hello from react!</h1>
    {condition&& <Footer/>}


</div>,root)

function View(){
    return (<div>
    Hey!
    </div>)
}