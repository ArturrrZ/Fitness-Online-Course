const { useState } = React;
const root=document.querySelector("#root");
const courseId=root.dataset.courseid;
// API REQUEST TO GET COURSE INFO

fetch(`/api/get_course/${courseId}`)
.then(response=>{return response.json()})
.then(data=>{
    console.log(data);
    console.log(data["course"]["content"])

    function App(props){
        const [view,setView] = useState({
            creator:props.data["course"]["creator"],
            creator_image_url:props.data["course"]["creator_image_url"],
            name:props.data["course"]["name"],
            overview:props.data["course"]["overview"],
            url_image:props.data["course"]["url_image"],
            // changeable part
            video:props.data["course"]["content"][0].url_youtube,
            description:props.data["course"]["content"][0].description
        })
        console.log(view);
        return (<p>{props.data["course"]["name"]}s</p>)
    }
    









    ReactDOM.render(<div>
        <App data={data}/>
    </div>,root);
})
