aws ecr get-login-password --profile $AWS_PROFILE --region $AWS_REGION \
    | docker login --username AWS --password-stdin $AWS_USER.dkr.ecr.$AWS_REGION.amazonaws.com
