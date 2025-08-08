import React from "react";
import { Link } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";

import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
} from "@mui/material";
import { Fade } from "@mui/material";
import {
  Info as InfoIcon,
  Language as LanguageIcon,
  Login as LoginIcon,
  Favorite as DonateIcon,
  Celebration as EventIcon,
  Translate as TranslateIcon,
  AccountCircle,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";

// import InfoIcon from "@mui/icons-material/Info";
// import LanguageIcon from "@mui/icons-material/Language";
// import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";

import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import TranslateIcon from "@mui/icons-material/Translate";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import authService from "../services/auth";
import { t } from "../utils/translationUtils";

interface DropdownMenu {
  id: string;
  title: string;
  items: {
    label: string;
    path: string;
    onClick?: () => void;
  }[];
}

interface NavbarProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const { i18n } = useTranslation();
  const [isAdminUser, setIsAdminUser] = React.useState(authService.isAdmin());
  const [currentUser, setCurrentUser] = React.useState(
    authService.getCurrentUser()
  );
  console.log({ currentUser });
  console.log({ isAdminUser });

  const [anchorEl, setAnchorEl] = React.useState<{
    [key: string]: HTMLElement | null;
  }>({});
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);
  const [languageMenuAnchor, setLanguageMenuAnchor] =
    React.useState<null | HTMLElement>(null);

  React.useEffect(() => {
    const updateAuthState = () => {
      setIsAuthenticated(authService.isLoggedIn());
      setIsAdminUser(authService.isAdmin());
      setCurrentUser(authService.getCurrentUser());
    };
    updateAuthState();
    window.addEventListener("auth_state_change", updateAuthState);
    return () =>
      window.removeEventListener("auth_state_change", updateAuthState);
  }, [isAuthenticated]);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    menuId: string
  ) => {
    setAnchorEl({
      ...anchorEl,
      [menuId]: event.currentTarget,
    });
  };

  const handleCloseMenu = (menuId: string) => {
    setAnchorEl({
      ...anchorEl,
      [menuId]: null,
    });
  };

  const handleLogout = () => {
    console.log("logout calleds");

    authService.logout(true);
  };

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleLanguageMenuClose();
  };

  const dropdownMenus: DropdownMenu[] = [
    // {
    //   id: "religious",
    //   title: t("temple.religious"),
    //   items: [
    //     { label: t("temple.pujaServices"), path: "/services/puja" },
    //     { label: t("temple.priests"), path: "/priests" },
    //   ],
    // },
    {
      id: "calendar",
      title: t("temple.events"),
      items: [{ label: t("temple.currentEvents"), path: "/events" }],
    },
  ];

  return (
    <>
      {/* Top Contact Bar */}
      <Box sx={{ bgcolor: "#d35400", color: "#f5e6d3", py: 1 }}>
        <Container>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-start" },
                mb: { xs: 1, md: 0 },
              }}
            >
              <Box sx={{ mr: 3, display: "flex", alignItems: "center" }}>
                <Box component="span" sx={{ mr: 1 }}>
                  &#9742;
                </Box>
                +91 836 924 2065
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box component="span" sx={{ mr: 1 }}>
                  &#9993;
                </Box>
                {t("temple.email")}
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            >
              <LanguageSwitcher />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Navigation */}
      <AppBar
        position="sticky"
        sx={{ bgcolor: "#f5e6d3", color: "#4a4a4a" }}
        elevation={1}
      >
        <Container>
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: "none",
                color: "#d35400",
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              {t("temple.name")}
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {dropdownMenus.map((menu) => (
                <Box key={menu.id}>
                  <Button
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={(e) => handleOpenMenu(e, menu.id)}
                    sx={{
                      color: "#4a4a4a",
                      "&:hover": {
                        color: "#d35400",
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    {menu.title}
                  </Button>
                  <Menu
                    anchorEl={anchorEl[menu.id]}
                    open={Boolean(anchorEl[menu.id])}
                    onClose={() => handleCloseMenu(menu.id)}
                    PaperProps={{
                      sx: {
                        bgcolor: "#f5e6d3",
                        "& .MuiMenuItem-root": {
                          color: "#4a4a4a",
                          "&:hover": {
                            bgcolor: "#e0c9a6",
                          },
                        },
                      },
                    }}
                  >
                    {menu.items.map((item) => (
                      <MenuItem
                        key={item.path}
                        component={Link}
                        to={item.path}
                        onClick={() => {
                          handleCloseMenu(menu.id);
                          if (item.onClick) item.onClick();
                        }}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ))}
              <Button
                component={Link}
                to="/donate"
                sx={{
                  color: "#4a4a4a",
                  "&:hover": {
                    color: "#d35400",
                    bgcolor: "transparent",
                  },
                }}
              >
                {t("common.donate")}
              </Button>
              <Button
                component={Link}
                to="/about"
                sx={{
                  color: "#4a4a4a",
                  "&:hover": {
                    color: "#d35400",
                    bgcolor: "transparent",
                  },
                }}
              >
                {t("common.about")}
              </Button>
              {/* Language Button */}
              <Button
                startIcon={<TranslateIcon />}
                onClick={handleLanguageMenuOpen}
                sx={{
                  color: "#4a4a4a",
                  "&:hover": {
                    color: "#d35400",
                    bgcolor: "transparent",
                  },
                }}
              >
                {i18n.language === "mr" ? "मराठी" : "English"}
              </Button>
              <Menu
                anchorEl={languageMenuAnchor}
                open={Boolean(languageMenuAnchor)}
                onClose={handleLanguageMenuClose}
                PaperProps={{
                  sx: {
                    bgcolor: "#f5e6d3",
                    "& .MuiMenuItem-root": {
                      color: "#4a4a4a",
                      "&:hover": {
                        bgcolor: "#e0c9a6",
                      },
                    },
                  },
                }}
              >
                <MenuItem onClick={() => changeLanguage("en")}>
                  English
                </MenuItem>
                <MenuItem onClick={() => changeLanguage("mr")}>मराठी</MenuItem>
              </Menu>

              {/* {isAuthenticated ? (
                <Button
                  endIcon={<KeyboardArrowDownIcon />}
                  onClick={(e) => handleOpenMenu(e, "account")}
                  sx={{
                    color: "#4a4a4a",
                    "&:hover": {
                      color: "#d35400",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  {currentUser?.username}
                </Button>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: "#4a4a4a",
                    "&:hover": {
                      color: "#d35400",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  {t("common.login")}
                </Button>
              )} */}
              {isAuthenticated ? (
                <>
                  <Button
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={(e) => handleOpenMenu(e, "account")}
                    sx={{
                      color: "#4a4a4a",
                      "&:hover": {
                        color: "#d35400",
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    {currentUser?.username}
                  </Button>

                  <Menu
                    anchorEl={anchorEl["account"]}
                    open={Boolean(anchorEl["account"])}
                    onClose={() => handleCloseMenu("account")}
                    PaperProps={{
                      sx: {
                        bgcolor: "#f5e6d3",
                        "& .MuiMenuItem-root": {
                          color: "#4a4a4a",
                          "&:hover": {
                            bgcolor: "#e0c9a6",
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem
                      component={Link}
                      to="/dashboard"
                      onClick={() => handleCloseMenu("account")}
                    >
                      View Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseMenu("account");
                        handleLogout();
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: "#4a4a4a",
                    "&:hover": {
                      color: "#d35400",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  {t("common.login")}
                </Button>
              )}
            </Box>

            {/* Mobile Navigation */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ color: "#4a4a4a" }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Drawer
              anchor="right"
              open={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
              PaperProps={{
                sx: {
                  width: 280,
                  bgcolor: "#f5e6d3",
                  padding: 2,
                },
              }}
            >
              <Box>
                {dropdownMenus.map((menu) => (
                  <Box key={menu.id} sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      {menu.title}
                    </Typography>
                    {menu.items.map((item) => (
                      <MenuItem
                        key={item.path}
                        component={Link}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        sx={{
                          borderRadius: 1,
                          transition: "0.3s",
                          "&:hover": {
                            bgcolor: "#ecdcc8",
                            transform: "translateX(5px)",
                          },
                        }}
                      >
                        <ListItemIcon>
                          <EventIcon
                            fontSize="small"
                            sx={{ color: "#d35400" }}
                          />
                        </ListItemIcon>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <MenuItem
                  component={Link}
                  to="/donate"
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    borderRadius: 1,
                    transition: "0.3s",
                    "&:hover": {
                      bgcolor: "#ecdcc8",
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  <ListItemIcon>
                    <DonateIcon fontSize="small" sx={{ color: "#d35400" }} />
                  </ListItemIcon>
                  {t("common.donate")}
                </MenuItem>

                <MenuItem
                  component={Link}
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    borderRadius: 1,
                    transition: "0.3s",
                    "&:hover": {
                      bgcolor: "#ecdcc8",
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  <ListItemIcon>
                    <InfoIcon fontSize="small" sx={{ color: "#d35400" }} />
                  </ListItemIcon>
                  {t("common.about")}
                </MenuItem>

                <Divider sx={{ my: 2 }} />

                <MenuItem
                  onClick={() => {
                    changeLanguage("en");
                    setMobileMenuOpen(false);
                  }}
                  sx={{
                    borderRadius: 1,
                    transition: "0.3s",
                    "&:hover": {
                      bgcolor: "#ecdcc8",
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  <ListItemIcon>
                    <TranslateIcon fontSize="small" sx={{ color: "#d35400" }} />
                  </ListItemIcon>
                  English
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    changeLanguage("mr");
                    setMobileMenuOpen(false);
                  }}
                  sx={{
                    borderRadius: 1,
                    transition: "0.3s",
                    "&:hover": {
                      bgcolor: "#ecdcc8",
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  <ListItemIcon>
                    <TranslateIcon fontSize="small" sx={{ color: "#d35400" }} />
                  </ListItemIcon>
                  मराठी
                </MenuItem>

                {/* {isAuthenticated ? (
                  <MenuItem
                    onClick={() => setMobileMenuOpen(false)}
                    sx={{
                      borderRadius: 1,
                      transition: "0.3s",
                      "&:hover": {
                        bgcolor: "#ecdcc8",
                        transform: "translateX(5px)",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <AccountCircle
                        fontSize="small"
                        sx={{ color: "#d35400" }}
                      />
                    </ListItemIcon>
                    {currentUser?.username}
                  </MenuItem>
                ) : (
                  <MenuItem
                    component={Link}
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    sx={{
                      borderRadius: 1,
                      transition: "0.3s",
                      "&:hover": {
                        bgcolor: "#ecdcc8",
                        transform: "translateX(5px)",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <LoginIcon fontSize="small" sx={{ color: "#d35400" }} />
                    </ListItemIcon>
                    {t("common.login")}
                  </MenuItem>
                )} */}
                {isAuthenticated ? (
                  <>
                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      sx={{
                        borderRadius: 1,
                        transition: "0.3s",
                        "&:hover": {
                          bgcolor: "#ecdcc8",
                          transform: "translateX(5px)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <AccountCircle
                          fontSize="small"
                          sx={{ color: "#d35400" }}
                        />
                      </ListItemIcon>
                      View Profile
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      sx={{
                        borderRadius: 1,
                        transition: "0.3s",
                        "&:hover": {
                          bgcolor: "#ecdcc8",
                          transform: "translateX(5px)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <LogoutIcon
                          fontSize="small"
                          sx={{ color: "#d35400" }}
                        />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem
                    component={Link}
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    sx={{
                      borderRadius: 1,
                      transition: "0.3s",
                      "&:hover": {
                        bgcolor: "#ecdcc8",
                        transform: "translateX(5px)",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <LoginIcon fontSize="small" sx={{ color: "#d35400" }} />
                    </ListItemIcon>
                    {t("common.login")}
                  </MenuItem>
                )}
              </Box>
            </Drawer>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
