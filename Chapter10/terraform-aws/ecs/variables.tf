variable "notes_port"           { default = 80 }
variable "notes_fargate_cpu"    { default = 256 }
variable "notes_fargate_memory" { default = 512 }
// variable "notes_count"          { default = 3 }
variable "notes_count"          { default = 1 }

variable "userauth_port"        { default = 5858 }
variable "userauth_fargate_cpu" { default = 256 }
variable "userauth_fargate_memory" { default = 512 }
variable "userauth_count"       { default = 1 }


variable "redis_fargate_cpu"    { default = 256 }
variable "redis_fargate_memory" { default = 512 }
variable "redis_count"          { default = 1 }
variable "redis_port"           { default = 6379 }

variable "ecs_task_execution_role_name" {
  description = "ECS task execution role name"
  default = "myEcsTaskExecutionRole"
}
