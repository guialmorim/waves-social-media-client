import React, { useState, useContext } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/Auth';

const Navbar: React.FC = () => {
	const { user, logout } = useContext(AuthContext);

	const pathname = window.location.pathname;
	const path = pathname === '/' ? 'home' : pathname.substr(1);
	const [activeItem, setActiveItem] = useState(path);

	const handleItemClick = (name: string) => setActiveItem(name);

	const menuBar =
		user && user.token ? (
			<Menu pointing secondary color="violet" size="massive">
				<Menu.Item name={user.username} active as={Link} to="/" />

				<Menu.Menu position="right">
					<Menu.Item name="logout" onClick={logout} />
				</Menu.Menu>
			</Menu>
		) : (
			<Menu pointing secondary color="violet" size="massive">
				<Menu.Item
					name="home"
					active={activeItem === 'home'}
					onClick={() => handleItemClick('home')}
					as={Link}
					to="/"
				/>

				<Menu.Menu position="right">
					<Menu.Item
						name="login"
						active={activeItem === 'login'}
						onClick={() => handleItemClick('login')}
						as={Link}
						to="/login"
					/>
					<Menu.Item
						name="register"
						active={activeItem === 'register'}
						onClick={() => handleItemClick('register')}
						as={Link}
						to="/register"
					/>
				</Menu.Menu>
			</Menu>
		);

	return menuBar;
};

export default Navbar;
