export interface IMetaHead {
    title: string;
    description: string;
    ogImageUrl: string;
}

export interface IHeroProps {
    name: string;
    about: string;
}

export interface IExperience {
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
}
export interface IExperiences {
    title: string;
    details: IExperience[];
}

export interface IProject {
    title: string;
    isFeatured: boolean;
    thumbnail: string;
    githubUrl: string;
    liveUrl: string;
}
export interface IProjects {
    projects: IProject[];
}

export interface IProjectDetails {
    projectDetail: IProject;
}

export interface IBlogPost {
    id: string;
    title: string;
    description: string;
    publishDate: Date;
    tags?: string[];
    draft: boolean;
    thumbnail?: string;
    heroImagePath?: string;
}

export interface IBlogPostCard {
    blogPost: IBlogPost;
}
