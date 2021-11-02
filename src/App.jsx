import { useState } from "react";
import GoogleLogin from "react-google-login";

function App() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );

  const handleFailure = (result) => {
    alert(result);
  };

  const handleLogin = async (googleData) => {
    // console.log(googleData);
    const response = await fetch("http://localhost:5000/api/google-login", {
      method: "POST",
      body: JSON.stringify({ token: googleData.tokenId }),
      headers: { "Content-Type": "application/json" },
    });
    console.log(response);
    const userData = await response.json();
    setLoginData(userData);
    localStorage.setItem("loginData", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    setLoginData(null);
  };

  return (
    <div className="App">
      <h1>React Google Login App</h1>
      <div>
        {loginData ? (
          <div>
            <h3>You logged in as {loginData.email}</h3>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <GoogleLogin
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            buttonText="Log in with Google"
            onSuccess={handleLogin}
            onFailure={handleFailure}
            cookiePolicy={"single_host_origin"}
          ></GoogleLogin>
        )}
      </div>
    </div>
  );
}

export default App;
