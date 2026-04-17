import{useState} from "react";

import { useNavigate} from "react-router-dom";
import "./Account.css";
import axios from "axios";
const Account = ({ onClose,user }) => {
  const navigate = useNavigate();
  const [loading,setLoading]=useState(false)
  const logout=async ()=>{
    setLoading(true)
    try {
      const res=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/logout`,{withCredentials:true})
      if(res.data.success){
        navigate("/",{ replace: true });
      }
    } catch (error) {
      console.log(error.message)
    }
    setLoading(false)
  }
  
  return (
    <div className="account-overlay" onClick={onClose}>
      
      <div
        className="account-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="account-card">

          {/* ❌ CLOSE BUTTON */}
          

          {/* Header */}
          <div className="account-header">
            <div className="close-bt" onClick={onClose}>×</div>
            <div className="avatar">JD</div>
            <h2>Account Information</h2>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="label">Full Name</label>
            <input
              type="text"
              value={user.name}
              className="input"
              readOnly
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="label">Email Address</label>
            <input
              type="text"
              value={user.email}
              className="input"
              readOnly
            />
          </div>

          {/* Divider */}
          <div className="divider"></div>

          {/* Logout Button */}
          <button className="logout-btn" onClick={logout} disabled={loading}>
  {loading ? "Logging out..." : "⎋ Logout"}
</button>

        </div>
      </div>
    </div>
  );
};

export default Account;