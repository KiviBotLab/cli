import { join } from 'node:path'

export const CWD = process.cwd()

export const ConfPath = join(process.cwd(), 'kivi.json')
export const AppPath = join(process.cwd(), 'app.js')
export const PkgPath = join(process.cwd(), 'package.json')
export const NpmConfPath = join(process.cwd(), '.npmrc')

export const NodeModulesDir = join(process.cwd(), 'node_modules')
export const DataDir = join(process.cwd(), 'data')
export const OicqDataDir = join(process.cwd(), 'data/oicq')
export const PluginDir = join(process.cwd(), 'plugins')
export const LogDir = join(process.cwd(), 'logs')
