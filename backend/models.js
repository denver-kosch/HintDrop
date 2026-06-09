import { Sequelize, DataTypes } from "sequelize";
import {DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME} from "./config.js";

export const sequelize = new Sequelize(`mysql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {logging: false});
export const connectDB = async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
		await syncDB();
	} catch (error) {
		throw new Error('Unable to connect to the database: ' + error.message);
	}
};

const syncDB = async () => {
	await sequelize.sync({
		alter: false,
		force: false,
	});
	console.log('Database synchronized.');
}

export const closeDB = async () => {
	await sequelize.close();
	console.log('Connection has been closed.');
};

export const User = sequelize.define("User", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	password_hash: {
		type: DataTypes.STRING,
		allowNull: false
	},
	first_name: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	last_name: {
		type: DataTypes.STRING,
		allowNull: true
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true
		}
	},
	phone_num: {
		type: DataTypes.STRING,
		allowNull: true,
		unique: true,
		validate: {
			is: /^\+?[1-9]\d{1,14}$/
		}
	},
	verified: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	admin: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
	notifications_enabled: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true
	},
	has_pfp: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	pfp_version: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0,
		validate: {
			min: 0
		}
	}
	}, {
		timestamps: true,
		underscored: true,
	}
);

export const List = sequelize.define('List', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	is_shareable: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	}, {
		timestamps: true,
		underscored: true,
	}
);

export const Gift = sequelize.define("Gift", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	list_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: List,
			key: 'id'
		}
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	price: {
		type: DataTypes.DECIMAL(10, 2),
		allowNull: true
	},
	url: {
		type: DataTypes.STRING(2048),
		validate: {
			isUrl: true
		},
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 1,
		validate: {
			min: 1
		}
	},
	priority: {
		type: DataTypes.ENUM('low', 'medium', 'high'),
		allowNull: true,
	},
	reserved_by_user_id: {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: {
			model: User,
			key: 'id'
		}
	},
	has_image: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
	image_version: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0,
		validate: {
			min: 0,
		},
	},
	}, {
		timestamps: true,
		underscored: true,
	}
);

export const UserList = sequelize.define('UserList', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: User,
			key: 'id'
		}
	},
	list_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: List,
			key: 'id'
		}
	},
	role: {
		type: DataTypes.ENUM('editor', 'viewer', 'owner'),
		allowNull: false,
		defaultValue: 'viewer'
	},
	last_opened_at: {
		type: DataTypes.DATE,
		allowNull: true
	},
	pinned_at: {
		type: DataTypes.DATE,
		allowNull: true
	},
	archived_at: {
		type: DataTypes.DATE,
		allowNull: true
	}
}, {
	timestamps: true,
	underscored: true,
	tableName: "userlists",
	indexes: [
		{ unique: true, fields: ['user_id', 'list_id'] },
		{ fields: ["user_id", "archived_at", "pinned_at", "last_opened_at"] }
	]
});

export const VerificationToken = sequelize.define('VerificationToken', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: User,
			key: 'id'
		}
	},
	token: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	expires_at: {
		type: DataTypes.DATE,
		allowNull: false
	}
}, {
	timestamps: true,
	underscored: true
});

// Shared lists relationship
User.belongsToMany(List, {
	through: UserList,
	foreignKey: "user_id",
	otherKey: "list_id",
	as: "accessibleLists",
});

List.belongsToMany(User, {
	through: UserList,
	foreignKey: "list_id",
	otherKey: "user_id",
	as: "members",
});

UserList.belongsTo(User, {
	foreignKey: "user_id",
	as: "user",
});

UserList.belongsTo(List, {
	foreignKey: "list_id",
	as: "list",
});

User.hasMany(UserList, {
	foreignKey: "user_id",
});

List.hasMany(UserList, {
	foreignKey: "list_id",
});

List.hasMany(Gift, { foreignKey: "list_id", onDelete: "CASCADE" });
Gift.belongsTo(List, { foreignKey: "list_id" });

User.hasMany(Gift, { foreignKey: "reserved_by_user_id", onDelete: "SET NULL" });
Gift.belongsTo(User, { foreignKey: "reserved_by_user_id", as: "reservedBy" });