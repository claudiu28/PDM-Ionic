const PlantService = require('../services/PlantService');
const express = require('express');

const router = express.Router();
const plantService = new PlantService();

router.get('/', async (req, res) => {
    try {
        const plants = await plantService.getAllPlants();
        res.status(200).json(plants);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching plants' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, description, wateringInterval, isRare, lastWatered } = req.body;
        if (!name || !wateringInterval) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const plant = await plantService.createPlant({
            name,
            description,
            wateringInterval,
            isRare,
            lastWatered,
        });

        const io = req.app.get('io');
        io.emit('plantAdded', plant);
        res.status(200).json(plant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating plant' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, wateringInterval, isRare, lastWatered } = req.body;

        const plant = await plantService.updatePlant(id, {
            name,
            description,
            wateringInterval,
            isRare,
            lastWatered,
        });

        const io = req.app.get('io');
        io.emit('plantUpdated', plant);

        res.status(200).json(plant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating plant' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const plant = await plantService.deletePlant(id);

        const io = req.app.get('io');
        io.emit('plantDeleted', { id: plant.id });

        res.status(200).json(plant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting plant' });
    }
});

module.exports = router;
