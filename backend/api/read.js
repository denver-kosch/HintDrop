import { User, List, UserList } from "../models.js";
import { ApiError, makeBackendUrl } from "../functions.js";
import { existsSync } from "fs";
import { Op } from "sequelize";

const flattenMembership = (membership) => {
	const { members, is_shareable, ...listData } = membership.list.toJSON();
	return {
		...listData,
		membership: {
			role: membership.role,
			last_opened_at: membership.last_opened_at,
			pinned_at: membership.pinned_at,
			archived_at: membership.archived_at,
		},
		owner: members[0].username,
	};
};

const SAFE_USER_FIELDS = [ "id", "username", "first_name", "last_name", "email", "phone_num", "verified", "admin", "created_at", "updated_at", "notifications_enabled" ];

export const getLists = async (req) => {
	try {
		const id = req.user.id;

		if (!id) throw new ApiError(401, "Unauthorized");
		
		const lists = {owned: [], shared: []};

		const memberships = await UserList.findAll({
			where: { user_id: id, archived_at: null },
			include: [
				{
					model: List,
					as: "list",
					include: [
						{
							model: User,
							as: "members",
							attributes: ["id", "username"],
							through: {
								attributes: ["role"],
								where: {
									role: "owner",
									archived_at: null,
								},
							},
							required: false,
						},
					],
				},
			],
			order: [
				["pinned_at", "DESC"],
				["last_opened_at", "DESC"],
				[{ model: List, as: "list" }, "updated_at", "DESC"],
			],
		}).then(memberships => memberships.map(flattenMembership));


		memberships.forEach(membership => {
			if (membership.membership.role === "owner") lists.owned.push(membership);
			else lists.shared.push(membership);
		});
		return { status: 200, content: { lists } };
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};

export const getList = async (req) => {
	const { listId } = req.params;
	const id = req.user.id;

	try {
		if (!listId) throw new ApiError(400, "No list id provided");
		if (!id) throw new ApiError(401, "Unauthorized");

		const membership = await UserList.findOne({ 
			where: { user_id: id, list_id: listId, archived_at: null }, 
			include: [{ model: List, as: "list" }]
		});
		if (!membership) throw new ApiError(404, "List not found or access denied");

		await membership.update({ last_opened_at: new Date() });

		const gifts = await membership.list.getGifts({ order: [["created_at", "DESC"]] });

		return { status: 200, content: { list: membership.list, gifts } };
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};

export const getProfileInfo = async (req) => {
	const id = req.user.id;
	
	try {
		if (!id) throw new ApiError(401, "Unauthorized");
		//get user info, as well as the number of owned lists and shared lists
		const requestedFields = req.query.fields?.split(",").filter(Boolean);
		if (requestedFields && requestedFields.some(field => !SAFE_USER_FIELDS.includes(field))) throw new ApiError(400, "Invalid fields requested");
		const user = await User.findByPk(id, { attributes: requestedFields?.length ? requestedFields : SAFE_USER_FIELDS });
		if (!user) throw new ApiError(404, "User not found");

		const ownedListsCount = await UserList.count({where: { user_id: id, archived_at: null, role: "owner" } });
		const sharedListsCount = await UserList.count({where: { user_id: id, archived_at: null, role: { [Op.ne]: "owner" } } });


		const userData = user.toJSON();
		if (!requestedFields || requestedFields.includes("profilePic")) userData.profilePic = existsSync(`./public/images/profilePic/${id}.png`) ? makeBackendUrl(`/images/profilePic/${id}.png`) : makeBackendUrl(`/images/profilePic/placeholder.png`);
		
		return { status: 200, content: { userData, ownedListsCount, sharedListsCount } };
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};

export const getUserDetails = async (req) => {
	const id = req.user.id;
	const fields = req.query.fields?.split(",").filter(Boolean);

	try {
		if (!id) throw new ApiError(401, "Unauthorized");
		if (!fields || !Array.isArray(fields) || fields.some(field => !SAFE_USER_FIELDS.includes(field))) throw new ApiError(400, "Invalid fields requested");
		
		const user = await User.findByPk(id, { attributes: fields });
		if (!user) throw new ApiError(404, "User not found");

		return { status: 200, content: { userData: user } };
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};

export const checkUsername = async (req) => {
	const { username } = req.body;

	try {
		if (!username) throw new ApiError(400, "No username provided");
		if (!/^[a-zA-Z0-9_]+$/.test(username)) throw new ApiError(400, "Invalid username format");
		const user = await User.count({ where: { username } });
		return { status: 200, content: { available: user == 0} };
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};