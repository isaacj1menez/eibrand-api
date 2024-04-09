import ModuleAlias from 'module-alias';

export const fixModuleAlias = (dirName: string) => {
    ModuleAlias.addAliases({
        '@base': dirName,
        '@api': dirName + '/api',
    });
}
