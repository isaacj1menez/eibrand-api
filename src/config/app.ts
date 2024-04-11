import { getEnvVariable } from "@base/utils/env";

const getAppPath = () => {
    return __dirname.replace('/config', '');
}

export const appConfig = {
    port: Number(getEnvVariable('APP_PORT')),
    path: getAppPath(),
    controllersDir: getEnvVariable('CONTROLLERS_DIR'),
    eventsDir: getEnvVariable('EVENTS_DIR'),
    cronJobsEnabled: getEnvVariable('ENABLE_CRON_JOBS'),
    cronJobsDir: getEnvVariable('CRON_JOBS_DIR'),
    routePrefix: getEnvVariable('APP_ROUTE_PREFIX'),
}