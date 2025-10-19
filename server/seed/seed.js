const { PrismaClient } = require('../generated/prisma');

const prismaClient = new PrismaClient();

const seed = async () => {
    const plantsData = [
        {
            name: "Crin de padure",
            description: "Planta eleganta cu flori albe sau violet, intalnita in padurile umede din Romania.",
            wateringInterval: 6,
            isRare: true,
            lastWatered: new Date("2025-10-01").toISOString(),
        },
        {
            name: "Bujor romanesc",
            description: "Simbol national al Romaniei, bujorul are flori mari, rosii si parfumate.",
            wateringInterval: 7,
            isRare: false,
            lastWatered: new Date("2025-10-02").toISOString(),
        },
        {
            name: "Lacramioara",
            description: "Planta de primavara cu flori mici, albe si parfum discret. Prefer zonele umbroase.",
            wateringInterval: 5,
            isRare: false,
            lastWatered: new Date("2025-09-29").toISOString(),
        },
        {
            name: "Feriga comuna",
            description: "Planta perena iubitoare de umiditate, ideala pentru decorarea interiorului.",
            wateringInterval: 10,
            isRare: false,
            lastWatered: new Date("2025-09-30").toISOString(),
        },
        {
            name: "Iedera verde",
            description: "Planta agatatoare des intalnita, foarte buna pentru aerisirea si purificarea spatiului.",
            wateringInterval: 8,
            isRare: false,
            lastWatered: new Date("2025-10-03").toISOString(),
        },
        {
            name: "Busuioc",
            description: "Planta aromatica traditionala romaneasca, folosita atat in gastronomie, cat si in ritualuri.",
            wateringInterval: 3,
            isRare: false,
            lastWatered: new Date("2025-09-28").toISOString(),
        },
        {
            name: "Lavanda",
            description: "Cunoscuta pentru parfumul sau relaxant, lavanda creste bine in zone insorite.",
            wateringInterval: 5,
            isRare: false,
            lastWatered: new Date("2025-09-26").toISOString(),
        },
        {
            name: "Cactus romanesc (Echinocereus)",
            description: "Planta suculenta rezistenta la seceta, ideala pentru spatii luminoase si uscate.",
            wateringInterval: 15,
            isRare: true,
            lastWatered: new Date("2025-09-25").toISOString(),
        },
        {
            name: "Muscata",
            description: "Cea mai populara planta de balcon in Romania, usor de ingrijit si mereu colorata.",
            wateringInterval: 4,
            isRare: false,
            lastWatered: new Date("2025-09-29").toISOString(),
        },
        {
            name: "Crizantema",
            description: "Planta de toamna cu flori mari, variate ca forma si culoare, simbol al respectului.",
            wateringInterval: 6,
            isRare: false,
            lastWatered: new Date("2025-09-27").toISOString(),
        },
    ];

    console.log("Seeding plants...");

    await prismaClient.plant.deleteMany();

    for (const plant of plantsData) {
        await prismaClient.plant.create({ data: plant });
    }

    console.log("Seed finished successfully!");
};

seed()
    .catch((err) => {
        console.error("Error while seeding:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });