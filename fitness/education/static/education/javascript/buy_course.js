// Import the useState hook from React
const { useState } = React;
const root = document.querySelector("#root");
var is_started=false;
var badScore=0;
function gotAnswer(){
    fetch(`/course/buy/${root.dataset.course}`,{
        method: "POST",
        body: JSON.stringify({answer:true,})
    })
    .then(response => {
        if (response.ok) {
            alert("You got it right!");
            window.location.href = "http://127.0.0.1:8000/"
        }
    })
    .catch(error => {console.log(error.message)})
}
// Function component Test
function Test() {
    // states
    const [message, setMessage] = useState('Since it is a study project. \nYou are required to solve a simple math instead of paying\nAre you ready to give an answer?');
    const [inputText,setInputText] = useState('')
    // functions
    const start = () => {
        is_started=true;
        setMessage('Go ahead!');
    };
    function handleSubmit(event){
        event.preventDefault();
        var usedAnswer=event.target.answer.value;
        console.log(usedAnswer);
        if (usedAnswer==anwser) {
            // alert("You got it right!")
            gotAnswer();

        }
        else {alert("Try one more time!");
        badScore++;
        setMessage(`One more time! Your wrong score: ${badScore}`);}
        
    }

    // MY OWN STATE QUEESTION
    var first_number=Math.floor(Math.random()*10)
    var second_number=Math.floor(Math.random()*10)
    var anwser=first_number + second_number;
    console.log(anwser);
    var question=`${first_number} + ${second_number}`

    // Render the component
    return (
        <div>

            <p>{message}</p>
            {/* Button to trigger the updateMessage function */}
            <button onClick={start}>Yes, I am!</button>
            <h3>Question down below:</h3>
            {is_started&&<div>
            <p>{question}</p>
            <form onSubmit={handleSubmit}>
            <label>Answer: </label>
            <input type="text" name="answer"/>
            <input type="submit" />
            </form>
            
            </div>}

        </div>
    );
}

// Select the root element and render the Test component

ReactDOM.render(<Test />, root);
