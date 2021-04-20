export default interface ConfigType {
  branches: {
    main: string
    develop?: string
    release?: string
    hotfix?: string
  }
}
