
data "aws_ecr_repository" "notes" {
    name = "svc-notes"
}

data "aws_ecr_repository" "userauth" {
    name = "svc-userauth"
}

