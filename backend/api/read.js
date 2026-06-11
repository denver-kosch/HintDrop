import { User, List, UserList, Gift } from "../models.js";
import { ApiError, makeBackendUrl } from "../functions.js";
import { Op, fn, col } from "sequelize";

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
		owner: members?.[0]?.username ?? null
	};
};

const SAFE_USER_FIELDS = [ "id", "username", "first_name", "last_name", "email", "phone_num", "verified", "admin", "created_at", "updated_at", "notifications_enabled", "has_pfp", "pfp_version" ];

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
		});

		const flatMemberships = memberships.map(flattenMembership);

		flatMemberships.forEach(membership => {
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
			include: [{ model: List, as: "list" }],
		});

		if (!membership) throw new ApiError(404, "List not found or access denied");
		
		await membership.update({ last_opened_at: new Date() });
		
		const gifts = await membership.list.getGifts({ order: [["created_at", "DESC"]] });

		return { status: 200, content: { list: {...membership.list.dataValues, role: membership.role}, gifts: [...gifts] } };
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

		const counts = (await UserList.findAll({ where: { user_id: id, archived_at: null }, attributes: [ "role", [fn("COUNT", col("id")), "count"]], group: ["role"], raw: true }))
		.reduce((acc, c) => {
				acc[c.role === "owner" ? "owned" : "shared"] += Number(c.count);
				return acc;
		}, { owned: 0, shared: 0 });

		const {has_pfp, pfp_version, ...userData} = user.toJSON();
		if (!requestedFields || requestedFields.includes("profilePic")) userData.profilePic = has_pfp ? makeBackendUrl(`/images/profilePic/${id}.png?v=${pfp_version}`) : makeBackendUrl(`/images/profilePic/placeholder.png`);
		
		return { status: 200, content: { userData, ownedListsCount: counts.owned, sharedListsCount: counts.shared } };
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
		const user = await User.count({ where: { username: username.trim() }});
		return { status: 200, content: { available: user == 0} };
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};

const excludeGiftFields = ['reserved_by_user_id', 'list_id'];

export const getGift = async (req) => {
	const { giftId } = req.params;
	
	try {
		const giftData = await Gift.findByPk(giftId,{include: [{ model: User, as: "reservedBy", attributes: ['username'] }], attributes: {exclude: excludeGiftFields}});
		if (!giftData) throw new ApiError(404, "Gift not found!");
		const gift = giftData.toJSON();
		if (gift.reservedBy) gift.reservedBy = gift.reservedBy.username;
		gift.image_url = gift.has_image ? makeBackendUrl(`/images/gifts/${giftId}.png?v=${gift.image_version}`) : makeBackendUrl(`/images/gifts/placeholder.png`);

		console.log(gift)
		return { status: 200, content: { gift } };
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};