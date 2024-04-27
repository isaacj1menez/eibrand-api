import { appConfig } from '../config/app';
import { Glob } from 'glob';

export const loadEventDispatcher = async () => {
    const patterns = appConfig.path + appConfig.eventsDir;

    const glob = new Glob(patterns, {})
    for await (const file of glob) {
        require(file);
    }
}