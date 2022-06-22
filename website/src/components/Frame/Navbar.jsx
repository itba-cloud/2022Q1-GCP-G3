import React, {useState} from 'react';
import {useHistory, useLocation} from "react-router-dom";
import {AccountCircle} from "@mui/icons-material";
import {Button, Menu, MenuItem} from "@mui/material";

const Navbar = ({

}) => {

  const history = useHistory();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isActive = path => location.pathname === path ? 'active' : '';

  const toggleUserMenu = (e) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
    setUserMenuOpen(!userMenuOpen);
  }

  const logout = () => {
    localStorage.removeItem('cloud-token');
    history.push('/login');
  }

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">Inicio</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <Button
            id={'user-menu-button'}
            aria-controls={userMenuOpen ? 'user-menu' : undefined}
            aria-haspopup={'true'}
            aria-expanded={userMenuOpen ? 'true' : undefined}
            onClick={toggleUserMenu}
          >
            <AccountCircle/>
          </Button>
          <Menu
            id={'user-menu'}
            open={userMenuOpen}
            anchorEl={anchorEl}
            onClose={() => setUserMenuOpen(false)}
            MenuListProps={{'aria-labelledby': 'user-menu-button'}}
          >
            <MenuItem onClick={logout}>Cerrar sesión</MenuItem>
          </Menu>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;