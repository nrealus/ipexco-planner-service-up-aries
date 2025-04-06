export interface PlanProperty {
    _id?: string;
    name: string;
    project: string;
    type: string;
    naturalLanguageDescription: string;
    isUsed: boolean;
    globalHardGoal: boolean;
    utility: number;
    ranking: number;
}