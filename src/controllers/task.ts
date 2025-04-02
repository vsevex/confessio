import Bull from "bull";
import { v4 as uuidv4 } from "uuid";
import * as winston from "winston";
import ConfessioTask from "../models/task";
import FirestoreController from "./firestore";
import di from "../injection";

var taskQueue: Bull.Queue<ConfessioTask>;

export default class TaskController {
  private logger: winston.Logger;

  initialize(host: string, port: number) {
    taskQueue = new Bull("confessio_tasks", "redis://" + host + ":" + port);
    const firestore: FirestoreController = di().get<FirestoreController>(
      "firestoreController"
    );

    taskQueue.process(async (job) => {
      await firestore.publishConfession(job.data.refId);
    });
  }

  async addTask(
    customerId: number,
    refId: string
  ): Promise<string | undefined> {
    try {
      const orderId = uuidv4();
      await taskQueue.add(
        { orderId: orderId, customerId: customerId, refId: refId },
        { delay: 30 * 60 * 1000, attempts: 3 }
      );
      this.logger.info("Task added to Redis queue: ", orderId);
      return orderId;
    } catch (error) {
      this.logger.error("Error adding task to Redis: ", error);
    }
  }

  async removeTask(confessionId: string) {
    const jobs = await taskQueue.getJobs(["waiting", "active"]);
    const jobToRemove = jobs.find((job) => job.data.refId === confessionId);

    if (jobToRemove) {
      await jobToRemove.remove();
      this.logger.info("Task removed from Redis queue: ", confessionId);
    } else {
      this.logger.warn("Task not found in Redis queue: ", confessionId);
    }
  }

  constructor(logger: winston.Logger, host: string, port: number) {
    this.logger = logger;
    logger.warn("Redis controller initialized");
    this.initialize(host, port);
  }
}
