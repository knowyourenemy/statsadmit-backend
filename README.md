## Create Account

### POST localhost:8000/api/user

### Request body:

```{json}
{
    username: string,
    password: string,
    email: string
}
```

## Login

### POST localhost:8000/api/user/login

### Request body:

```{json}
{
    username: string,
    password: string,
}
```

## Logout

### DELETE localhost:8000/api/user/logout

### Remarks:

- User needs to be logged in

## Create Profile

### POST localhost:8000/api/profile

### Request Body

```{json}
{
    price: number,
    schoolAdmitted: string,
    schoolCountry: string,
    essayResponses: [
        {
            question: string,
            response: string,
        },
    ],
    testScores: [
        {
            test: string,
            score: string
        },
    ]
}
```

### Response Body

```{json}
{
    profileId: string
}
```

### Remarks:

- User needs to be logged in

## Get Profile

### GET localhost:8000/api/profile/:profileId

### Response Body

```{json}
{
    profileId: string,
    userId: string,
    userName: string,
    dateCreated: number,
    price: number,
    schoolAdmitted: string,
    schoolCountry: string,
    purchaseCount: number,
    essayResponses: [
        {
            question: string,
            response: string,
        },
    ],
    testScores: [
        {
            test: string,
            score: string
        },
    ],
    published: boolean
}
```

### Remarks:

- User needs to be logged in
- If profile has not been unlocked by the user or is not owned by the user, the essay responses and test scores will be redacted

## Get All Profile Previews

### GET localhost:8000/api/profile

### Response Body

```{json}
[
    {
        profileId: string,
        userName: string,
        price: number,
        schoolAdmitted: string,
        purchaseCount: number,
    }
]
```

## Get Unlocked Profile Previews

### GET localhost:8000/api/profile/unlocked

### Response Body

```{json}
[
    {
        profileId: string,
        userName: string,
        price: number,
        schoolAdmitted: string,
        purchaseCount: number,
    }
]
```

### Remarks

- User needs to be logged in

## Get Saved Profile Previews

### GET localhost:8000/api/profile/saved

### Response Body

```{json}
[
    {
        profileId: string,
        userName: string,
        price: number,
        schoolAdmitted: string,
        purchaseCount: number,
    }
]
```

### Remarks

- User needs to be logged in

## Unlock Profile

### PUT localhost:8000/api/user/unlock/:profileId

### Remarks

- User needs to be logged in

## Save Profile

### PUT localhost:8000/api/user/save/:profileId

### Remarks

- User needs to be logged in
