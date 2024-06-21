# TESTE DE CONSUMO DE FILAS COM RABBITMQ

## contract/api/added
link http://localhost:15672/#/queues/%2F/contract%2Fapi%2Fadded
```json
{
  "payload": {
    "id_contract": "550e8400-e29b-41d4-a716-446655440001",
    "modulos_added": [
      {
        "id_modulo": "550e8400-e29b-41d4-a716-446655440003",
        "modulo_name": "MODULO_EXAMPLE"
      }
    ]
  }
}
```

## contract/api/removed
link http://localhost:15672/#/queues/%2F/contract%2Fapi%2Fremoved
```json
{
  "payload": {
    "id_contract": "550e8400-e29b-41d4-a716-446655440001",
    "modulos_removed": [
      {
        "id_modulo": "550e8400-e29b-41d4-a716-446655440003",
        "modulo_name": "MODULO_EXAMPLE"
      }
    ]
  }
}
```