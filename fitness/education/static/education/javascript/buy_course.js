// Import the useState hook from React
const { useState } = React;

// Function component Test
function Test() {
    // Declare a state variable 'message' and a function 'setMessage' to update it
    const [message, setMessage] = useState('Hello from REACT!');

    // Function to update the message when a button is clicked
    const updateMessage = () => {
        setMessage('New message from useState!');
    };

    // Render the component
    return (
        <div>
            <p>{message}</p>
            {/* Button to trigger the updateMessage function */}
            <button onClick={updateMessage}>Update Message</button>
        </div>
    );
}

// Select the root element and render the Test component
const root = document.querySelector("#root");
ReactDOM.render(<Test />, root);
