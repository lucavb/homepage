import { projects } from './projects';

export const info = {
    baseUrl: 'https://luca-becker.me',
    name: 'Luca Becker',
    jobDescription: 'Principal Consultant for AI-assisted development',
    heroDescription: `My main focus is using AI coding tools effectively in day-to-day software development.`,
    metaDescription: `Principal Consultant at TNG focused on AI-assisted development, software engineering, team leadership, and AWS infrastructure.`,
    aboutHeading: `I write code, run infrastructure, and lead engineering teams.`,
    about: `At my current client, I'm responsible for infrastructure and dev-enablement, leading a team while still writing code - mostly AI-assisted these days. At TNG Technology Consulting, I'm driving initiatives around AI-assisted coding: how to use it effectively, how to teach it, and where it's taking professional software development.

My technical background spans TypeScript, React, Angular, Java, Spring Boot, and cloud technologies like AWS and Kubernetes. I studied Computer Science at KIT with a focus on IT Security and Cryptography.`,

    experience: [
        {
            name: 'TNG Technology Consulting GmbH - Second Client',
            location: 'Munich, Germany',
            startDate: 'Apr 2023',
            endDate: 'Present',
            description: [
                '• Built the entire CI/CD pipeline from scratch using GitHub Actions, automating deployments and reducing manual release overhead',
                '• Introduced AI-powered code reviews using GitHub Copilot and Claude Haiku, catching issues earlier and speeding up review cycles',
                '• Leading GitHub Copilot adoption across the team, teaching developers how to work effectively with AI coding assistants',
                '• Leading a Scrum team of 5 engineers, balancing technical delivery with long-term architectural decisions',
                '• Building backend services with NestJS, PostgreSQL, OpenSearch, and Redis to support a high-traffic consumer application',
                '• Managing AWS infrastructure across multiple environments, keeping costs in check while maintaining performance',
            ],
            skills: [
                'AI-Assisted Development',
                'GitHub Copilot',
                'Team Leadership',
                'Scrum',
                'TypeScript',
                'NestJS',
                'AWS',
                'GitHub Actions',
                'PostgreSQL',
                'OpenSearch',
                'Redis',
            ],
        },

        {
            name: 'TNG Technology Consulting GmbH - First Client',
            location: 'Munich, Germany',
            startDate: 'Dec 2019',
            endDate: 'Mar 2023',
            description: [
                '• Developed dynamic and responsive frontend applications using Angular 14+, improving user experience and engagement',
                '• Built and maintained backend services with Java 17 and Spring Boot, ensuring seamless integration and high performance',
                '• Managed Kubernetes clusters, enhancing deployment efficiency and system resilience',
                '• Introduced Cypress for end-to-end testing, significantly improving code quality and reducing bugs',
                '• Implemented Renovate for automated dependency updates, ensuring up-to-date and secure codebases',
                '• Developed a shared library from the ground up, promoting code reuse and consistency across projects',
            ],
            skills: [
                'Angular',
                'TypeScript',
                'Java',
                'Spring Boot',
                'Kubernetes',
                'Cypress',
                'Renovate',
                'Library Development',
            ],
        },

        {
            name: 'TNG Technology Consulting GmbH - Internal Projects',
            location: 'Munich, Germany',
            startDate: 'Dec 2019',
            endDate: 'Present',
            description: [
                '• Driving internal AI adoption by teaching colleagues how to use Cursor and GitHub Copilot in their daily work',
                '• Running workshops and giving talks on AI coding workflows, helping the team adapt to new development practices',
                '• Conducting technical interviews to evaluate engineering candidates across different seniority levels',
                '• Leading technical due diligence for venture capital investments, assessing codebases and engineering teams',
                '• Built an internal notification system with Kotlin and Spring Boot that automatically routes company updates to relevant teams',
            ],
            skills: [
                'AI-Assisted Development',
                'Cursor',
                'GitHub Copilot',
                'Technical Interviews',
                'Due Diligence',
                'Consulting',
                'Kotlin',
                'Spring Boot',
            ],
        },

        {
            name: 'FZI Forschungszentrum Informatik',
            location: 'Karlsruhe, Germany',
            startDate: 'Mar 2016',
            endDate: 'Oct 2019',
            description: [
                '• Student Research Assistant',
                '• Developing prototypes to show case IT security issues in consumer hardware',
                '• Developing an Android application to track sensor data',
            ],
            skills: ['Android Development', 'Java', 'IT Security', 'Research', 'Prototyping'],
        },
    ],

    education: [
        {
            name: 'Karlsruher Institute for Technology (KIT)',
            location: 'Karlsruhe, Germany',
            startDate: '2013',
            endDate: '2019',
            description: [
                "Bachelor's and Master's degrees in Computer Science",
                '• Focusing on IT Security and Cryptography',
                "• as well as telematics during my Master's thesis",
            ],
        },
        {
            name: 'Semester at University College Cork, Ireland',
            location: 'Cork, Ireland',
            startDate: '2015',
            endDate: '2015',
            description: ['Semester abroad doing ERASMUS'],
        },
    ],

    socialMedia: {
        github: 'https://github.com/lucavb',
        linkedin: 'https://www.linkedin.com/in/lucabecker/',
        matrix: 'https://matrix.to/#/@luca:sunbury.xyz',
    },

    languages: [
        { name: 'German', level: 'Native' },
        { name: 'English', level: 'C1' },
        { name: 'French', level: 'B1' },
    ],

    cvSummary: `Principal Consultant at TNG Technology Consulting. At my current client, I'm responsible for infrastructure and dev-enablement, leading a team while still writing code - mostly AI-assisted these days. At TNG, I'm driving initiatives around AI-assisted coding: how to use it effectively, how to teach it, and where it's taking professional software development. I write about AI-assisted development workflows on my blog. Full-stack background in TypeScript, Java, Spring Boot, AWS, Kubernetes.`,
    projects,
};
