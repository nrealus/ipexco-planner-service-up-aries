
import fs from 'fs'
import { PlanningModel, toPDDL_domain, toPDDL_problem } from '../domain/pddl';
import { PlanProperty } from '../domain/plan_property';
import { json } from 'stream/consumers';

export interface GoalDefinition {
    plan_properties: PlanProperty[],
    hard_goals: string[],
    soft_goals: string[]
}

export function setupExperimentEnvironment(model: PlanningModel, goalDefinition: GoalDefinition, expFolder: string){

    fs.mkdirSync(expFolder);

    const full_problem_path = expFolder + '/problem_def.json'
    fs.writeFileSync(full_problem_path, JSON.stringify(model))

}


export function cleanUpExperimentEnvironment(expFolder: string){
    fs.rmSync(expFolder, { recursive: true, force: true });
}