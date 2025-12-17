import aicommitsImage from '../assets/images/aicommits.png';
import wollwerkImage from '../assets/images/wollwerk-thumbnail.jpg';
import lunchSlackBotImage from '../assets/images/lunch-slack-bot-thumbnail.jpg';
import homebridgeImage from '../assets/images/homebridge-http-motion-sensor-thumbnail.png';
import stylelintImage from '../assets/images/stylelint-checkstyle-reporter-thumbnail.png';
import conventionalChangelogImage from '../assets/images/conventional-changelog-conventionalcommits-jira-thumbnail.png';
import hoymilesImage from '../assets/images/hoymiles-wifi-exporter-thumbnail.jpg';

export const info = {
    baseUrl: 'https://luca-becker.me',
    name: 'Luca Becker',
    jobDescription: 'Principal Consultant & AI-Coding Specialist',
    about: `I'm a principal software consultant specializing in modern development practices and AI-assisted workflows.
I focus on building robust digital solutions and helping teams adopt modern development practices, whether they are websites, applications, or anything in between. Since starting my professional software development career in December 2019, I have specialized in Front-end Development and Full Stack Engineering.
Currently, I work at TNG Technology Consulting as a Principal Consultant, where I have supported multiple clients as a Full Stack Engineer. Over these years, I have honed my skills in TypeScript, React, Angular, Java, Spring Boot, and cloud technologies like AWS and Kubernetes.
I am committed to continuous learning and exploration of new technologies. Recently, I've become deeply passionate about AI-assisted development, particularly how tools like Cursor and LLMs are revolutionizing the way we build software. These technologies allow us to focus on the important questions of software design and architecture rather than getting bogged down in implementation details.
Currently, I am leading a team from a technical standpoint and managing the infrastructure at my second client, ensuring successful project delivery and technical excellence while embracing modern development practices.`,

    experience: [
        {
            name: 'TNG Technology Consulting GmbH - Second Client',
            location: 'Munich, Germany',
            startDate: 'Apr 2023',
            endDate: 'Present',
            description: [
                '• Provisioned and maintained AWS infrastructure, optimizing performance and cost-efficiency',
                '• Developed robust backend applications using NestJS, PostgreSQL, OpenSearch, and Redis, enhancing system reliability and scalability',
                '• Leading a Scrum Team, setting personal and strategic project goals, and fostering a collaborative and productive environment',
                '• Set up the entire CI/CD infrastructure using GitHub Actions, creating numerous workflows and actions to streamline development and deployment processes',
            ],
            skills: [
                'TypeScript',
                'NestJS',
                'AWS',
                'PostgreSQL',
                'OpenSearch',
                'Redis',
                'GitHub Actions',
                'Team Leadership',
                'Scrum',
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
                '• Developed and maintained an internal application using Kotlin and Spring Boot to automate the forwarding of relevant information to colleagues, improving communication efficiency',
                '• Conducted technical interviews for prospective applicants, contributing to the selection of high-caliber talent',
                '• Performed multiple technical due diligence assessments for venture capitalists, providing critical insights and evaluations to inform investment decisions',
            ],
            skills: ['Kotlin', 'Spring Boot', 'Technical Interviews', 'Due Diligence', 'Consulting'],
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
    },

    projects: [
        {
            githubUrl: 'https://github.com/lucavb/aicommits',
            isFeatured: true,
            liveUrl: 'https://www.npmjs.com/package/@lucavb/aicommits',
            thumbnail: aicommitsImage,
            title: '@lucavb/aicommits',
        },
        {
            isFeatured: true,
            liveUrl: 'https://www.wollwerk.org/',
            thumbnail: wollwerkImage,
            title: 'Wollwerk',
        },
        {
            githubUrl: 'https://github.com/lucavb/lunch-slack-bot',
            isFeatured: true,
            thumbnail: lunchSlackBotImage,
            title: 'Weather-Aware Lunch Slack Bot',
        },
        {
            githubUrl: 'https://github.com/lucavb/homebridge-http-motion-sensor',
            isFeatured: false,
            liveUrl: 'https://www.npmjs.com/package/homebridge-http-motion-sensor',
            thumbnail: homebridgeImage,
            title: 'Homebridge HTTP Motion Sensor',
        },
        {
            githubUrl: 'https://github.com/lucavb/stylelint-checkstyle-reporter',
            isFeatured: false,
            liveUrl: 'https://www.npmjs.com/package/stylelint-checkstyle-reporter',
            thumbnail: stylelintImage,
            title: 'stylelint-checkstyle-reporter',
        },
        {
            githubUrl: 'https://github.com/lucavb/conventional-changelog-conventionalcommits-jira',
            isFeatured: false,
            liveUrl: 'https://www.npmjs.com/package/conventional-changelog-conventionalcommits-jira',
            thumbnail: conventionalChangelogImage,
            title: 'conventional-changelog-conventionalcommits-jira',
        },
        {
            githubUrl: 'https://github.com/lucavb/hoymiles-wifi-exporter',
            isFeatured: false,
            liveUrl: 'https://ghcr.io/lucavb/hoymiles-wifi-exporter',
            thumbnail: hoymilesImage,
            title: 'Hoymiles WiFi Exporter',
        },
    ],
};
