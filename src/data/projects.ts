import aicommitsImage from '../assets/images/aicommits.png';
import wollwerkImage from '../assets/images/wollwerk-thumbnail.jpg';
import lunchSlackBotImage from '../assets/images/lunch-slack-bot-thumbnail.jpg';
import ollamaExporterImage from '../assets/images/ollama-exporter-thumbnail.jpg';
import homebridgeImage from '../assets/images/homebridge-http-motion-sensor-thumbnail.png';
import stylelintImage from '../assets/images/stylelint-checkstyle-reporter-thumbnail.png';
import conventionalChangelogImage from '../assets/images/conventional-changelog-conventionalcommits-jira-thumbnail.png';
import hoymilesImage from '../assets/images/hoymiles-wifi-exporter-thumbnail.jpg';
import portglassImage from '../assets/images/portglass-thumbnail.jpg';
import type { IProject } from '@types';

export const projects: IProject[] = [
    {
        title: '@lucavb/aicommits',
        category: 'Open source / npm',
        summary: 'An AI-powered Git commit message generator.',
        technologies: ['TypeScript', 'Node.js', 'CLI', 'Git'],
        githubUrl: 'https://github.com/lucavb/aicommits',
        liveUrl: 'https://www.npmjs.com/package/@lucavb/aicommits',
        thumbnail: aicommitsImage,
        isFeatured: true,
    },
    {
        title: 'WollWerk',
        category: 'Community website',
        summary: 'Website and product configurator for a cross-generational knitting initiative in Karlsruhe.',
        technologies: ['Ruby on Rails', 'Ember.js', 'JavaScript', 'CSS'],
        liveUrl: 'https://www.wollwerk.org/',
        thumbnail: wollwerkImage,
        isFeatured: true,
    },
    {
        title: 'Weather-Aware Lunch Slack Bot',
        category: 'Slack automation',
        summary: 'A serverless Slack bot that sends lunch reminders when the weather is good.',
        technologies: ['TypeScript', 'AWS Lambda', 'OpenTofu', 'Slack API'],
        githubUrl: 'https://github.com/lucavb/lunch-slack-bot',
        thumbnail: lunchSlackBotImage,
        isFeatured: true,
    },
    {
        title: 'Ollama Prometheus Exporter',
        category: 'AI infrastructure',
        summary: 'Exposes Ollama server metrics to Prometheus.',
        technologies: ['TypeScript', 'Node.js', 'Prometheus', 'Docker'],
        githubUrl: 'https://github.com/lucavb/ollama-exporter',
        liveUrl: 'https://hub.docker.com/r/lucabecker42/ollama-exporter',
        thumbnail: ollamaExporterImage,
        isFeatured: false,
    },
    {
        title: 'portglass',
        category: 'Developer tool / macOS',
        summary: 'Shows live USB-C power delivery, cable negotiation, and battery telemetry on macOS.',
        technologies: ['Swift', 'IOKit', 'macOS', 'CLI'],
        githubUrl: 'https://github.com/lucavb/portglass',
        liveUrl: 'https://github.com/lucavb/portglass/releases',
        thumbnail: portglassImage,
        isFeatured: false,
    },
    {
        title: 'Homebridge HTTP Motion Sensor',
        category: 'Smart home',
        summary: 'Adds network-triggered motion sensors to Homebridge and HomeKit.',
        technologies: ['TypeScript', 'Node.js', 'Homebridge', 'HomeKit'],
        githubUrl: 'https://github.com/lucavb/homebridge-http-motion-sensor',
        liveUrl: 'https://www.npmjs.com/package/homebridge-http-motion-sensor',
        thumbnail: homebridgeImage,
        isFeatured: false,
    },
    {
        title: 'Hoymiles WiFi Exporter',
        category: 'Monitoring',
        summary: 'Exposes power, voltage, energy, and grid metrics from Hoymiles WiFi inverters.',
        technologies: ['Python', 'Prometheus', 'Docker', 'GitHub Actions'],
        githubUrl: 'https://github.com/lucavb/hoymiles-wifi-exporter',
        liveUrl: 'https://ghcr.io/lucavb/hoymiles-wifi-exporter',
        thumbnail: hoymilesImage,
        isFeatured: false,
    },
    {
        title: 'Stylelint Checkstyle Reporter',
        category: 'Developer tool',
        summary: 'Outputs Stylelint results as Checkstyle XML for CI and code-quality tools.',
        technologies: ['JavaScript', 'Node.js', 'Stylelint', 'XML'],
        githubUrl: 'https://github.com/lucavb/stylelint-checkstyle-reporter',
        liveUrl: 'https://www.npmjs.com/package/stylelint-checkstyle-reporter',
        thumbnail: stylelintImage,
        isFeatured: false,
    },
    {
        title: 'conventional-changelog-conventionalcommits-jira',
        category: 'Developer tool',
        summary: 'Supports conventional commits with JIRA ticket prefixes.',
        technologies: ['JavaScript', 'Node.js', 'JIRA', 'Git'],
        githubUrl: 'https://github.com/lucavb/conventional-changelog-conventionalcommits-jira',
        liveUrl: 'https://www.npmjs.com/package/conventional-changelog-conventionalcommits-jira',
        thumbnail: conventionalChangelogImage,
        isFeatured: false,
    },
];
