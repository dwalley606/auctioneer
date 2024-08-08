import React, { useContext } from "react";
import { useTheme, Box, IconButton, Button } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useProSidebar } from "react-pro-sidebar";
import { ColorModeContext, tokens } from "../../../theme/theme";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../../../redux/user/userSlice";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { toggleSidebar, broken, rtl } = useProSidebar();
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/signout`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      if (res.ok) {
        dispatch(signoutSuccess());
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box display="flex">
        {broken && !rtl && (
          <IconButton onClick={() => toggleSidebar()}>
            <MenuOutlinedIcon />
          </IconButton>
        )}
        <Link to="/">
          <Button variant="contained">Back to Home</Button>
        </Link>
      </Box>
      <Box display="flex">
       
        <Button variant="contained" color="error" onClick={handleSignout}>
          Sign Out
        </Button>
        {broken && rtl && (
          <IconButton onClick={() => toggleSidebar()}>
            <MenuOutlinedIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default Topbar;
