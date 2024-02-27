const { useState } = React;
const root=document.querySelector("#root");
const courseId=root.dataset.courseid;
// API REQUEST TO GET COURSE INFO

fetch(`/api/get_course/${courseId}`)
.then(response=>{return response.json()})
.then(data=>{
    console.log(data);
    console.log(data["course"]["content"])
})
ReactDOM.render(<p>Hey {courseId}</p>,root);