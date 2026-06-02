import { User, List, UserList } from "../models.js";
import { extractToken } from "./authentication.js";
import { ApiError, makeBackendUrl, handleError } from "../functions.js";
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

const SAFE_USER_FIELDS = [ "id", "username", "first_name", "last_name", "email", "phone_num", "verified", "admin", "created_at", "updated_at" ];

export const getLists = async (req) => {
	try {
		const id = extractToken(req);

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
		console.error(error);
		handleError(error);
	}
};

export const getList = async (req) => {
	const { listId } = req.body;
	const id = extractToken(req);

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

		return { status: 200, list: membership.list, gifts };
	} catch (error) {
		handleError(error);
	}
};

export const getProfileInfo = async (req) => {
	const id = extractToken(req);
	
	try {
		if (!id) throw new ApiError(401, "Unauthorized");
		//get user info, as well as the number of owned lists and shared lists
		const user = await User.findByPk(id, { attributes: SAFE_USER_FIELDS });
		if (!user) throw new ApiError(404, "User not found");

		const ownedListsCount = await UserList.count({where: { user_id: id, archived_at: null, role: "owner" } });
		const sharedListsCount = await UserList.count({where: { user_id: id, archived_at: null, role: { [Op.ne]: "owner" } } });


		const userData = user.toJSON();
		userData.profilePic = existsSync(`./public/images/profilePic/${id}.png`) ? makeBackendUrl(`/images/profilePic/${id}.png`) : makeBackendUrl(`/images/profilePic/placeholder.png`);
		
		return { status: 200, content: { userData, ownedListsCount, sharedListsCount } };
	} catch (error) {
		handleError(error);
	}
};

export const getUserDetails = async (req) => {
	const id = extractToken(req);
	const { fields } = req.body;

	try {
		if (!id) throw new ApiError(401, "Unauthorized");
		if (!fields || !Array.isArray(fields) || fields.some(field => !SAFE_USER_FIELDS.includes(field))) throw new ApiError(400, "Invalid fields requested");
		
		const user = await User.findByPk(id, { attributes: fields });
		if (!user) throw new ApiError(404, "User not found");

		return { status: 200, content: { userData: user } };
	} catch (error) {
		handleError(error);
	}
};