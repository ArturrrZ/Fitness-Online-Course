const { useState } = React;
const root=document.querySelector("#root");

fetch("/api/get_index")
.then(response=>{return (response.json())})
.then(data=>{console.log(data)})

ReactDOM.render(<h1>Hello!</h1>,root);
