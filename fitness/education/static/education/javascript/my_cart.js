const { useState } = React;
const root=document.querySelector("#root");
fetch("api/get_my_cart_api")
.then(response=>{return (response.json())})
.then(data=>{
    // console.log(data)
    ReactDOM.render(<App data={data.cart}/>,root);
})
    






function App(props) {
    // console.log(props.data);
    const [cart,setCart] = useState(props.data);
    // console.log(cart);
    let total=0;
    function delete_from_cart(id){
        fetch("api/get_my_cart_api",{
            method:"PUT",
            body:JSON.stringify({
                course_id:id
            })
        })
        .then(response=>{return(response.json())})
        .then(data=>{
            setCart(data.cart)
        })
        .catch(error=>{console.log(error.message)})
        // console.log(id);
    }
    return(
        <div className="cart_app">
        <div className="course_in_cart" id="cart_top">
            <div id="Courses">Courses</div>
            <div id="Price">Price</div>
        </div>
            {cart.map(course=>{
                total += course.price;
                return(<CourseInCart delete_from_cart={delete_from_cart} key={course.id} data={course} />)
            })
            }
        <div className="course_in_cart" id="Total">
            <div id="Courses">Total</div>
            <div id="Price">{total}$</div>
        </div>
        <button id="Buy" onClick={()=>{window.location.href="/buy_my_cart"}}>Buy</button>
         

        </div>
    )
}



function CourseInCart(props){
    let user_href=`/user/${props.data.creator__username}`;
    function courseReference(){
        window.location.href=`/course/${props.data.id}`;
    }
    return(
        <div className="course_in_cart">
            <div className="course_in_cart_left"><span onClick={courseReference} className="course_in_cart_name">{props.data.name}</span> <span className="course_in_cart_creator">by <a href={user_href}>{props.data.creator__first_name} {props.data.creator__last_name}</a></span></div>
            
            <div className="course_in_cart_right"><span onClick={()=>{props.delete_from_cart(props.data.id)}} className="detete_cart">x</span> {props.data.price}$</div>
        </div>
    )
}