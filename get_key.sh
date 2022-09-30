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
curl -X POST --data "$QUERY" https://api.intra.42.fr/oauth/authorize



# token info
# curl -H "Authorization: Bearer TOKEN" https://api.intra.42.fr/oauth/token/info
