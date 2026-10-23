"""Refresh PBS from the public source repository; Python 3 standard library only."""
import json,pathlib,urllib.request,concurrent.futures,re
ROOT=pathlib.Path(__file__).parent
API='https://api.github.com/repos/holykaito/Pokemon-Lightest-Platinum-v2024'
def fetch(url):
    req=urllib.request.Request(url,headers={'User-Agent':'Zenith-Dex-PBS-Importer','Accept':'application/vnd.github+json'})
    with urllib.request.urlopen(req,timeout=90) as r:return r.read()
listing=json.loads(fetch(API+'/contents/PBS'))
rows=[x for x in listing if x['type']=='file' and re.match(r'^(pokemon(?!_metrics)|moves|abilities|items|types|encounters|map_metadata|innate_sets|regional_dexes)',x['name']) and not x['name'].startswith('pokemonn_')]
(ROOT/'sources.json').write_text(json.dumps(rows,indent=2))
(ROOT/'pbs').mkdir(exist_ok=True)
def download(row):
    (ROOT/'pbs'/row['name']).write_bytes(fetch(row['download_url']));print(row['name'],flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:list(pool.map(download,rows))
active={x['name'] for x in rows}
# Remove only old source files recorded by this importer, never unrelated local files.
for p in (ROOT/'pbs').glob('*.txt'):
    if p.name not in active and re.match(r'^(pokemon|moves|abilities|items|types|encounters|map_metadata|innate_sets|regional_dexes)',p.name):p.unlink()
folders=json.loads(fetch(API+'/contents/Graphics/Pokemon'))
front=next(x for x in folders if x['name']=='Front')
sprites=json.loads(fetch(front['git_url']))
(ROOT/'sprites.json').write_text(json.dumps([x['path'] for x in sprites['tree']]))
print('Refresh complete. Run: python build_data.py')
