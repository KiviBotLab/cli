import path from 'node:path'
import fs from 'fs-extra'

import { NodeModulesDir } from '@/path'

export function checkModule(moduleName: string) {
  return fs.existsSync(path.join(NodeModulesDir, moduleName))
}
