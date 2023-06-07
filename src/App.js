import React, { useState } from "react";
import { Admin, Resource } from "react-admin";
import { UserList } from "./users";
import { CourseCreate, CourseEdit, CourseList } from "./Course";
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import Dashboard from "./Dashboard";
import "./login.css";
import { useHistory } from "react-router-dom";
import LoginPage from "./authProvider";
import { createTheme, ThemeProvider, createMuiTheme } from "@mui/material/styles";
import SignupPage from "./signup";

// ... Rest of the code ...
// Dummy JSON data
const dummyLectures = [
  { id: 1, User: 1, title: "Dummy lecture 1", body: "Lorem ipsum dolor sit amet" },
  { id: 2, User: 2, title: "Dummy lecture 2", body: "Lorem ipsum dolor sit amet" },
];

const dummyUsers = [
  { id: 1, name: "John Doe", username: "johndoe", password: "password1" },
  { id: 2, name: "Jane Smith", username: "janesmith", password: "password2" },
];

const resources = [
  {
    name: "Lectures",
    list: CourseList,
    edit: CourseEdit,
    create: CourseCreate,
    icon: PostIcon,
    data: dummyLectures,
  },
  {
    name: "users",
    list: UserList,
    icon: UserIcon,
    data: dummyUsers,
  },
];

const dataProvider = {
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const start = (page - 1) * perPage;
    const end = page * perPage;
    let data = [];

    const resourceConfig = resources.find((r) => r.name === resource);
    if (resourceConfig) {
      data = resourceConfig.data.slice(start, end);
      return Promise.resolve({
        data: data,
        total: resourceConfig.data.length,
      });
    }

    return Promise.reject(new Error("Resource not found"));
  },

  getOne: (resource, params) => {
    let item = null;

    const resourceConfig = resources.find((r) => r.name === resource);
    if (resourceConfig) {
      const id = parseInt(params.id); // Make sure id is a valid integer value
      if (!isNaN(id)) {
        item = resourceConfig.data.find((c) => c.id === id);
      }
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

    const resourceConfig = resources.find((r) => r.name === resource);
    if (resourceConfig) {
      data = resourceConfig.data.filter((item) => ids.includes(item.id));
      return Promise.resolve({ data });
    }

    return Promise.reject(new Error("Resource not found"));
  },

  create: (resource, params) => {
    const resourceConfig = resources.find((r) => r.name === resource);
    if (resourceConfig) {
      const newResource = { ...params.data, id: resourceConfig.data.length + 1 };
      resourceConfig.data.push(newResource);
      return Promise.resolve({ data: newResource });
    }

    return Promise.reject(new Error("Resource not found"));
  },

  update: (resource, params) => {
    const resourceConfig = resources.find((r) => r.name === resource);
    if (resourceConfig) {
      const { id, ...updateData } = params.data;
      const itemIndex = resourceConfig.data.findIndex((item) => item.id === id);

      if (itemIndex !== -1) {
        resourceConfig.data[itemIndex] = { ...resourceConfig.data[itemIndex], ...updateData };
        return Promise.resolve({ data: resourceConfig.data[itemIndex] });
      }
    }

    return Promise.reject(new Error("Item not found"));
  },

  deleteMany: (resource, params) => {
    const resourceConfig = resources.find((r) => r.name === resource);
    if (resourceConfig) {
      const { ids } = params;
      const deletedItems = [];

      ids.forEach((id) => {
        const itemIndex = resourceConfig.data.findIndex((item) => item.id === id);

        if (itemIndex !== -1) {
          const deletedItem = resourceConfig.data.splice(itemIndex, 1);
          deletedItems.push(deletedItem[0]);
        }
      });

      return Promise.resolve({ data: deletedItems });
    }

    return Promise.reject(new Error("Resource not found"));
  },
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = () => {
    // Update the loggedIn state to true
    setLoggedIn(true);
  };

  const handleSignup = () => {
    setShowSignup(false);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <ThemeProvider theme={createMuiTheme()}>
      {/* Add the Material-UI ThemeProvider */}
      <div>
        {!loggedIn && !showSignup && (
          <LoginPage onLogin={handleLogin} onSignup={() => setShowSignup(true)} />
        )}
        {!loggedIn && showSignup && <SignupPage onSignup={handleSignup} onLogin={() => setShowSignup(false)} />}
        {loggedIn && (
          <div className="dashboard">
            <Admin dashboard={(props) => <Dashboard {...props} onLogout={handleLogout} />} dataProvider={dataProvider}>
              {resources.map((resource) => (
                <Resource
                  key={resource.name}
                  name={resource.name}
                  list={resource.list}
                  edit={resource.edit}
                  create={resource.create}
                  icon={resource.icon}
                />
              ))}
            </Admin>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
