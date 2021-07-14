interface IAnalyticContent {
  themes: string[] | null
  topic : string
}

interface ICourse {
  code: string
  name: string
}

interface IGeneralInfo {
  condition       : string
  course          : ICourse
  credits         : number
  evaluationSystem: string
  hoursPerWeek    : {
    laboratory: number | null
    practice  : number | null
    theory    : number
    total     : number
  }
  preRequirements: ICourse[] | null
}

interface IBibliographyAndRating {
  category: 'blog' | 'tutorial' | 'paper' | 'book' | null
  name    : string
  rates   : number
  rating  : number
}

interface ISyllabus {
  analyticProgram?: IAnalyticContent[]
  bibliography?   : IBibliographyAndRating[]
  competencies?   : string[]
  generalInfo     : IGeneralInfo
  icon?           : string
  sommelier       : string
}

export { ISyllabus }
