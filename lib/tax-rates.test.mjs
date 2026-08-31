import { applySlabs, BUSINESS_SLABS, SALARIED_SLABS, itExportTax, formatPkr } from './tax-rates.ts';

const cases = [
  // [income, expectedBusinessTax, note]
  [500_000, 0, 'below threshold'],
  [600_000, 0, 'exactly at threshold'],
  [1_200_000, 90_000, 'top of 15% band: 600k*0.15'],
  [1_600_000, 170_000, 'top of 20% band: 90k+400k*0.20'],
  [3_200_000, 650_000, 'top of 30% band: 170k+1.6m*0.30'],
  [5_600_000, 1_610_000, 'top of 40% band: 650k+2.4m*0.40'],
  [10_000_000, 1_610_000 + 4_400_000*0.45, 'in 45% band, no surcharge at exactly 10m'],
];
let bad = 0;
for (const [inc, exp, note] of cases) {
  const r = applySlabs(inc, BUSINESS_SLABS, { surcharge: true });
  const ok = r.total === exp;
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${String(inc).padStart(10)} -> ${String(r.total).padStart(10)} (expected ${exp})  ${note}`);
}

// surcharge kicks in above 10m
const over = applySlabs(12_000_000, BUSINESS_SLABS, { surcharge: true });
const baseTax = 1_610_000 + (12_000_000-5_600_000)*0.45;
const expTotal = baseTax + baseTax*0.10;
console.log(`${over.total===expTotal?'ok  ':'FAIL'} surcharge @12m -> ${over.total} (expected ${expTotal})`);
if (over.total!==expTotal) bad++;

// salaried sanity
const sal = applySlabs(7_000_000, SALARIED_SLABS);
console.log(`${sal.total===1_424_000?'ok  ':'FAIL'} salaried @7m -> ${sal.total} (expected 1424000)`);
if (sal.total!==1_424_000) bad++;

// monotonic: tax must never decrease as income rises
let prev=-1, mono=true;
for (let i=0;i<=15_000_000;i+=25_000){ const t=applySlabs(i,BUSINESS_SLABS,{surcharge:true}).total; if(t<prev){mono=false;console.log('NON-MONOTONIC at',i);break;} prev=t; }
console.log(`${mono?'ok  ':'FAIL'} tax is monotonic across 0..15m`);
if(!mono) bad++;

// no band should ever tax >100% of the marginal rupee
let cliff=null;
for (let i=600_000;i<=15_000_000;i+=1000){
  const a=applySlabs(i,BUSINESS_SLABS,{surcharge:true}).total;
  const b=applySlabs(i+1000,BUSINESS_SLABS,{surcharge:true}).total;
  if (b-a > 1000){ cliff={i,jump:b-a}; break; }
}
console.log(cliff? `WARN cliff at ${cliff.i}: +1000 income costs ${cliff.jump} tax` : 'ok   no band where extra income loses you money');

// IT export
const e1=itExportTax(10_000_000,true), e2=itExportTax(10_000_000,false);
console.log(`${e1.tax===25_000?'ok  ':'FAIL'} PSEB 0.25% on 10m -> ${e1.tax} (expected 25000)`);
console.log(`${e2.tax===100_000?'ok  ':'FAIL'} non-PSEB 1% on 10m -> ${e2.tax} (expected 100000)`);
if(e1.tax!==25_000||e2.tax!==100_000) bad++;

console.log('\n'+(bad?`${bad} FAILURES`:'all checks passed'));
