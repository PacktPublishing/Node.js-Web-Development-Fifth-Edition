
printf $TWITTER_CONSUMER_KEY    | docker secret create TWITTER_CONSUMER_KEY -
printf $TWITTER_CONSUMER_SECRET | docker secret create TWITTER_CONSUMER_SECRET -

docker stack deploy  --compose-file docker-compose.yml notes

