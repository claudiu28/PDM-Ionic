const {PrismaClient} = require('../generated/prisma');
const Plant = require('../domain/Plant');

class PlantService {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getAllPlants() {
        const result = await this.prisma.plant.findMany();
        return result.map(r => new Plant(r).toJSON());
    }

    async createPlant(data) {
        const created = await this.prisma.plant.create({
            data: {
                name: data.name,
                description: data.description,
                wateringInterval: data.wateringInterval,
                isRare: data.isRare,
                lastWatered: data.lastWatered ? new Date(data.lastWatered) : new Date(),
            },
        });
        const {id, name, description, wateringInterval, isRare, lastWatered, createdAt} = created;
        return new Plant({
            id, name, description, wateringInterval, isRare, lastWatered, createdAt,
        }).toJSON();
    }

    async updatePlant(id, data) {
        const updateData = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.wateringInterval !== undefined) updateData.wateringInterval = data.wateringInterval;
        if (data.isRare !== undefined) updateData.isRare = data.isRare;
        if (data.lastWatered !== undefined) {
            updateData.lastWatered = new Date(data.lastWatered);
        }

        const updated = await this.prisma.plant.update({
            where: {id: Number(id)},
            data: updateData,
        });

        const {id: updatedId, name, description, wateringInterval, isRare, lastWatered, createdAt} = updated;
        return new Plant({
            id: updatedId, name, description, wateringInterval, isRare, lastWatered, createdAt,
        }).toJSON();
    }

    async deletePlant(id) {
        const deleted = await this.prisma.plant.delete({
            where: {id: Number(id)},
        });
        const {id: deletedId, name, description, wateringInterval, isRare, lastWatered, createdAt} = deleted;
        return new Plant({
            id: deletedId, name, description, wateringInterval, isRare, lastWatered, createdAt
        }).toJSON();
    }
}

module.exports = PlantService;