import { CronController, Cron } from 'cron-decorators';
import { Service } from 'typedi';

@Service()
@CronController()
export class ExampleCronJob {
    @Cron('10sec', '*/10 * * * * *')
    public async handle(): Promise<void> {
        console.log('I am a cron job and I just ran!');
    }
}