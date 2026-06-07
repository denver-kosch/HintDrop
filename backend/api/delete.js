import { ApiError } from "../functions.js";
import { User, List, Gift, UserList } from "../models.js";

export const deleteList = async (req) => {
	const { listId } = req.params;
	const id = req.user.id;

	try {
		if (!listId) throw new ApiError(400, "No list id provided");
		if (!id) throw new ApiError(401, "Unauthorized");

		const user = await User.findByPk(id);
		if (!user) throw new ApiError(404, "User not found with provided id");

		const membership = await UserList.findOne({ where: { user_id: id, list_id: listId, role: "owner", archived_at: null } });
		if (!membership) throw new ApiError(403, "Forbidden: You do not own this list");

		const list = await List.findByPk(listId);
		if (!list) throw new ApiError(404, "List not found with provided id");

		await list.destroy();

		return { status: 200, content: { message: "List deleted successfully" } };
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};

export const deleteGift = async (req) => {
	const { giftId } = req.params;
	const id = req.user.id;

	try {
		if (!giftId) throw new ApiError(400, "No gift id provided");
		if (!id) throw new ApiError(401, "Unauthorized");

		const user = await User.findByPk(id);
		if (!user) throw new ApiError(404, "User not found with provided id");

		const gift = await Gift.findByPk(giftId);
		if (!gift) throw new ApiError(404, "Gift not found with provided id");

		const membership = await UserList.findOne({ where: { user_id: id, list_id: gift.list_id, archived_at: null } });
		if (!membership || membership.role === "viewer") throw new ApiError(403, "Forbidden");

		await gift.destroy();

		return { status: 200, content: { message: "Gift deleted successfully" } };
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};

export const deleteUser = async (req) => {
	const id = req.user.id;

	try {
		if (!id) throw new ApiError(401, "Unauthorized");

		const user = await User.findByPk(id);
		if (!user) throw new ApiError(404, "User not found with provided id");

		await user.destroy();

		return { status: 200, content: { message: "User deleted successfully" } };
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};
