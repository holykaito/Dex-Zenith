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

V=json.loads((pathlib.Path(__file__).parent/'docs/data/vi.json').read_text())
assert V['pokemon']['BULBASAUR'].startswith('Có thể thấy Bulbasaur'), 'Dex Vietnamese translation'
assert V['abilities']['OVERGROW']=='Tăng sức mạnh chiêu hệ Cỏ khi HP xuống thấp.', 'Ability translation'
assert '20 HP' in V['items']['POTION'], 'Item translation'
assert 'DUSTSTORM' not in V['moves'], 'No substitution of outdated translations'
machines=[x for x in D['items'] if x.get('Move') and x.get('FieldUse') in ['TM','HM','TR'] and 'ZCrystal' not in x.get('Flags','').split(',')]
assert len(machines)==233 and not any('ZCrystal' in x.get('Flags','') for x in machines), 'Machine classification'
assert V['pockets']['vi']['2']=='Thuốc' and V['pockets']['en']['9']=='Z-Crystals'
print('Verified: Vietnamese descriptions, unmatched translation fallback, machine classification, pocket names.')

assert D['innateUnlocks']['PIDGEOT']==[1,15,50], 'Species unlock levels'
assert D['innateUnlocks']['TOXICROAK']==[1,25,60], 'Species unlock levels'
assert all(not x.get('GmaxMove') and 'gigantamax' not in x.get('FormName','').lower() for x in D['pokemon']), 'Exclude Gigantamax'
assert D['sprites']['GROTLE']=='GROTLE.png' and D['sprites']['GLAMEOW']=='GLAMEOW.png', 'PNG fallback inventory'
assert 'GROTLE.png' in D['spriteFiles'] and 'GLAMEOW.png' in D['spriteFiles']
print('Verified: explicit Innate levels, Gigantamax exclusion, current PNG sprite inventory.')

assert all(x['bst']==sum(x['stats']) for x in D['pokemon']), 'BST matches six base stats'
print('Verified: BST totals for every Pokémon/form.')
