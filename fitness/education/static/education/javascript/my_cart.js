const { useState } = React;
const root=document.querySelector("#root");
fetch("api/get_my_cart_api")
.then(response=>{return (response.json())})
.then(data=>{
    console.log(data)
    ReactDOM.render(<App/>,root);
})
    






function App(props) {
    return(
        <div className="cart_app">
            <h1>Hello from React!</h1>
        </div>
    )
}