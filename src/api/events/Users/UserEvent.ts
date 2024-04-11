import { emailQueue } from '@base/api/jobs/Users/SendWelcomeMail';
import { EventSubscriber, On } from 'event-dispatch';

@EventSubscriber()
export class UserEvent {
    @On('onUserRegister')
    public onUserRegister(user: any) {
        emailQueue.add('send-email-welcome', {
            to: 'josue.isaacjl@gmail.com',
            subject: 'Welcome to our app!',
            text: 'Thanks for sing up!'
        });
    }

    @On('onUserCreate')
    public onUserCreate(user: any) {
        console.log('User ' + user.email + ' created!');
    }
}