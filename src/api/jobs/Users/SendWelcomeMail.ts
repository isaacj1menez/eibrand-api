import { registerQueue } from "@base/core/abstracts/QueueJobBase"
import { Job } from "bullmq"

export const emailQueue = registerQueue(
    "email",
    async (job: Job) => {
        console.log(job.data);
    },
)