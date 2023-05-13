import { useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

// const queryClient = new QueryClient();
// const { createMutation, createQuery } = createQuerysafe(queryClient);

// const createUser = createMutation({
//   mutationFn: async (user: any) => {
//     const response = await fetch("https://reqres.in/api/users", {
//       method: "POST",
//       body: JSON.stringify(user),
//       headers: {
//         "Content-type": "application/json; charset=UTF-8",
//       },
//     });
//     return response.json();
//   },
// });

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
