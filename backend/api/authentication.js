import { User } from '../models.js';
import { ApiError } from '../functions.js';
import jwt from 'jsonwebtoken';
import { SECRET } from '../config.js';
import { hash, compare } from 'bcrypt';


export const register = async (req) => {
	try {
		const { username, email, password } = req.body;
		if (username.trim().length < 5) throw new ApiError(400, 'Username must be at least 5 characters');
		if (!username || !password || !email) throw new ApiError(400, 'Username, email, and password required');
		const password_hash = await hash(password, 10);
		const user = await User.create({ username, email, password_hash });
		const token = jwt.sign({ id: user.id }, SECRET);
		return { status: 201, content: {token} };
	} catch (error) {
		throw new ApiError(400, error.message);
	}
};

export const login = async (req) => {
	const { email, password } = req.body;
	if (!email || !password) throw new ApiError(400, 'Email and password required');
	const user = await User.findOne({ where: { email } });
	
	if (user && await compare(password, user.password_hash)) {
		const token = jwt.sign({ id: user.id }, SECRET);
		return {status:200, content: {token}, token};
	} else throw new ApiError(401, 'Invalid email or password');
};

export const requireAuth = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];
		if (!token) throw new ApiError(401, "No token provided");
		
		const decoded = jwt.verify(token, SECRET);
		const user = await User.count({where: {id: decoded.id}});
		if (!user) throw new ApiError(401, "No user found");
		req.user = decoded;

		next();
	} catch {
		next(new ApiError(401, "Invalid token"));
	}
};

export const verifyUser = async (req) => {
	/* 
	This is for verifying a user. The method (email, phone number, etc.) is not determined,
	but this function will flip a "verified" boolean on the user model to true once the user has been verified.
	*/
};