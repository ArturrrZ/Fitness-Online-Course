const { useState } = React;

// Функциональный компонент App
function App() {
    // Создаем состояние (state) с помощью хука useState
    const [count, setCount] = useState(0);

    // Обработчик клика, который увеличивает значение состояния на 1
    const handleIncrement = () => {
        setCount(count + 1);
    };

    // Обработчик клика, который уменьшает значение состояния на 1
    const handleDecrement = () => {
        setCount(count - 1);
    };

    return (
        <div>
            <h1>Hello from REACT!</h1>
            <h1>User Data:</h1>
            <p>Username: {userData.name}</p>
            <p>Email: {userData.id}</p>

            {/* Отображаем текущее значение состояния */}
            <p>Count: {count}</p>

            {/* Кнопки для увеличения и уменьшения значения состояния */}
            <button onClick={handleIncrement}>Increment</button>
            <button onClick={handleDecrement}>Decrement</button>
        </div>
    );
}

// Рендеринг компонента в элемент с id="root"
ReactDOM.render(<App />, document.getElementById('roott'));