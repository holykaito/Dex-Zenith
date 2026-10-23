import pathlib,json,re,csv,datetime,hashlib
ROOT=pathlib.Path(__file__).parent
P=ROOT/'pbs'
def records(path):
    out=[]; row=None
    for line in path.read_text(encoding='utf-8-sig').splitlines():
        line=line.strip()
        if not line or line.startswith('#'):continue
        m=re.match(r'^\[([^\]]+)\]',line)
        if m:
            row={'id':m[1].replace(' ','').replace(',','_'),'source':path.name};out.append(row)
        elif row is not None and '=' in line:
            k,v=line.split('=',1);row[k.strip()]=v.strip()
    return out
def merge(prefix):
    out={}
    files=sorted(P.glob(prefix+'*.txt'),key=lambda p:(p.name!=prefix+'.txt',p.name))
    for p in files:
        for r in records(p):out[r['id']]={**out.get(r['id'],{}),**r}
    return out
def split(v):return [x.strip() for x in (v or '').split(',') if x.strip()]
species={}
for path in sorted(P.glob('pokemon*.txt'),key=lambda p:(p.name!='pokemon.txt',p.name)):
    if path.name.startswith(('pokemon_forms','pokemon_metrics','pokemonn_')):continue
    for r in records(path):species[r['id']]={**species.get(r['id'],{}),**r}
baseids=list(species)
for path in sorted(P.glob('pokemon_forms*.txt')):
    for r in records(path):
        base=r['id'].rsplit('_',1)[0]
        species[r['id']]={**species.get(base,{}),**r,'base':base}
innates={r['id']:split(r.get('Innates')) for r in records(P/'innate_sets.txt')}
for i,(key,r) in enumerate(species.items()):
    r['dex']=baseids.index(r.get('base',key))+1 if r.get('base',key) in baseids else i+1
    r['innates']=innates.get(key,[])
    raw=split(r.get('Moves'));r['learnset']=[{'level':int(raw[i]),'move':raw[i+1]} for i in range(0,len(raw)-1,2)]
    st=[int(x) for x in split(r.get('BaseStats'))];r['stats']=[st[j] for j in [0,1,2,4,5,3]] if len(st)==6 else [0]*6
    r['bst']=sum(st)
    r['types']=split(r.get('Types'));r['abilities']=split(r.get('Abilities'));r['hidden']=split(r.get('HiddenAbilities'));r['tutor']=split(r.get('TutorMoves'));r['egg']=split(r.get('EggMoves'))
    ev=split(r.get('Evolutions'));r['evolutions']=[ev[j:j+3] for j in range(0,len(ev),3)]
    form=r.get('FormName','');name=r.get('Name',key)
    r['displayName']=(form if name.lower() in form.lower() else name+' · '+form) if form else name
maps=merge('map_metadata');encounters=[];area=None;method=None
for path in sorted(P.glob('encounters*.txt')):
    for line in path.read_text(encoding='utf-8-sig').splitlines():
        m=re.match(r'^\s*\[([^\]]+)\]\s*(?:#\s*(.*))?',line)
        if m:
            keys=m[1].split(',');mid=str(int(keys[0]));version=int(keys[1]) if len(keys)>1 else 0
            meta=maps.get(keys[0],maps.get(mid,{}))
            # PBS map keys are often zero-padded.
            if not meta:meta=next((v for k,v in maps.items() if k.isdigit() and int(k)==int(mid)),{})
            area={'id':mid+'_'+str(version),'map':int(mid),'version':version,'name':meta.get('Name') or m[2] or 'Map '+mid,'methods':[]};encounters.append(area);method=None;continue
        line=line.split('#',1)[0].strip()
        if not line or area is None:continue
        parts=split(line)
        if not parts[0].isdigit():
            method={'name':parts[0],'rate':int(parts[1]) if len(parts)>1 else None,'slots':[]};area['methods'].append(method)
        elif method and len(parts)>=3:
            method['slots'].append({'weight':int(parts[0]),'pokemon':parts[1],'min':int(parts[2]),'max':int(parts[3]) if len(parts)>3 else int(parts[2])})
for a in encounters:
    for m in a['methods']:
        total=sum(s['weight'] for s in m['slots'])
        for s in m['slots']:s['chance']=round(100*s['weight']/total,2) if total else 0
D={'pokemon':list(species.values()),'moves':list(merge('moves').values()),'abilities':list(merge('abilities').values()),'items':list(merge('items').values()),'types':list(merge('types').values()),'encounters':encounters,'meta':{'repo':'holykaito/Pokemon-Lightest-Platinum-v2024','updated':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=7))).date().isoformat(),'sources':[{'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(P.glob('*.txt')) if not p.name.startswith('pokemonn_')],'notes':['Descriptions reflect PBS, not a simulation of Ruby battle effects.','Item and TM map locations are not supplied by PBS.']}}
sprites={}
for filename in json.loads((ROOT/'sprites.json').read_text()):
    f=pathlib.Path(filename)
    if f.suffix.lower() in ['.png','.gif']:sprites.setdefault(f.stem,filename)
D['sprites']=sprites
(ROOT/'docs/data/zenith.json').write_text(json.dumps(D,ensure_ascii=False,separators=(',',':')),encoding='utf8')
print({k:len(v) for k,v in D.items() if isinstance(v,list)})
print('Forms',sum('base' in x for x in species.values()))
# Unknown custom references remain visible by ID instead of being silently removed.
moveids={r['id'] for r in D['moves']};abilityids={r['id'] for r in D['abilities']}
print('Missing move references',sorted({v for p in species.values() for v in [*[x['move'] for x in p['learnset']],*p['tutor'],*p['egg']] if v not in moveids}))
print('Missing ability references',sorted({v for p in species.values() for v in [*p['abilities'],*p['hidden'],*p['innates']] if v not in abilityids}))
