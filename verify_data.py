import json,pathlib
D=json.loads((pathlib.Path(__file__).parent/'docs/data/zenith.json').read_text())
p={x['id']:x for x in D['pokemon']};m={x['id']:x for x in D['moves']}
assert p['BULBASAUR']['stats']==[45,49,49,65,65,45], 'PBS stat order conversion'
assert p['VENUSAUR_1']['types']==p['VENUSAUR']['types'], 'Form inheritance'
assert p['VENUSAUR_1']['stats']==[80,100,123,122,120,80], 'Form overrides'
assert p['PIDGEOT']['innates']==['THICKFLOSS','KEENEYE','TANGLEDFEET'], 'Innate lookup'
assert any(x['level']==0 and x['move']=='POISONJAB' for x in p['TOXICROAK']['learnset']), 'Evolution move'
assert all(x['Move'] in m for x in D['items'] if x.get('Move')), 'Machine links'
for a in D['encounters']:
 for method in a['methods']:
  assert abs(sum(s['chance'] for s in method['slots'])-100)<.2, 'Encounter weight normalization'
  assert all(s['min']<=s['max'] for s in method['slots'])
  assert all(s['pokemon'] in p for s in method['slots']), 'Encounter links'
assert len(D['sprites'])>1500
print('Verified: stat order, form inheritance, innates, evolution moves, TM links, encounters, sprite index.')
