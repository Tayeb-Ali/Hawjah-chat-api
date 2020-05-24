const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
const UsersChat = require("../models/UsersChat").UsersChat;

module.exports = new EntitySchema({
    name: "user_chat",
    target: UsersChat,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        from_user_id: {
            type: "int"
        },
        to_user_id: {
            type: "int"
        },
        message: {
            type: "varchar"
        }
    }
});