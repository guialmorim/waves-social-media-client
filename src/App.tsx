import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SinglePost from './pages/SinglePost';
import Navbar from './components/Navbar';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './context/Auth';

import 'semantic-ui-css/semantic.min.css';

const App: React.FC = () => {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Container>
					<Navbar />
					<Route exact path="/" component={Home} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
					<PrivateRoute exact path="/posts/:postId" component={SinglePost} />
				</Container>
			</BrowserRouter>
		</AuthProvider>
	);
};

export default App;
