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
import { createList, addToList } from './api/create.js';
import { getLists, getList, getProfileInfo, getUserDetails, checkUsername } from './api/read.js';
import { updateList, updateGift, updateUser, updateProfilePic, updateUserPassword } from './api/update.js';
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
app.post('/register', asyncHandler(register));

app.post('/login', asyncHandler(login));

app.post('/auth', asyncHandler(auth));

// Create routes
app.post('/createList', asyncHandler(createList));

app.post('/addToList', asyncHandler(addToList));

// Read routes
app.post('/getLists', asyncHandler(getLists));

app.post('/getList', asyncHandler(getList));

app.post('/getProfileInfo', asyncHandler(getProfileInfo));

app.post('/getUser', asyncHandler(getUserDetails));

app.post('/checkUsername', asyncHandler(checkUsername));

// Update routes
app.post('/updateList', asyncHandler(updateList));

app.post('/updateGift', asyncHandler(updateGift));

app.post('/updateUser', asyncHandler(updateUser));

app.post('/updateProfilePic', upload.single('image'), asyncHandler(updateProfilePic));

app.post('/updateUserPassword', asyncHandler(updateUserPassword));

// Delete routes
app.post('/deleteList', asyncHandler(deleteList));

app.post('/deleteGift', asyncHandler(deleteGift));

app.post('/deleteUser', asyncHandler(deleteUser));