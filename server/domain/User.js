class User{
    constructor ({id, name, email, password, createdAt}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt ? new Date(createdAt) : new Date();
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            createdAt: this.createdAt,
        };
    }
}