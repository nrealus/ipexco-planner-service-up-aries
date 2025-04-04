import express from 'express';
import { plannerRouter } from './routes/planner';
import { Agenda } from "@hokify/agenda";
import { schedule_run } from './planner/run_planner';
import * as dotenv from "dotenv";
import { PlanRun } from './domain/plan-run';

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

console.log("Debug output: " + process.env.DEBUG_OUTPUT);
console.log("folder to temporally store the experiment data: " + process.env.TEMP_RUN_FOLDERS);
console.log("Planner:")
console.log(process.env.PLANNER_SERVICE_PLANNER)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('', plannerRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const mongodbURL = process.env.MONGO_DB || 'localhost:27017/agenda-planner';
console.log("Database: " + mongodbURL);

const concurrentRuns = Number(process.env.CONCURRENT_RUNS) || 1;

export const agenda = new Agenda({
  db: {address: mongodbURL, collection: 'agendaJobs'},
  processEvery: '5 seconds',
  maxConcurrency: concurrentRuns,
  defaultConcurrency: concurrentRuns,
});

agenda.start().then(
  () => console.log("Job scheduler started!"),
  () => console.log("Job scheduler failed!")
);

agenda.define('planner call', async job => {
  let plan_run = job.attrs.data[1] as PlanRun;
  console.log("Schedule job: " + plan_run.request.id);
  schedule_run(plan_run, job);
});

