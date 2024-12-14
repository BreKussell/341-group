class Account {
    username: string; // User's username
    password: string; // User's password

    // Account model to represent user data
    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}

export default Account; // Export the Account class as a default export