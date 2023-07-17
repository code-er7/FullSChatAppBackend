import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  removeFromGroup,
  renameGroup,
} from "../controllers/chatControllers.js";

const router = express.Router();


//this route is for the accesing a pariticular chat if exists and if not , creating a new chat with the user
//it will come with the userId with whome it the user want's to create a new chat
router.route("/").post(protect, accessChat);

//it's a get req for getting all the chats of the user who sent the req 
router.route("/").get(protect, fetchChats);

// req for creating a group chat  it will come with a array of users who will be in group and the name of the goup
router.route("/group").post(protect, createGroupChat);

//req for changing the group name comes with the chatId of that group and a new name
router.route("/rename").put(protect, renameGroup);

//this will come with a chatId in which you want to add the user and a User Id telling whome to add in the group
router.route("/groupadd").put(protect, addToGroup);

//same this will come with  chatId and and a User Id telling whome to remove from the group 
router.route("/groupremove").put(protect, removeFromGroup);
export default router;
