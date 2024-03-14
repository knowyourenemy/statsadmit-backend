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
    schoolsAdmitted: [
        {
            name: string,
            degree: string,
            major: string,
            status: string,
            essays: [
                {
                    title: string,
                    content: string
                }
            ]
        }
    ],
    schoolCountry: string,
    currentMajor: string,
    currentSchool: string,
    currentDescription: string,
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
    username: string,
    dateCreated: number,
    price: number,
    schoolsAdmitted: [
        {
            name: string,
            degree: string,
            major: string,
            status: string,
            essays: [
                {
                    title: string,
                    content: string
                }
            ]
        }
    ],
    schoolCountry: string,
    purchaseCount: number,
    testScores: [
        {
            test: string,
            score: string
        },
    ],
    published: boolean,
    currentSchool: string,
    currentMajor: string,
    currentDescription: string,
    imageUrl: string
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
        username: string,
        price: number,
        schoolsAdmitted: [
            {
                name: string,
                degree: string,
                major: string,
                status: string,
            }
        ],
        purchaseCount: number,
        imageUrl: string
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
        username: string,
        price: number,
        schoolsAdmitted: [
            {
                name: string,
                degree: string,
                major: string,
                status: string,
            }
        ],
        purchaseCount: number,
        imageUrl: string
    }
]
```

### Remarks

- User needs to be logged in
- Essays have been deliberately excluded from schoolsAdmitted

## Get Saved Profile Previews

### GET localhost:8000/api/profile/saved

### Response Body

```{json}
[
    {
        profileId: string,
        username: string,
        price: number,
        schoolsAdmitted: [
            {
                name: string,
                degree: string,
                major: string,
                status: string,
            }
        ],
        purchaseCount: number,
        imageUrl: string
    }
]
```

### Remarks

- User needs to be logged in
- Essays have been deliberately excluded from schoolsAdmitted

## Unlock Profile

### PUT localhost:8000/api/user/unlock/:profileId

### Remarks

- User needs to be logged in

## Save Profile

### PUT localhost:8000/api/user/save/:profileId

### Remarks

- User needs to be logged in
- Essays have been deliberately excluded from schoolsAdmitted
