import bcrypt from "bcrypt";
import { User, List, Gift, UserList } from "../models.js";
import { extractToken } from "./authentication.js";
import { ApiError } from "../functions.js";
import sharp from "sharp";
import { join } from "path";

const ALLOWED_UPDATED_USER_FIELDS = ["username", "email", "first_name", "last_name", "phone_num", "notifications_enabled"];

const parseBoolean = (value) => {
	if ([true, "true", 1, "1"].includes(value)) return true;
	if ([false, "false", 0, "0"].includes(value)) return false;
	throw new ApiError(400, "Invalid isShareable value");
};

export const updateUser = async (req) => {
	const keys = Object.keys(req.body);
	const id = extractToken(req);
	
	try {
		if (!id) throw new ApiError(401, "Unauthorized");
		if (!keys.length) throw new ApiError(400, "No fields to update");
		const invalidKeys = keys.filter(key => !ALLOWED_UPDATED_USER_FIELDS.includes(key));
		if (invalidKeys.length) throw new ApiError(400, `Invalid fields: ${invalidKeys.join(", ")}`);

		const user = await User.findByPk(id);
		if (!user) throw new ApiError(404, "User not found");

		for (const key of keys) {
			const value = req.body[key];

			if (key === "notifications_enabled") {
				user.notifications_enabled = parseBoolean(value);
				continue;
			}

			if (typeof value !== "string") throw new ApiError(400, `${key} must be a string`);
			const trimmed = value.trim();

			if (!trimmed) {
				if (["username", "email"].includes(key)) throw new ApiError(400, `${key} cannot be empty`);
				else user[key] = null;
			} 
			else user[key] = trimmed;
		}

		await user.save();

		const newUserContent = {};

		for (const key of keys) newUserContent[key] = user[key];
		

		return {status: 200, content: { user: newUserContent  } };
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};

export const updateList = async (req) => {
	const { name, description, isShareable } = req.body;
	const { listId } = req.params;
	const id = extractToken(req);

	try {
		if (!id) throw new ApiError(401, "Unauthorized");
		if (!listId) throw new ApiError(400, "No list id provided");

		const membership = await UserList.findOne ({ where: { user_id: id, list_id: listId, role: "owner", archived_at: null}, include: { model: List, as: "list" } })
		if (!membership) throw new ApiError(404, "List not found or you do not have permission to edit this list");

		const list = membership.list;
		const trimmed = name?.trim();
		if (name && !trimmed) throw new ApiError(400, "Name cannot be empty");
		else if (name) list.name = trimmed;

		if (description) list.description = description.trim();

		if (![null, undefined].includes(isShareable)) list.is_shareable = parseBoolean(isShareable);

		await list.save();

		return {status: 200};
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};

export const updateGift = async (req) => {
	const { name, description, url, price } = req.body;
	const { giftId } = req.params;
	const id = extractToken(req);

	try {
		if (!id) throw new ApiError(401, "Unauthorized");

		const gift = await Gift.findByPk(giftId);
		if (!gift) throw new ApiError(404, "Gift not found");

		const trimmed = name?.trim();
		if (name && !trimmed) throw new ApiError(400, "Name cannot be empty");
		else if (name) gift.name = name;

		if (description) gift.description = description.trim();
		if (url) gift.url = url.trim();
		if (price) {
			const parsedPrice = parseFloat(price);
			if (isNaN(parsedPrice) || parsedPrice < 0) throw new ApiError(400, "Invalid price");
			gift.price = parsedPrice;
		}

		await gift.save();

		return {status: 200};
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};

export const updateProfilePic = async (req) => {
	const id = extractToken(req);
	const image = req.file?.buffer.toString("base64") || req.body.image;

	try {
		if (!id) throw new ApiError(401, "Unauthorized");
		const user = await User.findByPk(id);
		if (!user) throw new ApiError(404, "User not found");

		if (!image) throw new ApiError(400, "No image provided");
		const imageBuffer = Buffer.from(image, 'base64');
		if (!imageBuffer || !imageBuffer.length) throw new ApiError(400, "Invalid image data");
		
		const imagePath = join(process.cwd(), 'public', 'images', 'profilePic', `${id}.png`);
		await sharp(imageBuffer)
			.trim()
			.resize(200, 200)
			.composite([{
				input: Buffer.from(
					`<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
						<circle cx="100" cy="100" r="100" fill="white"/>
					</svg>`
				),
				blend: 'dest-in'
			}])
			.png()
			.toFile(imagePath);

		return { status: 200 };
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};

export const updateUserPassword = async (req) => {
	const { currentPassword, newPassword } = req.body;
	const id = extractToken(req);
	
	try {
		if (!id) throw new ApiError(401, "Unauthorized");
		const user = await User.findByPk(id);
		if (!user) throw new ApiError(404, "User not found");

		const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
		if (!isMatch) throw new ApiError(403, "Current password is incorrect");

		user.password_hash = await bcrypt.hash(newPassword, 10);
		await user.save();

		return { status: 200 };
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};

export const reserveGift = async (re) => {
	const { giftId } = req.body;
	const id = extractToken(req);

	try {
		if (!id) throw new ApiError(401, "Unauthorized");

		const gift = await Gift.findByPk(id);
		if (!gift) throw new ApiError(404, "Gift not found");
		gift.reserved_by_user_id
		
		return { status: 200}
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};