# Docs API v1.0 - Equipo 05
## Sesión

#### POST /sesion/
Crea una sesión en el servidor.

##### Body:

```
username* - string
password* - string
```
##### Respuestas:

- 200 OK

```
{
    "id": 1
    "nombre": "admin"
    "rol": "admin"
}
```

- 401 Unauthorized

#### GET /sesion/
Devuelve una sesión de el servidor.

##### Respuestas:

- 200 OK

```
{
    "id": 1
    "nombre": "admin"
    "rol": "admin"
}
```

- 404 Not Found

#### DELETE /sesion/
Elimina una sesión en el servidor.

##### Respuestas:

- 200 OK
