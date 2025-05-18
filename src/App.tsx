import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
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
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Theme
import theme from './theme';

// Component imports
import Home from './components/Home';
// These components will need to be converted to TypeScript in the future
import DevoteesList from './components/devotees/DevoteesList';
import EventsList from './components/events/EventsList';
import DonationsList from './components/donations/DonationsList';
import PriestsList from './components/temple/PriestsList';
import PujaServices from './components/temple/PujaServices';
import AboutTemple from './components/temple/AboutTemple';
import MobileOTPAuth from './components/auth/MobileOTPAuth';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { ProtectedRoute, AdminRoute, PublicRoute } from './components/auth/ProtectedRoute';
import ProfileEdit from './components/profile/ProfileEdit';

// Auth service
import authService from './services/auth';

// Navbar dropdown menus - define interface for type safety
interface DropdownMenu {
  id: string;
  title: string;
  items: {
    label: string;
    path: string;
  }[];
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(authService.isLoggedIn());
  const [isAdminUser, setIsAdminUser] = React.useState(authService.isAdmin());
  const [currentUser, setCurrentUser] = React.useState(authService.getCurrentUser());
  
  // State for managing dropdown menus
  const [anchorEl, setAnchorEl] = React.useState<{ [key: string]: HTMLElement | null }>({});
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);

  // Update auth state when the component mounts and when auth state changes
  React.useEffect(() => {
    const updateAuthState = () => {
      setIsAuthenticated(authService.isLoggedIn());
      setIsAdminUser(authService.isAdmin());
      setCurrentUser(authService.getCurrentUser());
    };

    // Initial auth state
    updateAuthState();
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      updateAuthState();
    };
    
    window.addEventListener('auth_state_change', handleAuthChange);
    
    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('auth_state_change', handleAuthChange);
    };
  }, []);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, menuId: string) => {
    setAnchorEl({
      ...anchorEl,
      [menuId]: event.currentTarget
    });
  };

  const handleCloseMenu = (menuId: string) => {
    setAnchorEl({
      ...anchorEl,
      [menuId]: null
    });
  };

  const handleLogout = () => {
    // The logout method will handle redirecting and auth state updates through events
    authService.logout(true);
    
    // These state updates are now handled by the auth change event listener
    // setIsAuthenticated(false);
    // setIsAdminUser(false);
    // setCurrentUser(null);
  };

  // Dropdown menus configuration - matching SSVT
  const dropdownMenus: DropdownMenu[] = [
    {
      id: 'deities',
      title: 'Deities',
      items: [
        { label: 'Lord Vishnu', path: '/deities/vishnu' },
        { label: 'Lord Shiva', path: '/deities/shiva' },
        { label: 'Lord Ganesha', path: '/deities/ganesha' },
        { label: 'Lord Murugan', path: '/deities/murugan' },
        { label: 'All Deities', path: '/deities/all' }
      ]
    },
    {
      id: 'religious',
      title: 'Religious',
      items: [
        { label: 'Puja Schedule', path: '/services/schedule' },
        { label: 'Puja Services', path: '/services/puja' },
        { label: 'Prayer Books', path: '/prayer-books' },
        { label: 'Festivals', path: '/festivals' },
        { label: 'Priests', path: '/priests' }
      ]
    },
    {
      id: 'cultural',
      title: 'Cultural',
      items: [
        { label: 'Media', path: '/media' }
      ]
    },
    {
      id: 'education',
      title: 'Education',
      items: [
        { label: 'Classes', path: '/classes' },
        { label: 'Events', path: '/events' },
        { label: 'Resources', path: '/resources' }
      ]
    },
    {
      id: 'calendar',
      title: 'Calendar',
      items: [
        { label: 'Current Events', path: '/events' },
        { label: 'Newsletter', path: '/newsletter' },
        { label: 'Annual Calendar', path: '/annual-calendar' }
      ]
    },
    {
      id: 'forms',
      title: 'Forms',
      items: [
        { label: 'Puja Sponsorships', path: '/services/puja' },
        { label: 'Request Facility', path: '/facility-request' },
        { label: 'Donation Statement', path: '/donations/statement' },
        { label: 'Change of Address', path: '/address-change' },
        { label: 'Email Subscription', path: '/email-subscription' },
        { label: 'All Other Forms', path: '/forms' }
      ]
    },
    {
      id: 'about',
      title: 'About',
      items: [
        { label: 'Contact', path: '/contact' },
        { label: 'Location', path: '/location' },
        { label: 'Volunteer', path: '/volunteer' },
        { label: 'Virtual Visit', path: '/virtual-visit' },
        { label: 'Feedback', path: '/feedback' },
        { label: 'FAQ', path: '/faq' },
        { label: 'About', path: '/about' }
      ]
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Top Contact Bar */}
          <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 1 }}>
            <Container>
              <Grid container>
                <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, mb: { xs: 1, md: 0 } }}>
                  <Box sx={{ mr: 3, display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ mr: 1 }}>&#9742;</Box>
                    (123) 456-7890
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ mr: 1 }}>&#9993;</Box>
                    info@temple.org
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                  <Button color="inherit" component={Link} to="/donations" sx={{ mr: 2 }}>
                    Recurring Donations
                  </Button>
                  <Button color="inherit" component={Link} to="/services/puja">
                    Puja Sponsorships
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Box>

          {/* Main Navbar */}
          <AppBar position="sticky" color="default" elevation={0} sx={{ bgcolor: 'background.paper' }}>
            <Container>
              <Toolbar disableGutters>
                <Typography
                  variant="h6"
                  component={Link}
                  to="/"
                  sx={{
                    mr: 4,
                    display: { xs: 'none', md: 'flex' },
                    fontWeight: 700,
                    color: 'primary.main',
                    textDecoration: 'none',
                  }}
                >
                  Sri Siva Temple
                </Typography>

                {/* Mobile menu icon */}
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                  <IconButton
                    size="large"
                    aria-label="menu"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    open={mobileMenuOpen}
                    onClose={() => setMobileMenuOpen(false)}
                    sx={{
                      display: { xs: 'block', md: 'none' },
                    }}
                  >
                    <MenuItem component={Link} to="/" onClick={() => setMobileMenuOpen(false)}>
                      Home
                    </MenuItem>
                    {dropdownMenus.map((menu) => (
                      <MenuItem key={menu.id} onClick={() => setMobileMenuOpen(false)}>
                        <Typography textAlign="center">{menu.title}</Typography>
                      </MenuItem>
                    ))}
                    {isAuthenticated ? (
                      <>
                        <MenuItem component={Link} to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          Dashboard
                        </MenuItem>
                        <MenuItem component={Link} to="/profile/edit" onClick={() => setMobileMenuOpen(false)}>
                          My Profile
                        </MenuItem>
                        {isAdminUser && (
                          <MenuItem component={Link} to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
                            Admin Panel
                          </MenuItem>
                        )}
                        <MenuItem onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}>
                          Logout
                        </MenuItem>
                      </>
                    ) : (
                      <>
                        {!isAuthenticated && (
                          <>
                            <MenuItem component={Link} to="/login" onClick={() => setMobileMenuOpen(false)}>
                              Login
                            </MenuItem>
                          </>
                        )}
                      </>
                    )}
                  </Menu>
                </Box>

                {/* Mobile logo */}
                <Typography
                  variant="h6"
                  component={Link}
                  to="/"
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                    flexGrow: 1,
                    fontWeight: 700,
                    color: 'primary.main',
                    textDecoration: 'none',
                  }}
                >
                  Sri Siva Temple
                </Typography>

                {/* Desktop navigation */}
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
                  <Button
                    component={Link}
                    to="/"
                    sx={{ color: 'text.primary', display: 'block', px: 2 }}
                  >
                    Home
                  </Button>

                  {/* Dropdown menus */}
                  {dropdownMenus.map((menu) => (
                    <React.Fragment key={menu.id}>
                      <Button
                        sx={{ color: 'text.primary', display: 'flex', alignItems: 'center', px: 2 }}
                        onClick={(e) => handleOpenMenu(e, menu.id)}
                        endIcon={<KeyboardArrowDownIcon />}
                      >
                        {menu.title}
                      </Button>
                      <Menu
                        id={`menu-${menu.id}`}
                        anchorEl={anchorEl[menu.id]}
                        open={Boolean(anchorEl[menu.id])}
                        onClose={() => handleCloseMenu(menu.id)}
                        MenuListProps={{
                          'aria-labelledby': `button-${menu.id}`,
                        }}
                        sx={{ mt: 1 }}
                      >
                        {menu.items.map((item) => (
                          <MenuItem 
                            key={item.path} 
                            component={Link} 
                            to={item.path}
                            onClick={() => handleCloseMenu(menu.id)}
                            sx={{ minWidth: 180 }}
                          >
                            {item.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </React.Fragment>
                  ))}

                  {/* Direct links */}
                  <Button
                    component={Link}
                    to="/donations"
                    sx={{ color: 'text.primary', display: 'block', px: 2 }}
                  >
                    Recurring-Donation
                  </Button>
                  <Button
                    component={Link}
                    to="/services/puja"
                    sx={{ color: 'text.primary', display: 'block', px: 2 }}
                  >
                    Online-Puja
                  </Button>

                  {/* Auth buttons */}
                  {isAuthenticated ? (
                    <>
                      <Button 
                        color="inherit"
                        endIcon={<KeyboardArrowDownIcon />}
                        onClick={(e) => handleOpenMenu(e, 'account')}
                      >
                        {currentUser?.username || 'Account'}
                      </Button>
                      <Menu
                        id="menu-account"
                        anchorEl={anchorEl['account']}
                        open={Boolean(anchorEl['account'])}
                        onClose={() => handleCloseMenu('account')}
                        MenuListProps={{
                          'aria-labelledby': 'button-account',
                        }}
                        sx={{ mt: 1 }}
                      >
                        <MenuItem component={Link} to="/dashboard" onClick={() => handleCloseMenu('account')}>
                          Dashboard
                        </MenuItem>
                        <MenuItem component={Link} to="/profile/edit" onClick={() => handleCloseMenu('account')}>
                          Edit Profile
                        </MenuItem>
                        {isAdminUser && (
                          <MenuItem component={Link} to="/admin/dashboard" onClick={() => handleCloseMenu('account')}>
                            Admin Panel
                          </MenuItem>
                        )}
                        <MenuItem onClick={() => {
                          handleCloseMenu('account');
                          handleLogout();
                        }}>
                          Logout
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <Button 
                      color="inherit"
                      component={Link}
                      to="/login"
                    >
                      Login
                    </Button>
                  )}
                </Box>
              </Toolbar>
            </Container>
          </AppBar>

          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<MobileOTPAuth />} />
                <Route path="/register" element={<Navigate to="/login" replace />} />
              </Route>
              
              {/* Routes accessible to everyone */}
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventsList />} />
              <Route path="/about" element={<AboutTemple />} />
              <Route path="/priests" element={<PriestsList />} />
              <Route path="/services/puja" element={<PujaServices />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/profile" element={<Navigate to="/profile/edit" replace />} />
                <Route path="/profile/edit" element={<ProfileEdit />} />
                <Route path="/devotees" element={<DevoteesList />} />
                <Route path="/donations" element={<DonationsList />} />
              </Route>
              
              {/* Admin-only Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>
              
              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>

          {/* Footer */}
          <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, mt: 'auto' }}>
            <Container maxWidth="lg">
              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Temple Links
                  </Typography>
                  <Box component="ul" sx={{ p: 0, listStyle: 'none' }}>
                    <Box component="li" sx={{ mb: 1 }}><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link></Box>
                    <Box component="li" sx={{ mb: 1 }}><Link to="/deities" style={{ textDecoration: 'none', color: 'inherit' }}>Deities</Link></Box>
                    <Box component="li" sx={{ mb: 1 }}><Link to="/religious" style={{ textDecoration: 'none', color: 'inherit' }}>Religious</Link></Box>
                    <Box component="li" sx={{ mb: 1 }}><Link to="/cultural" style={{ textDecoration: 'none', color: 'inherit' }}>Cultural</Link></Box>
                    <Box component="li" sx={{ mb: 1 }}><Link to="/education" style={{ textDecoration: 'none', color: 'inherit' }}>Education</Link></Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Services
                  </Typography>
                  <Box component="ul" sx={{ p: 0, listStyle: 'none' }}>
                    <Box component="li" sx={{ mb: 1 }}><Link to="/calendar" style={{ textDecoration: 'none', color: 'inherit' }}>Calendar</Link></Box>
                    <Box component="li" sx={{ mb: 1 }}><Link to="/forms" style={{ textDecoration: 'none', color: 'inherit' }}>Forms</Link></Box>
                    <Box component="li" sx={{ mb: 1 }}><Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About</Link></Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Online Services
                  </Typography>
                  <Box component="ul" sx={{ p: 0, listStyle: 'none' }}>
                    <Box component="li" sx={{ mb: 1 }}><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link></Box>
                    <Box component="li" sx={{ mb: 1 }}><Link to="/deities" style={{ textDecoration: 'none', color: 'inherit' }}>Deities</Link></Box>
                    <Box component="li" sx={{ mb: 1 }}><Link to="/religious" style={{ textDecoration: 'none', color: 'inherit' }}>Religious</Link></Box>
                    <Box component="li" sx={{ mb: 1 }}><Link to="/cultural" style={{ textDecoration: 'none', color: 'inherit' }}>Cultural</Link></Box>
                    <Box component="li" sx={{ mb: 1 }}><Link to="/education" style={{ textDecoration: 'none', color: 'inherit' }}>Education</Link></Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Contact
                  </Typography>
                  <Box component="address" sx={{ fontStyle: 'normal' }}>
                    <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{ mr: 1 }}>&#128205;</Box>
                      123 Temple Street, City, State 12345
                    </Box>
                    <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{ mr: 1 }}>&#9742;</Box>
                      (123) 456-7890
                    </Box>
                    <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{ mr: 1 }}>&#9993;</Box>
                      info@temple.org
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Container>
            <Box sx={{ bgcolor: 'background.default', py: 2 }}>
              <Container>
                <Typography variant="body2" color="text.secondary" align="center">
                  &copy; {new Date().getFullYear()} Sri Siva Temple. All Rights Reserved.
                </Typography>
              </Container>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App; 