import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
function Login() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading,setLoading]=useState(false);
  
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    setLoading(true)
    e.preventDefault();
    setError("")
    try {
      console.log(email);
      console.log(password);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );
      if(res.data.success){
        console.log("Login Success:", res.data);
        navigate("/home",{ replace: true });
      }
      
    } catch (error) {
      setError("Email or Password Is Incorrect")
      console.log("Login Error:", error.response?.data);
    }
    finally{
      setLoading(false)
    }

  };

  const handleSignup = async (e) => {
    setLoading(true)
    e.preventDefault();
    setError("")
    try {
      console.log(email);
      console.log(password);
      // console.log(name)
      const name = firstName +" "+ lastName;

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/register`,
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      console.log("Signup Success:", res.data);
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setIsLogin(true); // switch to login
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong!");
      }
      console.log("Signup Error:", error.response?.data);
    }
    finally{
      setLoading(false)
    }
  };

  const toggleLogin=()=>{
    setIsLogin(!isLogin)
    setError("")
  }

  // const toggleLogin=()=>{
  //   setIsLogin(true)
  //   setError("")
  // }
  return (
    <div className="mContainer">
      <div className="container">
        {/* LEFT SIDE (STATIC) */}
        <div className="left">
          <img src="Login.jpg" alt="visual" />
        </div>

        {/* RIGHT SIDE (DYNAMIC) */}
        <div className="right">
          <div className="form-box">
            {/* 🔁 TOGGLE BASED ON STATE */}
            {isLogin ? (
              <>
                <h1>Log in</h1>
                <p>
                  Don't have an account?{" "}
                  <span onClick={() => setIsLogin(false)} className="link">
                    Create an Account
                  </span>
                </p>

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              <p>{error}</p>
                <button className="main-btn" onClick={handleLogin} disabled={loading}>
                  {loading ? "Logging In..." : "Log in"}
                  
                </button>
              </>
            ) : (
              <>
                <h1>Create an Account</h1>
                <p>
                  Already have an account?{" "}
                  <span onClick={() => toggleLogin()} className="link">
                    Log in
                  </span>
                </p>

                <div className="name-row">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p>{error}</p>
                <button className="main-btn" onClick={handleSignup} disable={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                  
                </button>
              </>
            )}

            {/* COMMON PART */}

            <div className="divider">or</div>

            <div className="social">
              <button>Continue with Google</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
