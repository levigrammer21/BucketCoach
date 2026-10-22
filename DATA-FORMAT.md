# Collection example

```json
{
  "teamName": "Your team",
  "games": [{
    "id": "unique-game-id",
    "date": "2026-10-22",
    "opponent": "Visitors",
    "runs": 4,
    "allowed": 2,
    "source": "Your accessible box score",
    "partial": false,
    "batting": [{"name":"Player A","number":"7","ab":4,"h":2,"bb":1,"hbp":0,"sf":0,"doubles":1,"triples":0,"hr":0}],
    "pitching": [{"name":"Player B","number":"4","ip":3.2,"h":2,"er":1,"bb":1,"so":4,"bf":14}],
    "contacts": [{"name":"Player A","number":"7","x":35,"y":45,"type":"LD","outcome":"HIT","source":"Observed manually"}]
  }]
}
```

This is example data, not Outlaws evidence. See README.md for full import semantics.
