export const plugin = (args: any) => {
  console.log(args)
}

plugin.help = `
      plugin\t进行插件操作（add 添加，rm 移除，on 启用，off 禁用）`
