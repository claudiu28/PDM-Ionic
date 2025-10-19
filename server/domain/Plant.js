class Plant {
    constructor({id, name, lastWatered, wateringInterval,description, isRare, createdAt}) {
        this.id = id;
        this.name = name;
        this.lastWatered = lastWatered;
        this.wateringInterval = wateringInterval;
        this.description = description;
        this.isRare = isRare;
        this.createdAt = createdAt;
    }

    getNextWateringDate() {
        const next = new Date(this.lastWatered);
        next.setDate(next.getDate() + this.wateringInterval);
        return next;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            wateringInterval: this.wateringInterval,
            lastWatered: this.lastWatered,
            isRare: this.isRare,
            createdAt: this.createdAt,
            description: this.description,
            nextWatering: this.getNextWateringDate(),
        }
    };
}

module.exports = Plant;