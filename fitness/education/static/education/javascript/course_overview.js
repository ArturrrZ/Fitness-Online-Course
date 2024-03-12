const add=document.querySelector("#add_to_cart");
if (add) {
document.querySelector("#add_to_cart").onclick=function(event){
    
    let courseId=this.dataset.courseid;
    fetch("/api/get_my_cart_api",{
        method:"POST",
        body:JSON.stringify({
            course_id:courseId,
        })
    })
    .then(response=>{location.reload()})
    .catch(error=>{console.log(error.message)})
}}


document.querySelector("#remove_from_cart").onclick=function(event){
    
    let courseId=this.dataset.courseid;
    fetch("/api/get_my_cart_api",{
        method:"PUT",
        body:JSON.stringify({
            course_id:courseId,
        })
    })
    .then(response=>{location.reload()})
    .catch(error=>{console.log(error.message)})
}