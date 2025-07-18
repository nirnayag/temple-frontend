import React from "react";
import { Link } from "react-router-dom";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TranslateIcon from "@mui/icons-material/Translate";
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

const Navbar: React.FC = () => {
  const { i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    authService.isLoggedIn()
  );

  console.log("isAuthenticated", isAuthenticated);

  const [isAdminUser, setIsAdminUser] = React.useState(authService.isAdmin());
  const [currentUser, setCurrentUser] = React.useState(
    authService.getCurrentUser()
  );
  console.log("isAdminUser", isAdminUser);
  console.log("currentUser", currentUser);

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
  }, []);

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
    {
      id: "religious",
      title: t("temple.religious"),
      items: [
        { label: t("temple.pujaServices"), path: "/services/puja" },
        { label: t("temple.priests"), path: "/priests" },
      ],
    },
    {
      id: "calendar",
      title: t("temple.calendar"),
      items: [{ label: t("temple.currentEvents"), path: "/events" }],
    },
    {
      id: "about",
      title: t("common.about"),
      items: [{ label: t("common.about"), path: "/about" }],
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
                (123) 456-7890
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box component="span" sx={{ mr: 1 }}>
                  &#9993;
                </Box>
                info@temple.org
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

              {isAuthenticated ? (
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
                  {currentUser?.username || t("common.login")}
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
              )}
            </Box>

            {/* Mobile Navigation */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                sx={{ color: "#4a4a4a" }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
