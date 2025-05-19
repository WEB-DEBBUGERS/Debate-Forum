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
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(userData?.avatarUrl || null);

  if (!user) return <div>Please log in to view your profile.</div>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new window.FileReader();
      reader.onloadend = () => {
        setAvatarFile(reader.result); // base64 string
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // avatarFile is now a base64 string (or null)
    await updateUserProfile(user.uid, form.firstName, form.lastName, avatarFile);
    const updatedData = await getUserData(user.uid);
    const userData2 = updatedData
      ? updatedData[Object.keys(updatedData)[0]]
      : null;
    setAppState((prev) => ({
      ...prev,
      userData: userData2,
    }));
    setEditMode(false);
    setAvatarFile(null);
  };

  return (
    <>
      <Navbar />
      <div className="register-wrapper profile-bg">
        <div
          className="register-box"
          style={{ maxWidth: 400, margin: "2rem auto" }}
        >
          <h2 className="register-title">Profile</h2>
          {editMode ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
                {avatarPreview && (
                  <img src={avatarPreview} alt="Avatar Preview" style={{ width: 80, height: 80, borderRadius: '50%', marginTop: 8, objectFit: 'cover', boxShadow: '0 0 12px #00e6ff' }} />
                )}
              </div>
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
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                {userData?.avatarUrl && (
                  <img src={userData.avatarUrl} alt="Avatar" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 12px #00e6ff' }} />
                )}
              </div>
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
