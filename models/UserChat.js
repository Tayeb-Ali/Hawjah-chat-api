/*export */
class UserChat {
    constructor(id, from_user_id, to_user_id, message) {
        this.id = id;
        this.from_user_id = from_user_id;
        this.to_user_id = to_user_id;
        this.message = message;
    }
}

module.exports = {
    UserChat: UserChat
};