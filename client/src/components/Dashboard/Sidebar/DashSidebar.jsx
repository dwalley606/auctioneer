import { useState, useEffect } from "react";
import { Menu, Sidebar, MenuItem } from "react-pro-sidebar";
import { useProSidebar } from "react-pro-sidebar";
import { useSidebarContext } from "./sidebarContext";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { tokens } from "../../../theme/theme";
import { useTheme, Box, Typography, IconButton } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SwitchRightOutlinedIcon from "@mui/icons-material/SwitchRightOutlined";
import SwitchLeftOutlinedIcon from "@mui/icons-material/SwitchLeftOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { signoutSuccess } from "../../../redux/user/userSlice";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <MenuItem
        active={selected === title}
        style={{ color: colors.grey[100] }}
        onClick={() => setSelected(title)}
        icon={icon}
      >
        <Typography>{title}</Typography>
      </MenuItem>
    </Link>
  );
};

const DashSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const { sidebarRTL, setSidebarRTL, sidebarImage, setSidebarImage } = useSidebarContext();
  const { collapseSidebar, toggleSidebar, collapsed, broken } = useProSidebar();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && currentUser.profilePicture) {
      setSidebarImage(currentUser.profilePicture);
    }
  }, [currentUser, setSidebarImage]);

  const handleSignout = () => {
    dispatch(signoutSuccess());
    navigate("/login");
  };

  return (
    <Box
      sx={{
        position: "sticky",
        display: "flex",
        height: "100vh",
        top: 0,
        bottom: 0,
        zIndex: 10000,
        "& .sidebar": {
          border: "none",
        },
        "& .menu-icon": {
          backgroundColor: "transparent !important",
        },
        "& .menu-item": {
          backgroundColor: "transparent !important",
        },
        "& .menu-anchor": {
          color: "inherit !important",
          backgroundColor: "transparent !important",
        },
        "& .menu-item:hover": {
          color: `${colors.blueAccent[500]} !important`,
          backgroundColor: "transparent !important",
        },
        "& .menu-item.active": {
          color: `${colors.greenAccent[500]} !important`,
          backgroundColor: "transparent !important",
        },
      }}
    >
      <Sidebar
        breakPoint="md"
        rtl={sidebarRTL}
        backgroundColor={colors.primary[400]}
        image={sidebarImage}
      >
        <Menu iconshape="square">
          <MenuItem
            icon={
              collapsed ? (
                <MenuOutlinedIcon onClick={() => collapseSidebar()} />
              ) : sidebarRTL ? (
                <SwitchLeftOutlinedIcon
                  onClick={() => setSidebarRTL(!sidebarRTL)}
                />
              ) : (
                <SwitchRightOutlinedIcon
                  onClick={() => setSidebarRTL(!sidebarRTL)}
                />
              )
            }
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <IconButton
                  onClick={
                    broken ? () => toggleSidebar() : () => collapseSidebar()
                  }
                >
                  <CloseOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {!collapsed && currentUser && (
            <Box mb="25px">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  "& .avatar-image": {
                    backgroundColor: colors.primary[500],
                    width: "80px", // Adjust width
                    height: "80px", // Adjust height
                  },
                }}
              >
                <img
                  className="avatar-image"
                  alt="profile user"
                  src={currentUser.profilePicture || "../../assets/user.png"}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center" mt={2}>
                <Typography
                  variant="h5" // Adjust typography size
                  color={colors.grey[100]}
                  fontWeight="bold"
                >
                  {currentUser.username}
                </Typography>
                <Typography variant="body2" color={colors.grey[100]}>
                  {currentUser.email}
                </Typography>
              </Box>
            </Box>
          )}
          <Box paddingLeft={collapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard?tab=component"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 20px 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Profile"
              to="/dashboard?tab=profile"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Products"
              to="/dashboard?tab=products"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Messages"
              to="/dashboard?tab=messages"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Back to Home"
              to="/"
              icon={<ArrowBackOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <MenuItem
              style={{ color: colors.grey[100] }}
              onClick={handleSignout}
              icon={<LogoutOutlinedIcon />}
            >
              <Typography>Sign Out</Typography>
            </MenuItem>
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default DashSidebar;
