import express from 'express';
import { createServer } from 'http';
import { connectDB } from './models.js';
import cors from 'cors';
import multer from 'multer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { asyncHandler } from './functions.js';
import { register, login, auth } from './api/authentication.js';
import { SERVER_HOST, SERVER_PORT } from './config.js';
import { createList, addToList, shareList } from './api/create.js';
import { getLists, getList, getProfileInfo, checkUsername } from './api/read.js';
import { updateList, updateGift, updateUser, updateProfilePic, updateUserPassword, reserveGift } from './api/update.js';
import { deleteList, deleteGift, deleteUser } from './api/delete.js';


const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json(), cors(), express.urlencoded({ extended: true }), express.static(join(__dirname, 'public')));
const server = createServer(app);

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl}`);
    next();
});

(async () => {
		try {
			await connectDB();
			server.listen(SERVER_PORT, SERVER_HOST, () => {console.log(`Server running on http://${SERVER_HOST}:${SERVER_PORT}`)});

		} catch (error) {
			console.log(error.message);
		}
})();

// Authentication routes
app.post('/auth/register', asyncHandler(register));

app.post('/auth/login', asyncHandler(login));

app.get('/auth/me', asyncHandler(auth));

// User routes
app.get('/users/me', asyncHandler(getProfileInfo));

app.patch('/users/me', asyncHandler(updateUser));

app.delete('/users/me', asyncHandler(deleteUser));

app.patch('/users/me/password', asyncHandler(updateUserPassword));

app.patch('/users/me/profile-picture', upload.single('image'), asyncHandler(updateProfilePic));

app.post('/users/check-username', asyncHandler(checkUsername));

// List routes
app.get('/lists', asyncHandler(getLists));

app.post('/lists', asyncHandler(createList));

app.get('/lists/:listId', asyncHandler(getList));

app.patch('/lists/:listId', asyncHandler(updateList));

app.delete('/lists/:listId', asyncHandler(deleteList));

app.post('/lists/:listId/gifts', asyncHandler(addToList));

app.post('/lists/:listId/shares', asyncHandler(shareList));

// Gift routes
app.patch('/gifts/:giftId', asyncHandler(updateGift));

app.delete('/gifts/:giftId', asyncHandler(deleteGift));

app.patch('/gifts/:giftId/reserve', asyncHandler(reserveGift))