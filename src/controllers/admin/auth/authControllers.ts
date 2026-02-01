import login from './login';
import register from './register';
import refreshToken from './refreshToken';
import logout from './logout';

export const handleLogin = login.handleLogin;
export const handleRegister = register.handleRegister;
export const handleRefreshToken = refreshToken.handleRefreshToken;
export const handleLogout = logout.handleLogout;

export default { handleLogin, handleRegister, handleRefreshToken, handleLogout };