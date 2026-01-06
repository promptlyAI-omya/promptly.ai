import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Clean existing data
    await prisma.prompt.deleteMany()
    await prisma.submission.deleteMany()
    // Optional: await prisma.user.deleteMany() // Be careful not to wipe existing users if not intended, but for seed it's okay usually.

    // Seed Admin User
    const bcrypt = require('bcryptjs');
    const password = await bcrypt.hash('password123', 10);

    await prisma.user.upsert({
        where: { email: 'admin@prompty.ai' },
        update: {},
        create: {
            email: 'admin@prompty.ai',
            name: 'Admin User',
            password,
            role: 'ADMIN'
        }
    });
    console.log('Admin user seeded: admin@prompty.ai / password123');

    // Seed Prompts (Placeholders as original data was not provided)
    const prompts = [
        {
            title: "Neon Cyberpunk City",
            desc: "Generate a futuristic city with neon lights and rain.",
            category: "Midjourney",
            fullPrompt: "A futuristic cityscape at night, heavy rain, neon lights reflecting on the wet pavement, cyberpunk aesthetic, high detail, 8k --ar 16:9",
            tags: "cyberpunk,city,neon",
            imageUrl: "/placeholder/cyberpunk.jpg"
        },
        {
            title: "Watercolor Portrait",
            desc: "Soft watercolor painting of a young woman.",
            category: "Stable Diffusion",
            fullPrompt: "Portrait of a young woman, watercolor style, soft pastel colors, dreamy atmosphere, detailed eyes, artstation",
            tags: "watercolor,portrait,art",
            imageUrl: "/placeholder/watercolor.jpg"
        },
        {
            title: "Isometric Room",
            desc: "3D isometric view of a cozy gamer room.",
            category: "DALL-E 3",
            fullPrompt: "Isometric 3D render of a cozy gamer room, purple lighting, computer setup, bean bag, plants, high resolution, blender style",
            tags: "3d,isometric,room",
            imageUrl: "/placeholder/isometric.jpg"
        },
        // Adding more to approximate the "18 prompts" request
        { title: "Space Explorer", desc: "Astronaut on Mars.", category: "Midjourney", fullPrompt: "Astronaut walking on Mars surface, red dust, realistic, cinematic lighting", tags: "space,mars", imageUrl: "" },
        { title: "Fantasy Dragon", desc: "Epic dragon on a mountain.", category: "Midjourney", fullPrompt: "Giant dragon perched on a snowy mountain peak, fire breathing, epic scale", tags: "fantasy,dragon", imageUrl: "" },
    ]

    for (const p of prompts) {
        await prisma.prompt.create({ data: p })
    }

    // Seed Community Submissions
    const submissions = [
        {
            name: "Alice Dev",
            handle: "@alicedev",
            email: "alice@example.com",
            tool: "Midjourney",
            promptText: "A cat wearing a tuxedo",
            status: "approved",
            consent: true,
            link: "https://twitter.com/alicedev"
        },
        {
            name: "Bob Artist",
            handle: "@bobbyart",
            email: "bob@example.com",
            tool: "Stable Diffusion",
            promptText: "Abstract geometric shapes",
            status: "pending",
            consent: true
        }
    ]

    for (const s of submissions) {
        await prisma.submission.create({ data: s })
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
