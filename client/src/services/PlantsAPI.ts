import { Plant, CreatePlantDto, UpdatePlantDto } from '../types/Plant';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export class PlantApi {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/plants`;
  }

  async getAllPlants(): Promise<Plant[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch plants');
    }
    return response.json();
  }

  async createPlant(plant: CreatePlantDto): Promise<Plant> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plant),
    });
    if (!response.ok) {
      throw new Error('Failed to create plant');
    }
    return response.json();
  }

  async updatePlant(id: number, plant: UpdatePlantDto): Promise<Plant> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plant),
    });
    if (!response.ok) {
      throw new Error('Failed to update plant');
    }
    return response.json();
  }

  async deletePlant(id: number): Promise<Plant> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete plant');
    }
    return response.json();
  }
}

export const plantApi = new PlantApi();
