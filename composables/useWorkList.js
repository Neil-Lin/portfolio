import { works } from '@/assets/data/works'
export default function () {
  const workList = works.sort(sortByStartYear)

  function sortByStartYear(a, b) {
    return new Date(a.StartYear).getTime() - new Date(b.startYear).getTime()
  }

  return {
    workList
  }
}
