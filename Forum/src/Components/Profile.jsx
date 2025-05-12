import { useContext, useState } from "react";
import { AppContext } from "../state/app.context";
import { updateUserProfile, getUserData } from "../services/users.service";
import Navbar from "../NavBar/Navbar";
import "./Register/Register.css";

export default function Profile() {
  const { user, userData, setAppState } = useContext(AppContext);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || user?.email || "",
  });

  if (!user) return <div>Please log in to view your profile.</div>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateUserProfile(user.uid, form.firstName, form.lastName);
    const updatedData = await getUserData(user.uid);
    const userData = updatedData
      ? updatedData[Object.keys(updatedData)[0]]
      : null;
    setAppState((prev) => ({
      ...prev,
      userData: userData,
    }));
    setEditMode(false);
  };

  return (
    <>
      <Navbar />
      <div className="register-wrapper">
        <div
          className="register-box"
          style={{ maxWidth: 400, margin: "2rem auto" }}
        >
          <h2 className="register-title">Profile</h2>
          {editMode ? (
            <>
              <div className="form-group">
                <label>First Name:</label>
                <input
                  className="register-input"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  className="register-input"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <button
                  onClick={handleSave}
                  className="register-btn"
                  style={{ flex: 1 }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#1a6ed8")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "#2d8cff")
                  }
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="register-btn"
                  style={{ flex: 1, background: "#eee", color: "#222" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#ccc")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "#eee")
                  }
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>First Name:</label>
                <div
                  className="register-input"
                  style={{
                    background: "#fff",
                    color: "#222",
                    border: "1px solid #ccc",
                  }}
                >
                  {form.firstName}
                </div>
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <div
                  className="register-input"
                  style={{
                    background: "#fff",
                    color: "#222",
                    border: "1px solid #ccc",
                  }}
                >
                  {form.lastName}
                </div>
              </div>
              <div className="form-group">
                <label>Email:</label>
                <div
                  className="register-input"
                  style={{
                    background: "#fff",
                    color: "#222",
                    border: "1px solid #ccc",
                  }}
                >
                  {form.email}
                </div>
              </div>
              <button
                onClick={() => setEditMode(true)}
                className="register-btn"
                style={{ marginTop: 16 }}
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
