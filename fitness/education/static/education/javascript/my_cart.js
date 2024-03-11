const { useState } = React;
const root=document.querySelector("#root");
fetch("api/get_my_cart_api")
.then(response=>{return (response.json())})
.then(data=>{
    // console.log(data)
    ReactDOM.render(<App data={data.cart}/>,root);
})
    






function App(props) {
    console.log(props.data);
    let total=0;
    return(
        <div className="cart_app">
        <div className="course_in_cart" id="cart_top">
            <div id="Courses">Courses</div>
            <div id="Price">Price</div>
        </div>
            {props.data.map(course=>{
                total += course.price;
                return(<CourseInCart key={course.id} data={course} />)
            })
            }
        <div className="course_in_cart" id="Total">
            <div id="Courses">Total</div>
            <div id="Price">{total}$</div>
        </div>
        <button id="Buy">Buy</button>
         

        </div>
    )
}



function CourseInCart(props){
    let user_href=`/user/${props.data.creator__username}`;
    return(
        <div className="course_in_cart">
            <div className="course_in_cart_left"><span className="course_in_cart_name">{props.data.name}</span> <span className="course_in_cart_creator">by <a href={user_href}>{props.data.creator__first_name} {props.data.creator__last_name}</a></span></div>
            <div className="course_in_cart_right">{props.data.price}$</div>
        </div>
    )
}