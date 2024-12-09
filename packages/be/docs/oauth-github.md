## OAuth with GitHub

```plantuml
actor user
participant FE
participant BE
participant GH

user->FE: click GH login

FE->BE: request oauth start
BE-->FE: github url
FE->GH: redirect to github

GH->BE: redirect to callback
BE->GH: request access token
GH-->BE: access token
BE->GH: request user details
GH-->BE: user details
BE->FE: redirect to page with SSO token
FE->BE: login with token
BE-->FE: login response (cookie)
```
