import { getEnvVariable } from "@base/utils/env";

const getAppPath = () => {
    return __dirname.replace('/config', '');
}

export const appConfig = {
    port: Number(getEnvVariable('APP_PORT')),
    path: getAppPath(),
    controllersDir: getEnvVariable('CONTROLLERS_DIR')
}