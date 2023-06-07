import React, { useState } from "react";
import { Admin, Resource } from "react-admin";
import { UserList } from "./users";
import { CourseCreate, CourseEdit, CourseList } from "./Course";
import PostIcon from '@mui/icons-material/Book';
import UserIcon from '@mui/icons-material/Group';
import Dashboard from "./Dashboard";
import "./login.css"; // Import the CSS file

// ... Rest of the code ...
// Dummy JSON data
const dummyLectures = [
  { id: 1, User: 1, title: "Dummy Course 1", body: "Lorem ipsum dolor sit amet" },
  { id: 2, User: 2, title: "Dummy Course 2", body: "Lorem ipsum dolor sit amet" },
];

const dummyUsers = [
  { id: 1, name: "John Doe", username: "johndoe", password: "password1" },
  { id: 2, name: "Jane Smith", username: "janesmith", password: "password2" },
];

const dataProvider = {
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const start = (page - 1) * perPage;
    const end = page * perPage;
    let data = [];

    if (resource === "Lectures") {
      data = dummyLectures.slice(start, end);
      return Promise.resolve({
        data: data,
        total: dummyLectures.length,
      });
    }

    if (resource === "users") {
      data = dummyUsers.slice(start, end);
      return Promise.resolve({
        data: data,
        total: dummyUsers.length,
      });
    }

    return Promise.reject(new Error("Resource not found"));
  },

  getOne: (resource, params) => {
    let item = null;

    if (resource === "Lectures") {
      const id = parseInt(params.id); // Make sure id is a valid integer value
      if (!isNaN(id)) {
        item = dummyLectures.find((c) => c.id === id);
      }
    }

    if (resource === "users") {
      item = dummyUsers.find((u) => u.id === params.id);
    }

    if (item) {
      return Promise.resolve({
        data: { ...item },
      });
    }

    return Promise.reject(new Error("Item not found"));
  },

  getMany: (resource, params) => {
    const { ids } = params;
    let data = [];

    if (resource === "Lectures") {
      data = dummyLectures.filter((course) => ids.includes(course.id));
      return Promise.resolve({ data });
    }

    if (resource === "users") {
      data = dummyUsers.filter((user) => ids.includes(user.id));
      return Promise.resolve({ data });
    }

    return Promise.reject(new Error("Resource not found"));
  },

  create: (resource, params) => {
    if (resource === "users") {
      const newUser = { ...params.data, id: dummyUsers.length + 1 };
      dummyUsers.push(newUser);
      return Promise.resolve({ data: newUser });
    }

    return Promise.reject(new Error("Resource not found"));
  },

  update: (resource, params) => {
    if (resource === "users") {
      const { id, ...updateData } = params.data;
      const userIndex = dummyUsers.findIndex((user) => user.id === id);

      if (userIndex !== -1) {
        dummyUsers[userIndex] = { ...dummyUsers[userIndex], ...updateData };
        return Promise.resolve({ data: dummyUsers[userIndex] });
      }
    }

    return Promise.reject(new Error("Item not found"));
  },

  deleteMany: (resource, params) => {
    if (resource === "users") {
      const { ids } = params;
      const deletedUsers = [];

      ids.forEach((id) => {
        const userIndex = dummyUsers.findIndex((user) => user.id === id);

        if (userIndex !== -1) {
          const deletedUser = dummyUsers.splice(userIndex, 1);
          deletedUsers.push(deletedUser[0]);
        }
      });

      return Promise.resolve({ data: deletedUsers });
    }

    return Promise.reject(new Error("Resource not found"));
  },
};

const LoginPage = ({ onLogin, setLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    // Perform login logic here
    const user = dummyUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // Call the onLogin callback to indicate successful login
      onLogin();
      setLoggedIn(true); // Update the loggedIn state to true
    } else {
      // Handle invalid credentials
      console.log("Invalid username or password");
    }
  };

  return (
    <div className="login-container"> {/* Add the login-container class */}
      <h2>Login Page</h2>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // Update the loggedIn state to true
    setLoggedIn(true);
  };

  const handleLogout = () => {
    // Update the loggedIn state to false
    setLoggedIn(false);
  };

  return (
    <div>
      {loggedIn ? (
        <div className="dashboard">
          <div style={{ position:"absolute", top: "20px", right: "20px" }}>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "blue",
                color: "black",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
            >
              Logout
            </button>
          </div>
          <Admin dashboard={Dashboard} dataProvider={dataProvider}>
            <Resource
              name="Lectures"
              list={CourseList}
              edit={CourseEdit}
              create={CourseCreate}
              icon={PostIcon}
            />
            <Resource name="users" list={UserList} icon={UserIcon} />
          </Admin>
        </div>
      ) : (
        <LoginPage onLogin={handleLogin} setLoggedIn={setLoggedIn} />
      )}
    </div>
  );
};

export default App;
