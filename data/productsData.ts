import type { Product } from "./types.ts";
import { piman } from "./products/piman.ts";
import { chooseChart } from "./products/choose-chart.ts";
import { scout } from "./products/scout.ts";
import { bpgcms } from "./products/bpgcms.ts";
import { vitalCrmNew } from "./products/vital-crm-new.ts";
import { vitalTtc } from "./products/vital-ttc.ts";
import { vitalsEspSurvey } from "./products/vitals-esp-survey.ts";
import { vitalUiKit } from "./products/vital-ui-kit.ts";
import { mpos } from "./products/mpos.ts";
import { vitalCrmApp } from "./products/vital-crm-app.ts";
import { accesserty } from "./products/accesserty.ts";
import { workether } from "./products/workether.ts";
import { poinfo } from "./products/poinfo.ts";
import { twoPick1 } from "./products/2pick1.ts";
import { dahtahdoc } from "./products/dahtahdoc.ts";

export const productsData: Product[] = [
  piman,
  chooseChart,
  scout,
  bpgcms,
  vitalCrmNew,
  vitalTtc,
  vitalsEspSurvey,
  vitalUiKit,
  mpos,
  vitalCrmApp,
  accesserty,
  workether,
  poinfo,
  twoPick1,
  dahtahdoc,
];
