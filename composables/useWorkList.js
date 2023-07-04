import { works } from '@/assets/data/works'
import { worksEn } from '@/assets/data/worksEn'
const sortByStartYear = (a, b) => new Date(a.StartYear).getTime() - new Date(b.startYear).getTime();


export default function () {
  const { locale } = useI18n()
  let workList = ref()
  if (locale.value === "en") {
    workList = worksEn.sort(sortByStartYear)
  }
  else {
    workList = works.sort(sortByStartYear)
  }
  return {
    workList
  }
}
