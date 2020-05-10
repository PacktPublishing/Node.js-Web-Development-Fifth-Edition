
locals {
  twitter_secret_string = jsondecode(data.aws_secretsmanager_secret_version.NOTES_TWITTER_TOKENS.secret_string)
}

resource "aws_ecs_task_definition" "notes" {
  family                   = "${data.terraform_remote_state.vpc.outputs.vpc_name}-notes-task"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  // Uncomment this if using a single Service
  // cpu                      = var.nginx_fargate_cpu + var.app_fargate_cpu
  // memory                   = var.nginx_fargate_memory + var.app_fargate_memory
  // Comment-out the following two lines if using a single Service
  //
  //
  // Doing this calculation results in this error:
  //    No Fargate configuration exists for given values.
  // Answer: https://code.thebur.net/2018/05/11/no-fargate-configuration-exists-for-given-values/
  // Basically, Fargate requires specific sizes.  Fargate is not helpful
  // which would be to round up.  Instead it requires that we specify
  // the exact size.
  cpu                      = 1024 //  var.notes_fargate_cpu * 3//  + var.userauth_fargate_cpu + var.redis_fargate_cpu
  memory                   = 2048 // var.notes_fargate_memory * 3 //  + var.userauth_fargate_memory + var.redis_fargate_memory
  container_definitions    = jsonencode(
        [
            {
                name = "notes"
                image = data.aws_ecr_repository.notes.repository_url
                cpu = var.notes_fargate_cpu
                memory = var.notes_fargate_memory
                networkMode = "awsvpc"
                logConfiguration = {
                    logDriver = "awslogs"
                    options = {
                        awslogs-group = "/ecs/${data.terraform_remote_state.vpc.outputs.vpc_name}-notes"
                        awslogs-region = data.terraform_remote_state.vpc.outputs.aws_region
                        awslogs-stream-prefix = "ecs"
                    }
                }
                portMappings = [ {
                    containerPort = var.notes_port
                    hostPort = var.notes_port
                } ]
                environment = [ {
                    name = "PORT"
                    value = tostring(var.notes_port)
                }, {
                    name = "USER_SERVICE_URL"
                    value = "http://127.0.0.1:${var.userauth_port}"
                    // value = "http://svc-userauth.local:${var.userauth_port}" 
                }, {
                    name = "REDIS_ENDPOINT"
                    // value = "notes-redis.ciqwft.ng.0001.usw2.cache.amazonaws.com"
                    value = "127.0.0.1"
                    // value = "redis.local"
                }, {
                    name = "TWITTER_CONSUMER_KEY"
                    value = local.twitter_secret_string.TWITTER_CONSUMER_KEY
                }, {
                    name = "TWITTER_CONSUMER_SECRET"
                    value = local.twitter_secret_string.TWITTER_CONSUMER_SECRET
                }, {
                    name = "TWITTER_CALLBACK_HOST"
                    value = "http://${aws_lb.notes.dns_name}:${var.notes_port}"
                }, {
                    name = "SEQUELIZE_DBHOST"
                    value = data.terraform_remote_state.db.outputs.notesdb-address
                } ]
            },
            {
                name = "redis"
                image = "redis"
                cpu = var.redis_fargate_cpu
                memory = var.redis_fargate_memory
                networkMode = "awsvpc"
                logConfiguration = {
                    logDriver = "awslogs"
                    options = {
                        awslogs-group = "/ecs/${data.terraform_remote_state.vpc.outputs.vpc_name}-redis"
                        awslogs-region = data.terraform_remote_state.vpc.outputs.aws_region
                        awslogs-stream-prefix = "ecs"
                    }
                }
                /* portMappings = [ {
                    containerPort = var.redis_port
                    hostPort = var.redis_port
                } ] */
            },
            {
                name = "userauth"
                image = data.aws_ecr_repository.userauth.repository_url
                cpu = var.userauth_fargate_cpu
                memory = var.userauth_fargate_memory
                networkMode = "awsvpc"
                logConfiguration = {
                    logDriver = "awslogs"
                    options = {
                        awslogs-group = "/ecs/${data.terraform_remote_state.vpc.outputs.vpc_name}-userauth"
                        awslogs-region = data.terraform_remote_state.vpc.outputs.aws_region
                        awslogs-stream-prefix = "ecs"
                    }
                }
                /* portMappings = [ {
                    containerPort = var.userauth_port
                    hostPort = var.userauth_port
                } ] */
                environment = [ {
                    name = "PORT"
                    value = tostring(var.userauth_port)
                }, {
                    name = "SEQUELIZE_DBHOST"
                    value = data.terraform_remote_state.db.outputs.usersdb-address
                } ]
            }
        ]
  )
}

data "aws_secretsmanager_secret" "NOTES_TWITTER_TOKENS" {
  arn = "arn:aws:secretsmanager:us-west-2:098106984154:secret:NOTES_TWITTER_TOKENS-cWJvbX"
}

data "aws_secretsmanager_secret_version" "NOTES_TWITTER_TOKENS" {
  secret_id = data.aws_secretsmanager_secret.NOTES_TWITTER_TOKENS.id
}

resource "aws_ecs_service" "notes" {
  name            = "${data.terraform_remote_state.vpc.outputs.vpc_name}-notes-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.notes.arn
  desired_count   = var.notes_count
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.notes_task.id]
    subnets          = [ 
        data.terraform_remote_state.vpc.outputs.subnet_private1_id, 
        data.terraform_remote_state.vpc.outputs.subnet_private2_id ]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.notes.id
    container_name   = "notes"
    container_port   = var.notes_port
  }

  depends_on = [ 
      aws_alb_listener.notes,
      aws_iam_role_policy_attachment.ecs_task_execution_role,
      aws_security_group.notes_task ]
}

resource "aws_security_group" "notes_task" {
  name        = "${data.terraform_remote_state.vpc.outputs.vpc_name}-notes-task-security-group"
  vpc_id      = data.terraform_remote_state.vpc.outputs.vpc_id 

  ingress {
    protocol        = "tcp"
    from_port       = 0
    to_port         = var.notes_port
    cidr_blocks     = [ data.terraform_remote_state.vpc.outputs.vpc_cidr ]
  }

/*  Uncomment this to enable access to the user authentication port.
  ingress {
    protocol        = "tcp"
    from_port       = 0
    to_port         = var.userauth_port
    cidr_blocks     = [ data.terraform_remote_state.vpc.outputs.vpc_cidr ]
  }
*/

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_cloudwatch_log_group" "notes_log_group" {
  name              = "/ecs/${data.terraform_remote_state.vpc.outputs.vpc_name}-notes"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_stream" "notes_log_stream" {
  name           = "${data.terraform_remote_state.vpc.outputs.vpc_name}-notes-log-stream"
  log_group_name = aws_cloudwatch_log_group.notes_log_group.name
}

resource "aws_cloudwatch_log_group" "redis_log_group" {
  name              = "/ecs/${data.terraform_remote_state.vpc.outputs.vpc_name}-redis"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_stream" "redis_log_stream" {
  name           = "${data.terraform_remote_state.vpc.outputs.vpc_name}-redis-log-stream"
  log_group_name = aws_cloudwatch_log_group.redis_log_group.name
}

resource "aws_cloudwatch_log_group" "userauth_log_group" {
  name              = "/ecs/${data.terraform_remote_state.vpc.outputs.vpc_name}-userauth"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_stream" "userauth_log_stream" {
  name           = "${data.terraform_remote_state.vpc.outputs.vpc_name}-userauth-log-stream"
  log_group_name = aws_cloudwatch_log_group.userauth_log_group.name
}