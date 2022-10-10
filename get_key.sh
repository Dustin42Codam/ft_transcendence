#!/bin/bash

CLIENT_ID="7c59d418a12bb6da95283ca1866d0db3946ff94528e8d7be5b98545c31f892ff"
SECRET="29711830611f2e2ef46316991d6d599275faaa117c896ac41f22a84bb90fc411"

# client credential grant
# QUERY="grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${SECRET}"
# curl -X POST --data "$QUERY" https://api.intra.42.fr/oauth/token

# username-password
# curl https://api.intra.42.fr/oauth/authorize?${POST}


# Authorization Code
# QUERY="response_type=code&client_id=${CLIENT_ID}&client_secret=${SECRET}"

# curl -v https://api.intra.42.fr/oauth/authorize?client_id=7c59d418a12bb6da95283ca1866d0db3946ff94528e8d7be5b98545c31f892ff&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2F&response_type=code

# curl -X POST --data "$QUERY" https://api.intra.42.fr/oauth/authorize

# tmp access code
# http://localhost:5173/?code=72b1ad48e3c3cd05c958be0aac46e61c094b167f9c8cfc72f852b41e4869172b
CODE="72b1ad48e3c3cd05c958be0aac46e61c094b167f9c8cfc72f852b41e4869172b"

curl -F grant_type=authorization_code \
-F client_id=$CLIENT_ID \
-F client_secret=$SECRET \
-F code=$CODE \
-F redirect_uri=http://localhost:5173/ \
-X POST https://api.intra.42.fr/oauth/token

curl -H "Authorization: Bearer 19dfa56309c0514a312d1e1c3eb12a9f9edeb117ed85edbe85adc70da37a35aa" https://api.intra.42.fr/v2/me

# token info
# curl -H "Authorization: Bearer TOKEN" https://api.intra.42.fr/oauth/token/info
