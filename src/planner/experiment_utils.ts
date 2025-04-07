
import fs from 'fs'
import { PlanningModel } from '../domain/model';
import { PlanProperty } from '../domain/plan_property';
import { json } from 'stream/consumers';
import assert from 'assert';

export interface GoalDefinition {
    plan_properties: PlanProperty[],
    hard_goals: string[],
    soft_goals: string[]
}

export function setupExperimentEnvironment(model: PlanningModel, goalDefinition: GoalDefinition, expFolder: string){

    fs.mkdirSync(expFolder);

    const problem_path = expFolder + '/problem_def.json'
    fs.writeFileSync(problem_path, JSON.stringify(model))

    const additional_properties = goalDefinition.plan_properties.filter((item) => goalDefinition.hard_goals.includes(item._id)).map((item) => item);
    assert(goalDefinition.soft_goals.length == 0);

    const additional_properties_path = expFolder + '/additional_properties_def.json'
    fs.writeFileSync(
        additional_properties_path,
        JSON.stringify(additional_properties),
    )

}


export function cleanUpExperimentEnvironment(expFolder: string){
    fs.rmSync(expFolder, { recursive: true, force: true });
}