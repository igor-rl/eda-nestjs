# TESTE DE CONSUMO DE FILAS COM RABBITMQ

## contract/api/added
link http://localhost:15672/#/queues/%2F/contract%2Fapi%2Fadded
```json
{
  "payload": {
    "id_contract": "550e8400-e29b-41d4-a716-446655440001",
    "apis_added": [
      {
        "id_api": "550e8400-e29b-41d4-a716-446655440003",
        "api_name": "EX_API_EXAMPLE"
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
    "apis_removed": [
      {
        "id_api": "550e8400-e29b-41d4-a716-446655440003",
        "api_name": "EX_API_EXAMPLE"
      }
    ]
  }
}
```