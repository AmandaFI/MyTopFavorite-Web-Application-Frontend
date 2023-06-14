import { useState, createContext } from "react";
import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { simplifiedListType, userType, loginStatus } from "./services/api";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import CreateListArea from "./components/CreateList";
import EditList from "./components/EditList";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Feed from "./components/Feed";
import ManageLists from "./components/ManageLists";
import { UserPublicProfile } from "./components/UserPublicProfile";
import { Box, Stack } from "@mui/material";

export const UserContext = createContext<userType | null>(null);
export const NewListContext = createContext<simplifiedListType | null>(null);

export const App = () => {
  const [loggedUser, setLoggedUser] = useState<userType | null>(null);
  const [signUp, setSignUp] = useState(false);

  React.useEffect(() => {
    loginStatus().then((response) => setLoggedUser(response.data));
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
              <Route path="/user-profile/:id" element={<UserPublicProfile />} />
            </Routes>
          </Stack>
        </Box>
      </UserContext.Provider>
    </>
  );
};
