export interface Plant {
  id: number;
  name: string;
  description: string;
  wateringInterval: number;
  isRare: boolean;
  lastWatered: string;
  createdAt?: string;
  nextWatering?: string;
}

export interface UpdatePlantDto {
  name?: string;
  description?: string;
  wateringInterval?: number;
  isRare?: boolean;
  lastWatered?: string;
}

// plant minus id, createdAt and nextWatering
export type CreatePlantDto = Omit<Plant, 'id' | 'createdAt' | 'nextWatering'>;