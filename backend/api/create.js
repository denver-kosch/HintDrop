import { ApiError } from "../functions.js";
import {User, List, UserList, Gift } from "../models.js";
import { sequelize } from "../models.js";

export const createList = async (req) => {
	const { name, description, is_shareable = false } = req.body;
	const id = req.user.id;
	if (!id) throw new ApiError(401, "Unauthorized");
	const transaction = await sequelize.transaction();
	try {
		const user = await User.findByPk(id);
		if (!user) throw new ApiError(404, "User not found");
		if (!name?.trim()) throw new ApiError(400, "List name is required");
		const shareable = ["true", "1", true, 1].includes(is_shareable);
	
		const list = await List.create({ 
			name: name.trim(), 
			description: description?.trim() || null, 
			is_shareable: shareable, 
			owner_id: id,
		}, { transaction });
		await UserList.create({ user_id: id, list_id: list.id, role: "owner", last_opened_at: new Date() }, { transaction });

		await transaction.commit();
		return {status: 201, content: {listId: list.id}};
	} catch (error) {
		await transaction.rollback();
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};

export const addToList = async (req) => {
	const { name, description, url, price } = req.body;
	const { listId } = req.params;
	const id = req.user.id;

	try {
		if (!id) throw new ApiError(401, "Unauthorized");
		if (!listId) throw new ApiError(400, "No list id provided");
		if (!name?.trim()) throw new ApiError(400, "Gift name is required");

		const userlist = await UserList.findOne({ where: { list_id: listId, user_id: id, archived_at: null }});
		if (!userlist) throw new ApiError(404, "List not found or you do not have access");
		if (userlist.role === "viewer") throw new ApiError(403, "Forbidden");

		const cleanedPrice = (price === "" || price === undefined || price === null) ? null : Number(price);
		if (cleanedPrice !== null && (Number.isNaN(cleanedPrice) || cleanedPrice < 0)) throw new ApiError(400, "Invalid price");
		

		const gift = await Gift.create({
			list_id: listId,
			name: name.trim(),
			description: description?.trim() || null,
			url: url?.trim() || null,
			price: cleanedPrice,
		});

		return {status: 201, content: {giftId: gift.id}};
	} catch (error) {
		throw error instanceof ApiError ? error : new ApiError(500, error.message);
	}
};

export const shareList = async (req) => {
  const { username, role = "viewer" } = req.body;
  const { listId } = req.params;
  const id = req.user.id;

  try {
    if (!id) throw new ApiError(401, "Unauthorized");
    if (!listId) throw new ApiError(400, "No list id provided");
    if (!username?.trim()) throw new ApiError(400, "No username provided");
	if (!["editor", "viewer"].includes(role)) throw new ApiError(400, "Invalid role");


    const targetUser = await User.findOne({ where: { username: username.trim() } });
    if (!targetUser) throw new ApiError(404, "User not found");
    if (targetUser.id === id) throw new ApiError( 400, "You cannot share a list with yourself" );


    const ownerMembership = await UserList.findOne({
      where: { user_id: id, list_id: listId, role: "owner", archived_at: null },
      include: [{ model: List, as: "list" }],
    });
    if (!ownerMembership) throw new ApiError( 403, "Forbidden: You do not own this list" );
    if (!ownerMembership.list.is_shareable) throw new ApiError( 403, "This list is not shareable");


    const existingMembership = await UserList.findOne({ where: { user_id: targetUser.id, list_id: listId },});
    if (existingMembership) {
		if (existingMembership.archived_at) {
			existingMembership.archived_at = null;
			existingMembership.role = role;
			existingMembership.last_opened_at = null;
			await existingMembership.save();
			return { status: 200, content: { shared: { username: targetUser.username } }};
		} else throw new ApiError(409, "User already has access to this list");
	}

    await UserList.create({ user_id: targetUser.id, list_id: listId, role });

    return { status: 201, content: { shared: { username: targetUser.username } }};
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError(500, error.message);
  }
};