import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    IonRefresher,
    IonRefresherContent,
    IonBadge,
    IonToast,
    IonSpinner,
    IonModal,
    IonInput,
    IonTextarea,
    IonButtons,
    IonCheckbox,
} from '@ionic/react';
import { add, water, leafOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { Plant } from '../types/Plant';
import { plantApi } from '../services/PlantsAPI';
import { socketService } from '../services/SocketManage';
import './PlantList.css';

const PlantList: React.FC = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        wateringInterval: 3,
        isRare: false,
        lastWatered: new Date().toISOString().split('T')[0],
    });

    const loadPlants = async () => {
        try {
            setLoading(true);
            const data = await plantApi.getAllPlants();
            setPlants(data);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to load plants');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!socketService.isConnected()) {
            socketService.connect();
        }

        loadPlants().finally(() => console.log('Plants loaded'));

        const removeListener = socketService.addListener({
            onPlantAdded: (plant) => {
                console.log("Received plantAdded:", plant);
                setPlants((prev) => [...prev, plant]);
                setToast({ show: true, message: `New plant "${plant.name}" added!` });
            },
            onPlantUpdated: (plant) => {
                console.log("Received plantUpdated:", plant);
                setPlants((prev) => prev.map((p) => (p.id === plant.id ? plant : p)));
                setToast({ show: true, message: `Plant "${plant.name}" updated!` });
            },
            onPlantDeleted: ({ id }) => {
                console.log("Received plantDeleted:", id);
                setPlants((prev) => prev.filter((p) => p.id !== id));
                setToast({ show: true, message: `Plant deleted!` });
            },
        });

        return () => {
            removeListener();
            socketService.disconnect();
        };
    }, []);

    const handleRefresh = async (event: CustomEvent) => {
        await loadPlants();
        event.detail.complete();
    };

    const getDaysSinceWatering = (lastWatered: string) => {
        if (!lastWatered) return 'Unknown';
        const last = new Date(lastWatered);
        const now = new Date();
        return Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    };

    const handleInputChange = (e: CustomEvent) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const name = target.name;
        const value =
            target.type === 'checkbox' ? (target as HTMLInputElement).checked
                : target.type === 'number' ? Number(target.value) : target.value;
        setFormData((prev) => ({...prev, [name]: value,}));
    };

    const handleCreate = async () => {
        try {
            await plantApi.createPlant(formData);
            setShowCreateModal(false);
            setFormData({
                name: '',
                description: '',
                wateringInterval: 3,
                isRare: false,
                lastWatered: new Date().toISOString().split('T')[0],
            });
            setToast({ show: true, message: 'Plant created successfully!' });
        } catch (err) {
            console.error(err);
            setToast({ show: true, message: 'Failed to create plant!' });
        }
    };

    const handleUpdate = async () => {
        if (!selectedPlant) return;
        try {
            await plantApi.updatePlant(selectedPlant.id, formData);
            setShowEditModal(false);
            setToast({ show: true, message: 'Plant updated successfully!' });
        } catch (err) {
            console.error(err);
            setToast({ show: true, message: 'Failed to update plant!' });
        }
    };

    const handleDelete = async () => {
        if (!selectedPlant) return;
        try {
            await plantApi.deletePlant(selectedPlant.id);
            setShowEditModal(false);
            setToast({ show: true, message: 'Plant deleted successfully!' });
        } catch (err) {
            console.error(err);
            setToast({ show: true, message: 'Failed to delete plant!' });
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="success">
                    <IonTitle>My Plants</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                {loading && (
                    <div className="loading-container">
                        <IonSpinner name="crescent" />
                    </div>
                )}

                {error && (
                    <div className="error-container">
                        <p>{error}</p>
                        <IonButton onClick={loadPlants}>Retry</IonButton>
                    </div>
                )}

                {!loading && !error && (
                    <IonList>
                        {plants.length === 0 ? (
                            <div className="empty-state">
                                <h2>No plants yet</h2>
                                <p>Add your first plant to get started</p>
                            </div>
                        ) : (
                            plants.map((plant) => {
                                const daysSince = getDaysSinceWatering(plant.lastWatered);
                                return (
                                    <IonItem
                                        key={plant.id}
                                        button
                                        onClick={() => {
                                            setSelectedPlant(plant);
                                            setFormData({
                                                name: plant.name,
                                                description: plant.description,
                                                wateringInterval: plant.wateringInterval,
                                                isRare: plant.isRare,
                                                lastWatered: plant.lastWatered || '',
                                            });
                                            setShowEditModal(true);
                                        }}
                                    >
                                        <IonIcon
                                            icon={leafOutline}
                                            slot="start"
                                            color={plant.isRare ? "warning" : "success"}
                                            style={{ fontSize: '32px' }}
                                        />
                                        <IonLabel>
                                            <h2>
                                                {plant.name}{' '}
                                                {plant.isRare && (
                                                    <IonBadge color="warning" style={{ marginLeft: 8 }}>
                                                        Rare
                                                    </IonBadge>
                                                )}
                                            </h2>
                                            <p>{plant.description}</p>
                                            <div className="watering-info">
                                                <IonIcon icon={water} />
                                                <span>Last watered {daysSince} days ago</span>
                                            </div>
                                        </IonLabel>
                                    </IonItem>
                                );
                            })
                        )}
                    </IonList>
                )}

                <IonModal isOpen={showCreateModal} onDidDismiss={() => setShowCreateModal(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Add Plant</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowCreateModal(false)}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonInput
                            label="Name *"
                            name="name"
                            value={formData.name}
                            onIonInput={handleInputChange}
                            placeholder="Enter plant name"
                        />
                        <IonTextarea
                            label="Description"
                            name="description"
                            value={formData.description}
                            onIonInput={handleInputChange}
                            placeholder="Describe your plant"
                            rows={3}
                        />
                        <IonInput
                            label="Watering Interval (days) *"
                            name="wateringInterval"
                            type="number"
                            value={formData.wateringInterval}
                            onIonInput={handleInputChange}
                            min="1"
                        />
                        <IonItem>
                            <IonLabel>Is Rare?</IonLabel>
                            <IonCheckbox
                                name="isRare"
                                checked={formData.isRare}
                                onIonChange={(e) =>
                                    setFormData((prev) => ({ ...prev, isRare: e.detail.checked }))}
                            />
                        </IonItem>
                        <IonInput
                            label="Last Watered *"
                            name="lastWatered"
                            type="date"
                            value={formData.lastWatered}
                            onIonInput={handleInputChange}
                        />
                        <IonButton
                            expand="block"
                            onClick={handleCreate}
                            disabled={!formData.name || !formData.wateringInterval}
                            style={{ marginTop: '16px' }}
                        >
                            Create Plant
                        </IonButton>
                    </IonContent>
                </IonModal>

                <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Edit Plant</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowEditModal(false)}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonInput
                            label="Name"
                            name="name"
                            value={formData.name}
                            onIonInput={handleInputChange}
                        />
                        <IonTextarea
                            label="Description"
                            name="description"
                            value={formData.description}
                            onIonInput={handleInputChange}
                            rows={3}
                        />
                        <IonInput
                            label="Watering Interval (days)"
                            name="wateringInterval"
                            type="number"
                            value={formData.wateringInterval}
                            onIonInput={handleInputChange}
                            min="1"
                        />
                        <IonItem>
                            <IonLabel>Is Rare?</IonLabel>
                            <IonCheckbox
                                name="isRare"
                                checked={formData.isRare}
                                onIonChange={(e) => setFormData((prev) => ({ ...prev, isRare: e.detail.checked }))}
                            />
                        </IonItem>
                        <IonInput
                            label="Last Watered"
                            name="lastWatered"
                            type="date"
                            value={formData.lastWatered}
                            onIonInput={handleInputChange}
                        />
                        <IonButton
                            expand="block"
                            color="success"
                            onClick={handleUpdate}
                            style={{ marginTop: '16px' }}
                        >
                            Update Plant
                        </IonButton>
                        <IonButton
                            expand="block"
                            color="danger"
                            onClick={handleDelete}
                            style={{ marginTop: '8px' }}
                        >
                            Delete Plant
                        </IonButton>
                    </IonContent>
                </IonModal>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => setShowCreateModal(true)}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>

                <IonToast
                    isOpen={toast.show}
                    message={toast.message}
                    duration={2500}
                    onDidDismiss={() => setToast({ show: false, message: '' })}
                />
            </IonContent>
        </IonPage>
    );
};

export default PlantList;