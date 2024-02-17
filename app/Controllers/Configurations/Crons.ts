import colors from "colors";
import { getTimestamp } from "@/Controllers/Loggings/getTimestamp";
import { EventEmitter } from "events";
import { randomUUID } from "crypto";
import cronParser, { CronExpression } from "cron-parser";
import { Internal } from "../Storage";

/**
 * Configuration object for defining recurring cron jobs.
 */
export type CronsConfigurations<Metadata = undefined> = {
    /**
     * Identifier for the Cron job.
     */
    name: string;
    /**
     * Cron argument, e.g., "* * * * * *" for every second.
     */
    cron: string;
    /**
     * Function to be executed when the cron job is triggered.
     */
    exec: (cron: CronsConfigurations<Metadata>, interval: CronExpression) => void;
    /**
     * Metadata for the cron job, for specific information.
     */
    metadata?: Metadata;
    /**
     * Indicates whether the cron job should run only once.
     */
    once?: boolean;
}

/**
 * Configuration object for defining a unique cron job to run only once.
 */
export type UniqueCron<MetaArgs> = {
    /**
     * Identifier for the unique cron job.
     */
    name: string;
    /**
     * Cron argument, e.g., "* * * * * *" for every second.
     */
    cron: string;
    /**
     * Function to be executed when the unique cron job is triggered.
     */
    exec: (cron: UniqueCron<MetaArgs>) => void;
    /**
     * Metadata for the unique cron job, for specific information.
     */
    metadata?: MetaArgs;
}

/**
 * Extended configuration interface for cron jobs, including a UUID.
 */
export interface CronsConfigurationsSystem<Metadata> extends CronsConfigurations<Metadata> {
    uuid: string;
}

/**
 * Class representing a collection of cron jobs.
 */
export class Crons<Metadata> {
    /**
     * Array containing all defined cron jobs.
     */
    public static all: Array<CronsConfigurationsSystem<InstanceType<typeof Crons>['data']['metadata']>> = [];
    /**
     * EventEmitter used for managing cron job events.
     */
    public static set = new EventEmitter();
    public static timeouts = new Map();

    /**
     * Starts the specified cron job.
     * @param cron - Configuration for the cron job.
     */
    public static start(cron: CronsConfigurationsSystem<InstanceType<typeof Crons>['data']['metadata']>) {
        let interval = cronParser.parseExpression(cron.cron);
        const nextScheduledTime = interval.next().getTime();
        const currentTime = Date.now();
        const delay = nextScheduledTime - currentTime;

        // Updates the interval and schedules the next execution
        this.timeouts.set(cron.uuid, setTimeout(() => {
            if (Internal.get("core:installed")) {
                Crons.set.emit(cron.uuid, cron, interval);
            }
            if (!cron.once) Crons.start(cron);
        }, delay));
    }

    /**
     * Configures unique cron jobs that run only once.
     * @return Returns the setTimeout ID, which can be used for cancellation.
     */
    public static once<MetaArgs>(cron: UniqueCron<MetaArgs>) {
        let interval = cronParser.parseExpression(cron.cron);
        const nextScheduledTime = interval.next().getTime();
        const currentTime = Date.now();
        const delay = nextScheduledTime - currentTime;

        // Schedules the unique cron job and logs success
        console.log(`| ${getTimestamp().currentHour} | ${colors.green("Unique Cron")} - ${colors.blue(cron.name)} added successfully.`);

        return setTimeout(() => {
            if (Internal.get("core:installed")) {
                cron.exec(cron);
            }
        }, delay);
    }

    /**
     * Updates or adds a cron job.
     * @param cron - Configuration for the cron job.
     */
    public static post(cron: CronsConfigurationsSystem<InstanceType<typeof Crons>['data']['metadata']>) {
        if (cron?.uuid) {
            const index = Crons.all.findIndex(c => c.uuid === cron.uuid);
            if (index !== -1) {
                if (cron === Crons.all[index]) return;
                Crons.all[index] = cron;
                console.log(`| ${getTimestamp().currentHour} | ${colors.green("Crons")} - ${colors.blue(cron.name)} | updated successfully.`);
            }
        } else {
            // Generates a new UUID if not provided
            const newcron = {
                ...cron,
                uuid: randomUUID().replaceAll("-", "")
            };
            newcron.once = cron.once ?? false;
            Crons.all.push(newcron);
            console.log(`| ${getTimestamp().currentHour} | ${colors.green("Crons")} - ${colors.blue(cron.name)} | added successfully.`);
        }
    }

    /**
     * Generates a cron expression for a specific date.
     * @param date - Expiration date.
     * @returns Returns the cron expression.
     */
    public static date(date: Date) {
        const seconds = date.getSeconds();
        const minutes = date.getMinutes();
        const hours = date.getHours();
        let dayOfMonth = date.getDate();
        let month = date.getMonth() + 1; // Months start from zero in JavaScript
        if (month === 13) {
            month = 12;
        }
        return `${seconds} ${minutes} ${hours} ${dayOfMonth} ${month} *`;
    }

    /**
     * Constructor for the Crons class.
     * @param data - Configuration for the cron job.
     */
    constructor(public data: CronsConfigurations<Metadata>) {
        console.log(`| ${getTimestamp().currentHour} | ${colors.green("Schedules")} - ${colors.blue(data.name)} | configured successfully.`);

        const cron = {
            ...data,
            uuid: randomUUID().replaceAll("-", "")
        };
        cron.once = data.once ?? false;
        Crons.all.push(cron as CronsConfigurationsSystem<InstanceType<typeof Crons>['data']['metadata']>);
    }
}
