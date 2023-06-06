import { useEffect, useState } from "react";
import * as React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import CreateListArea from "./components/CreateList";
import EditList from "./components/EditList";
import { listType, loggedUserType, loginStatus } from "./services/api";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Box, Stack } from "@mui/material";
import Feed from "./components/Feed";
import ManageLists from "./components/ManageLists";
import { createContext, useContext } from "react";

export const UserContext = createContext<loggedUserType | null>(null);
export const NewListContext = createContext<listType | null>(null);

export const App = () => {
  const [loggedUser, setLoggedUser] = useState<loggedUserType | null>(null);
  const [signUp, setSignUp] = useState(false);

  React.useEffect(() => {
    loginStatus().then((r) => setLoggedUser(r.data));
  }, []);

  if (signUp) return <SignUp {...{ setSignUp }} />;
  else if (loggedUser === null) return <SignIn {...{ setLoggedUser, setSignUp }} />;

  return (
    <>
      <UserContext.Provider value={loggedUser}>
        <Box>
          <Navbar {...{ setLoggedUser }} />
          <Stack direction="row" justifyContent={"space-between"}>
            <Sidebar />
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/manage-lists" element={<ManageLists />} />
              <Route path="/create-list/:id" element={<CreateListArea />} />
              <Route path="/edit-list/:id" element={<EditList />} />
            </Routes>
          </Stack>
        </Box>
      </UserContext.Provider>
    </>
  );
};
