import gse from 'general-search-engine'

import { DtoSearch } from '../dto-interfaces'
import { ISearchResult } from '../models'
import { GE, errorHandling } from './utils'

type Process = {
  type: 'query'
}

class Search {
  private _args: DtoSearch | null

  constructor(args: DtoSearch | null = null) {
    this._args = args
  }

  // eslint-disable-next-line consistent-return
  public process({ type }: Process): Promise<ISearchResult[]> {
    // eslint-disable-next-line default-case
    switch (type) {
      case 'query':
        return this._query()
    }
  }

  private async _query(): Promise<ISearchResult[]> {
    const { keyWord, query } = this._args as DtoSearch

    try {
      // eslint-disable-next-line new-cap
      const petition = new gse.search()
        .setType('search')
        .setQuery(`${query}${keyWord !== 'all' ? keyWord : '' }`)
        .setOptions({ language: 'en' })
      const result = await petition.run()

      return result as ISearchResult[]
    } catch (e) {
      return errorHandling(e, GE.INTERNAL_SERVER_ERROR)
    }
  }
}

export { Search }
