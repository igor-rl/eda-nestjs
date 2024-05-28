# TESTE DE CONSUMO DE FILAS COM RABBITMQ

## user-permission/created
link http://localhost:15672/#/queues/%2F/user-permission%2Fcreated
```json
{
  "payload": {
    "id_user_permission": "550e8400-e29b-41d4-a716-446655440000",
    "id_contract": "550e8400-e29b-41d4-a716-446655440001",
    "id_user": "550e8400-e29b-41d4-a716-446655440002",
    "id_permission": "0",
    "id_api": "550e8400-e29b-41d4-a716-446655440003",
    "api_name": "EX_API_EXAMPLE",
    "is_active": true
  }
}
```

## user-permission/removed
link http://localhost:15672/#/queues/%2F/user-permission%2Fremoved
```json
{
  "payload": {
    "id_user_permission": "550e8400-e29b-41d4-a716-446655440000",
    "api_name": "EX_API_EXAMPLE"
  }
}
```