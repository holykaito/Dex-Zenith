/* Pure calculations for Zenith; damage rounds like Essentials Move_UsageCalculations.rb.
   A range is one successful hit; accuracy, secondary effects, turns and recoil are separate. */
(function(root){
'use strict';
const list=v=>String(v||'').split(',').map(x=>x.trim()).filter(Boolean);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number(v)||0));
function effectiveness(type,defTypes,types){return defTypes.reduce((m,t)=>{const d=types.find(x=>x.id===t);if(!d)return m;if(list(d.Immunities).includes(type))return 0;return m*(list(d.Weaknesses).includes(type)?2:list(d.Resistances).includes(type)?.5:1);},1);}
const natures={Hardy:[-1,-1],Lonely:[1,2],Brave:[1,5],Adamant:[1,3],Naughty:[1,4],Bold:[2,1],Docile:[-1,-1],Relaxed:[2,5],Impish:[2,3],Lax:[2,4],Timid:[5,1],Hasty:[5,2],Serious:[-1,-1],Jolly:[5,3],Naive:[5,4],Modest:[3,1],Mild:[3,2],Quiet:[3,5],Bashful:[-1,-1],Rash:[3,4],Calm:[4,1],Gentle:[4,2],Sassy:[4,5],Careful:[4,3],Quirky:[-1,-1]};
function stats(p,s){const level=clamp(s.level,1,100),nature=natures[s.nature]||natures.Hardy;return p.stats.map((b,i)=>{if(i===0&&p.id==='SHEDINJA')return 1;let n=Math.floor((2*b+clamp(s.iv?.[i]??31,0,31)+Math.floor(clamp(s.ev?.[i],0,252)/4))*level/100);if(!i)return n+level+10;return Math.floor((n+5)*(nature[0]===i?1.1:nature[1]===i?.9:1));});}
function stage(v,n){n=clamp(n,-6,6);return Math.floor(v*(n>=0?(2+n)/2:2/(2-n)));}
const supportedAbilities=new Set(['ADAPTABILITY','HUGEPOWER','PUREPOWER','HUSTLE','GUTS','TECHNICIAN','IRONFIST','STRONGJAW','MEGALAUNCHER','TOUGHCLAWS','SHEERFORCE','SNIPER','TINTEDLENS','MOLDBREAKER','TERAVOLT','TURBOBLAZE','UNAWARE','LEVITATE','WATERABSORB','VOLTABSORB','MOTORDRIVE','LIGHTNINGROD','STORMDRAIN','FLASHFIRE','SAPSIPPER','WONDERGUARD','FILTER','SOLIDROCK','THICKFLOSS','THICKFAT','FURCOAT','FLUFFY','GRANDMANE','BIGPECKS','SOUNDPROOF','BULLETPROOF','OVERCOAT','INFILTRATOR','BATTLEARMOR','SHELLARMOR']);
const typedItems={SILKSCARF:'NORMAL',CHARCOAL:'FIRE',MYSTICWATER:'WATER',MIRACLESEED:'GRASS',MAGNET:'ELECTRIC',NEVERMELTICE:'ICE',BLACKBELT:'FIGHTING',POISONBARB:'POISON',SOFTSAND:'GROUND',SHARPBEAK:'FLYING',TWISTEDSPOON:'PSYCHIC',SILVERPOWDER:'BUG',HARDSTONE:'ROCK',SPELLTAG:'GHOST',DRAGONFANG:'DRAGON',BLACKGLASSES:'DARK',METALCOAT:'STEEL',PIXIEPLATE:'FAIRY',FLAMEPLATE:'FIRE',SPLASHPLATE:'WATER',MEADOWPLATE:'GRASS',ZAPPLATE:'ELECTRIC',ICICLEPLATE:'ICE',FISTPLATE:'FIGHTING',TOXICPLATE:'POISON',EARTHPLATE:'GROUND',SKYPLATE:'FLYING',MINDPLATE:'PSYCHIC',INSECTPLATE:'BUG',STONEPLATE:'ROCK',SPOOKYPLATE:'GHOST',DRACOPLATE:'DRAGON',DREADPLATE:'DARK',IRONPLATE:'STEEL'};
const supportedItems=new Set(['LIFEORB','CHOICEBAND','CHOICESPECS','MUSCLEBAND','WISEGLASSES','EXPERTBELT','ASSAULTVEST','EVIOLITE','LIGHTBALL',...Object.keys(typedItems)]);
function calculate(data,a,d,move,field={}){
 const p=data.pokemon.find(x=>x.id===a.id),q=data.pokemon.find(x=>x.id===d.id);if(!p||!q||!move)return {error:'selection'};
 const warnings=[],ap=[...new Set([a.ability,...(a.innates||[])].filter(Boolean))],dp=[...new Set([d.ability,...(d.innates||[])].filter(Boolean))];
 for(const id of [...ap,...dp])if(!supportedAbilities.has(id))warnings.push({kind:'ability',id});
 for(const id of [a.item,d.item].filter(Boolean))if(!supportedItems.has(id))warnings.push({kind:'item',id});
 const ast=stats(p,a),dst=stats(q,d),hp=dst[0],currentHP=Math.max(1,Math.floor(hp*clamp(d.hp??100,1,100)/100)),physical=move.Category==='Physical',power=Number(move.Power)||0;
 const evInvalid=[a,d].some(s=>(s.ev||[]).reduce((x,n)=>x+Number(n||0),0)>510);if(evInvalid)warnings.push({kind:'ev',id:'510'});
 if(move.Category==='Status')return {status:true,hp,currentHP,warnings};
 const fn=move.FunctionCode||'';
 const overrides=!!a.powerOverride&&Number(a.powerOverride)>0;
 const fixed={FixedDamage20:20,FixedDamage40:40,FixedDamageUserLevel:Number(a.level)};
 let fixedDamage=fixed[fn];
 if((power<=1||/OHKO|Counter|Bide|FixedDamage|LowerTargetHPToUserHP|UserFaintsFixedDamage/.test(fn))&&!overrides&&fixedDamage===undefined)return {unsupportedMove:true,hp,currentHP,warnings:[...warnings,{kind:'move',id:move.id}]};
 if(!['None','Basic',''].includes(fn)&&fixedDamage===undefined)warnings.push({kind:'move',id:move.id});
 const has=id=>ap.includes(id),ignore=has('MOLDBREAKER')||has('TERAVOLT')||has('TURBOBLAZE')||fn==='IgnoreTargetAbility',def=id=>!ignore&&dp.includes(id),flags=list(move.Flags),flag=x=>flags.includes(x),type=move.Type;
 let eff=effectiveness(type,q.types,data.types),immune=null;
 const immunities=[['LEVITATE','GROUND'],['WATERABSORB','WATER'],['STORMDRAIN','WATER'],['VOLTABSORB','ELECTRIC'],['MOTORDRIVE','ELECTRIC'],['LIGHTNINGROD','ELECTRIC'],['FLASHFIRE','FIRE'],['SAPSIPPER','GRASS']];
 for(const [id,t] of immunities)if(def(id)&&type===t)immune=id;
 if(def('WONDERGUARD')&&eff<=1)immune='WONDERGUARD';if(def('SOUNDPROOF')&&flag('Sound'))immune='SOUNDPROOF';if(def('BULLETPROOF')&&flag('Bomb'))immune='BULLETPROOF';if(def('OVERCOAT')&&flag('Powder'))immune='OVERCOAT';
 if(immune)eff=0;
 if(!eff)return {min:0,max:0,rolls:Array(16).fill(0),hp,currentHP,effectiveness:0,immune,warnings};
 if(fixedDamage!==undefined&&!overrides)return {min:fixedDamage,max:fixedDamage,rolls:Array(16).fill(fixedDamage),hp,currentHP,effectiveness:eff,warnings,fixed:true};
 let critical=(!!field.critical||fn==='AlwaysCriticalHit')&&(ignore||!(dp.includes('BATTLEARMOR')||dp.includes('SHELLARMOR')));
 let ai=physical?1:3,di=physical?2:4;
 if(fn==='UseTargetDefenseInsteadOfTargetSpDef')di=2;
 if(fn==='UseUserDefenseInsteadOfUserAttack')ai=2;
 let attackStage=Number(a.stages?.[ai]||0),defStage=Number(d.stages?.[di]||0);
 if(def('UNAWARE'))attackStage=0;if(has('UNAWARE'))defStage=0;
 if(fn==='IgnoreTargetDefSpDefEvaStatStages')defStage=0;
 if(critical){attackStage=Math.max(0,attackStage);defStage=Math.min(0,defStage);}
 let atk=stage(ast[ai],attackStage),defense=stage(dst[di],defStage),pw=overrides?Number(a.powerOverride):power,pm=1,am=1,dm=1,fm=1,applied=[];
 const effect=(id,bucket,factor)=>{if(factor===1)return;applied.push(id+' ×'+factor);if(bucket==='p')pm*=factor;else if(bucket==='a')am*=factor;else if(bucket==='d')dm*=factor;else fm*=factor;};
 for(const id of ap){
  if(['HUGEPOWER','PUREPOWER'].includes(id)&&physical)effect(id,'a',2);
  if(id==='HUSTLE'&&physical)effect(id,'a',1.5);
  if(id==='GUTS'&&a.status&&physical)effect(id,'a',1.5);
  if(id==='TECHNICIAN'&&pw*pm<=60)effect(id,'p',1.5);
  if(id==='IRONFIST'&&flag('Punching'))effect(id,'p',1.2);
  if(id==='STRONGJAW'&&flag('Biting'))effect(id,'p',1.5);
  if(id==='MEGALAUNCHER'&&flag('Pulse'))effect(id,'p',1.5);
  if(id==='TOUGHCLAWS'&&flag('Contact'))effect(id,'p',1.3);
  if(id==='BIGPECKS'&&flag('Contact'))effect(id,'f',1.15);
  if(id==='SHEERFORCE'&&Number(move.EffectChance)>0)effect(id,'p',1.3);
  if(id==='SNIPER'&&critical)effect(id,'f',1.5);
  if(id==='TINTEDLENS'&&eff<1)effect(id,'f',2);
 }
 if(!ignore)for(const id of dp){
  if(['FILTER','SOLIDROCK','THICKFLOSS'].includes(id)&&eff>1)effect(id,'f',.75);
  if(id==='THICKFAT'&&['FIRE','ICE'].includes(type))effect(id,'p',.5);
  if(id==='FURCOAT'&&di===2)effect(id,'d',2);
  if(id==='FLUFFY'){if(flag('Contact'))effect(id,'f',.5);if(type==='FIRE')effect(id,'f',2);}
  if(id==='GRANDMANE'){if(flag('Contact'))effect(id,'f',.5);if(flag('Wind'))effect(id,'f',2);}
 }
 if(a.item==='CHOICEBAND'&&physical)effect(a.item,'p',1.5);
 if(a.item==='CHOICESPECS'&&!physical)effect(a.item,'p',1.5);
 if(a.item==='MUSCLEBAND'&&physical)effect(a.item,'p',1.1);
 if(a.item==='WISEGLASSES'&&!physical)effect(a.item,'p',1.1);
 if(a.item==='LIGHTBALL'&&(p.base||p.id)==='PIKACHU')effect(a.item,'a',2);
 if(a.item==='LIFEORB')effect(a.item,'f',1.3);
 if(a.item==='EXPERTBELT'&&eff>1)effect(a.item,'f',1.2);
 if(typedItems[a.item]===type)effect(a.item,'p',1.2);
 if(d.item==='ASSAULTVEST'&&di===4)effect(d.item,'d',1.5);
 if(d.item==='EVIOLITE'&&q.evolutions?.length)effect(d.item,'d',1.5);
 if(field.weather==='Sandstorm'&&q.types.includes('ROCK')&&di===4)dm*=1.5;
 if(field.weather==='Sun'){if(type==='FIRE')fm*=1.5;if(type==='WATER')fm*=.5;}
 if(field.weather==='Rain'){if(type==='WATER')fm*=1.5;if(type==='FIRE')fm*=.5;}
 const grounded=x=>!x.types.includes('FLYING');
 const terrainType={Electric:'ELECTRIC',Grassy:'GRASS',Psychic:'PSYCHIC',Misty:'FAIRY'}[field.terrain];
 if(type===terrainType&&grounded(p)&&!has('LEVITATE'))pm*=1.3;
 if(field.terrain==='Misty'&&type==='DRAGON'&&grounded(q)&&!dp.includes('LEVITATE'))pm*=.5;
 if(critical)fm*=1.5;
 if(p.types.includes(type))fm*=has('ADAPTABILITY')?2:1.5;
 fm*=eff;
 if(a.status==='BURN'&&physical&&!has('GUTS'))fm*=.5;
 if(field.spread)fm*=.75;
 if(field.screen&&!critical&&!has('INFILTRATOR'))fm*=field.doubles?2/3:.5;
 pw=Math.max(1,Math.round(pw*pm));atk=Math.max(1,Math.round(atk*am));defense=Math.max(1,Math.round(defense*dm));
 const base=Math.floor(Math.floor(Math.floor(2*clamp(a.level,1,100)/5+2)*pw*atk/defense)/50)+2;
 const rolls=Array.from({length:16},(_,i)=>Math.max(1,Math.round(base*fm*(85+i)/100)));
 return {min:rolls[0],max:rolls[15],rolls,hp,currentHP,effectiveness:eff,atk,defense,power:pw,warnings,applied,critical};
}
root.ZenithMath={effectiveness,stats,stage,natures,calculate,supportedAbilities,supportedItems,list};
})(globalThis);
