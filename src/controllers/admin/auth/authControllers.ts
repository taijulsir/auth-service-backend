export { handleLogin } from './login';
export { handleRegister } from './register';
export { handleRefreshToken } from './refreshToken';
export { handleLogout } from './logout';

// Default export for convenience (optional)
import * as _log from './login';
import * as _reg from './register';
import * as _ref from './refreshToken';
import * as _out from './logout';

export default {
	handleLogin: (_log as any).handleLogin,
	handleRegister: (_reg as any).handleRegister,
	handleRefreshToken: (_ref as any).handleRefreshToken,
	handleLogout: (_out as any).handleLogout,
};